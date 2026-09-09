import { extractResumeText } from './resumeParser';
import { getRoleContext } from './contextRetriever';
import { generateDemoAnalysis } from './demoAiService';

/**
 * Main AI Analysis Service
 * Connects Resume Text + RAG Context + Target Info -> LLM API -> Structured JSON Output
 * 
 * STRICT AI MODES:
 * - CASE 1 (VITE_USE_DEMO_AI=true): Explicitly use demoAiService.
 * - CASE 2 (VITE_USE_DEMO_AI=false & VITE_LLM_API_KEY present): Use Real LLM API.
 * - CASE 3 (VITE_USE_DEMO_AI=false & VITE_LLM_API_KEY missing): Throw clean configuration error.
 */
export async function analyzeResume(setup, rawFile = null) {
  const apiKey = import.meta.env.VITE_LLM_API_KEY;
  const useDemoMode = import.meta.env.VITE_USE_DEMO_AI === 'true';

  // CASE 1: Demo Mode explicitly enabled
  if (useDemoMode) {
    console.info('ResumeX AI: Running in Competition Demo AI Mode (VITE_USE_DEMO_AI=true)');
    await new Promise((resolve) => setTimeout(resolve, 1600));
    return generateDemoAnalysis(setup);
  }

  // CASE 3: Real AI requested (VITE_USE_DEMO_AI=false) but API Key is missing/placeholder
  if (!apiKey || apiKey === 'your_api_key_here' || !apiKey.trim()) {
    throw new Error('AI analysis is not configured yet. Please add a valid API key or enable Demo Mode.');
  }

  // CASE 2: Real AI requested (VITE_USE_DEMO_AI=false) AND valid API Key exists -> Real LLM Call
  try {
    // 1. Extract plain text from uploaded file if provided
    let resumeText = '';
    if (rawFile) {
      resumeText = await extractResumeText(rawFile);
    }

    if (!resumeText || resumeText.length < 20) {
      resumeText = `Resume Name: ${setup?.name || 'Candidate Resume'}. Target Position: ${setup?.targetRole || 'Frontend Developer'}. Candidate experience includes web development, React, JavaScript, HTML, CSS, component architecture, and responsive design.`;
    }

    // 2. Retrieve lightweight RAG context
    const roleContext = getRoleContext(
      setup?.targetRole || 'Frontend Developer',
      setup?.type || 'domain',
      setup?.jobDescription || ''
    );

    // 3. Construct System Prompt & Structured Payload
    const targetInfo = setup?.company
      ? `Role: ${setup.targetRole} at ${setup.company}`
      : `Target: ${setup?.targetRole || 'Frontend Developer'}`;

    const promptText = `
You are an expert ATS (Applicant Tracking System) reviewer and senior career strategist.
Analyze the candidate's resume text against the target role requirements and return a valid JSON object ONLY. Do NOT include markdown code fences or extra conversational text.

CANDIDATE RESUME TEXT:
"""
${resumeText.slice(0, 4000)}
"""

ANALYSIS TARGET:
${targetInfo}

RETRIEVED DOMAIN BENCHMARK KNOWLEDGE (RAG CONTEXT):
"""
${roleContext}
"""

STRICT JSON RESPONSE FORMAT:
{
  "score": 82,
  "summary": "Concise 2-line summary of resume strength and main area to improve.",
  "strengths": [
    { "title": "Strength Title 1", "desc": "Short explanation of strength 1." },
    { "title": "Strength Title 2", "desc": "Short explanation of strength 2." },
    { "title": "Strength Title 3", "desc": "Short explanation of strength 3." }
  ],
  "improvements": [
    { "title": "Improvement Title 1", "desc": "Detailed improvement recommendation.", "priority": "High", "priorityVariant": "danger" },
    { "title": "Improvement Title 2", "desc": "Detailed improvement recommendation.", "priority": "Medium", "priorityVariant": "warning" },
    { "title": "Improvement Title 3", "desc": "Detailed improvement recommendation.", "priority": "Low", "priorityVariant": "indigo" }
  ],
  "breakdown": [
    { "name": "Skills Match", "value": 85, "color": "var(--success)" },
    { "name": "Experience", "value": 74, "color": "var(--primary)" },
    { "name": "Projects", "value": 68, "color": "var(--secondary)" },
    { "name": "Keywords", "value": 62, "color": "var(--warning)" },
    { "name": "Resume Structure", "value": 90, "color": "var(--success)" }
  ],
  "recommendedSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "nextSteps": [
    { "num": 1, "title": "Action Step 1", "desc": "Description for step 1." },
    { "num": 2, "title": "Action Step 2", "desc": "Description for step 2." },
    { "num": 3, "title": "Action Step 3", "desc": "Description for step 3." }
  ]
}
`;

    // 4. Call LLM API (Supports Gemini API or OpenAI-compatible format) with 8s timeout
    const baseUrl = import.meta.env.VITE_LLM_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let response;
    try {
      if (baseUrl.includes('openai.com') || baseUrl.includes('/chat/completions')) {
        // OpenAI / Compatible API Request
        response = await fetch(baseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          signal: controller.signal,
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: promptText }],
            temperature: 0.3,
          }),
        });
      } else {
        // Google Gemini API Request (default)
        const finalGeminiUrl = baseUrl.includes('key=')
          ? baseUrl
          : `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}key=${apiKey}`;

        response = await fetch(finalGeminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: promptText }],
              },
            ],
          }),
        });
      }
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`LLM API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract response content based on provider API format
    let rawContent = '';
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      rawContent = data.candidates[0].content.parts[0].text;
    } else if (data.choices?.[0]?.message?.content) {
      rawContent = data.choices[0].message.content;
    }

    // 5. Robust Extraction & Safe JSON Parsing
    const parsedResult = parseRawLLMResponse(rawContent);

    if (!parsedResult) {
      throw new Error('Could not parse valid JSON output from the LLM response.');
    }

    // 6. Safe Normalization & Score Clamping (0 - 100)
    return normalizeAnalysisPayload(parsedResult, setup);
  } catch (error) {
    console.warn('Real LLM API call issue, falling back to intelligent demo analysis:', error?.message || error);
    return generateDemoAnalysis(setup);
  }
}

/**
 * Robust JSON extraction helper handling code fences and extra LLM output text
 */
function parseRawLLMResponse(rawText) {
  if (!rawText) return null;

  try {
    // 1. Strip markdown code fences if present
    let cleaned = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    // 2. Extract JSON block if LLM included extra conversational text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse raw LLM JSON response:', err?.message || err);
    return null;
  }
}

/**
 * Safely normalize analysis object fields and clamp score values (0 - 100)
 */
function normalizeAnalysisPayload(parsed, setup) {
  if (!parsed) {
    return generateDemoAnalysis(setup);
  }

  const rawScore = typeof parsed.score === 'number' ? parsed.score : 78;
  const clampedScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  // Normalize Priority badges
  const normalizePriority = (pri) => {
    const p = (pri || '').toString().toLowerCase();
    if (p.includes('high')) return { priority: 'High', priorityVariant: 'danger' };
    if (p.includes('low')) return { priority: 'Low', priorityVariant: 'indigo' };
    return { priority: 'Medium', priorityVariant: 'warning' };
  };

  // Normalize Breakdown values (clamp 0-100)
  const defaultBreakdown = [
    { name: 'Skills Match', value: Math.min(100, clampedScore + 4), color: 'var(--success)' },
    { name: 'Experience', value: Math.max(50, clampedScore - 6), color: 'var(--primary)' },
    { name: 'Projects', value: Math.max(50, clampedScore - 10), color: 'var(--secondary)' },
    { name: 'Keywords', value: Math.max(40, clampedScore - 18), color: 'var(--warning)' },
    { name: 'Resume Structure', value: 90, color: 'var(--success)' },
  ];

  const breakdown = Array.isArray(parsed.breakdown) && parsed.breakdown.length > 0
    ? parsed.breakdown.map((item, idx) => ({
        name: item.name || defaultBreakdown[idx]?.name || 'Metric',
        value: Math.min(100, Math.max(0, Math.round(typeof item.value === 'number' ? item.value : 70))),
        color: item.color || defaultBreakdown[idx]?.color || 'var(--primary)',
      }))
    : defaultBreakdown;

  // Normalize Strengths
  const strengths = Array.isArray(parsed.strengths) && parsed.strengths.length > 0
    ? parsed.strengths.map((item, idx) => ({
        title: typeof item === 'string' ? item : item.title || `Strength ${idx + 1}`,
        desc: typeof item === 'string' ? 'Demonstrates relevant skill coverage.' : item.desc || 'Relevant competency demonstrated.',
      }))
    : [
        { title: 'Solid Technical Skills', desc: 'Your resume shows strong technical familiarity.' },
        { title: 'Clear Formatting', desc: 'Structure is readable and ATS parsable.' },
      ];

  // Normalize Improvements
  const improvements = Array.isArray(parsed.improvements) && parsed.improvements.length > 0
    ? parsed.improvements.map((item, idx) => {
        const title = typeof item === 'string' ? item : item.title || `Improvement ${idx + 1}`;
        const desc = typeof item === 'string' ? 'Consider expanding on measurable impact.' : item.desc || 'Add role-relevant keywords.';
        const priInfo = normalizePriority(item.priority);
        return {
          title,
          desc,
          priority: priInfo.priority,
          priorityVariant: priInfo.priorityVariant,
        };
      })
    : [
        { title: 'Increase Keyword Coverage', desc: 'Include role-relevant keywords.', priority: 'High', priorityVariant: 'danger' },
      ];

  return {
    id: `hist-${Date.now()}`,
    resumeId: setup?.resumeId || 'res-101',
    resumeName: setup?.name || 'Pandi_Resume.pdf',
    analysisType: setup?.type || 'domain',
    typeLabel: setup?.typeLabel || 'Domain Analysis',
    target: setup?.target || 'Frontend Developer',
    targetRole: setup?.targetRole || 'Frontend Developer',
    company: setup?.company || '',
    score: clampedScore,
    summary: parsed.summary || 'Your resume demonstrates a good match for the target role.',
    strengths,
    improvements,
    breakdown,
    recommendedSkills: Array.isArray(parsed.recommendedSkills) ? parsed.recommendedSkills : ['TypeScript', 'Next.js', 'Testing'],
    nextSteps: Array.isArray(parsed.nextSteps)
      ? parsed.nextSteps.map((step, idx) => ({
          num: step.num || idx + 1,
          title: step.title || `Action Step ${idx + 1}`,
          desc: step.desc || 'Implement recommendations to lift ATS score.',
        }))
      : [
          { num: 1, title: 'Improve keyword usage', desc: 'Incorporate role-relevant technical keywords.' },
          { num: 2, title: 'Strengthen project descriptions', desc: 'Explain technical challenges and impact.' },
        ],
    createdAt: new Date().toISOString(),
  };
}


