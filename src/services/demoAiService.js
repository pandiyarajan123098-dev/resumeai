/**
 * Controlled Demo Fallback Analysis Service
 * Used for offline competition presentations or when VITE_USE_DEMO_AI=true is configured.
 */

export function generateDemoAnalysis(setup) {
  const resumeName = setup?.name || 'Pandi_Resume.pdf';
  const targetRole = setup?.targetRole || setup?.target || 'Frontend Developer';
  const company = setup?.company || '';
  const analysisType = setup?.type || 'domain';

  // Dynamic realistic score calculation based on target role
  let score = 78;
  if (targetRole.toLowerCase().includes('frontend') || targetRole.toLowerCase().includes('full stack')) {
    score = 84;
  } else if (targetRole.toLowerCase().includes('designer') || targetRole.toLowerCase().includes('ui/ux')) {
    score = 72;
  }

  const companyPrefix = company ? ` at ${company}` : '';

  return {
    id: `hist-${Date.now()}`,
    resumeId: setup?.resumeId || 'res-101',
    resumeName,
    analysisType,
    typeLabel:
      analysisType === 'domain'
        ? 'Domain Analysis'
        : analysisType === 'company'
        ? 'Company + Role Match'
        : 'Job Description Match',
    target: company ? `${company} (${targetRole})` : targetRole,
    targetRole,
    company,
    score,

    summary: `Your resume demonstrates a strong foundation for ${targetRole}${companyPrefix}. Technical competencies and structural formatting are clean, but adding quantifiable achievements and missing keywords will maximize ATS ranking.`,

    strengths: [
      {
        title: `Strong ${targetRole} Technical Foundation`,
        desc: `Your experience aligns well with core requirements and responsibilities for ${targetRole}.`,
      },
      {
        title: 'Clean Structural Formatting',
        desc: 'Clear section headers and easily parsable standard layout.',
      },
      {
        title: 'Relevant Project Artifacts',
        desc: 'Good demonstration of practical application and technical tooling.',
      },
    ],

    improvements: [
      {
        title: 'Improve ATS Keyword Coverage',
        desc: `Include high-priority industry keywords relevant to ${targetRole}.`,
        priority: 'High',
        priorityVariant: 'danger',
      },
      {
        title: 'Add Quantifiable Impact Metrics',
        desc: 'Rephrase bullet points to highlight measurable results (e.g. %, $, numbers).',
        priority: 'Medium',
        priorityVariant: 'warning',
      },
      {
        title: 'Highlight Testing & Architecture Experience',
        desc: 'Include unit testing, code review, and state management details.',
        priority: 'Low',
        priorityVariant: 'indigo',
      },
    ],

    breakdown: [
      { name: 'Skills Match', value: Math.min(100, score + 6), color: 'var(--success)' },
      { name: 'Experience', value: Math.max(50, score - 6), color: 'var(--primary)' },
      { name: 'Projects', value: Math.max(50, score - 10), color: 'var(--secondary)' },
      { name: 'Keywords', value: Math.max(40, score - 18), color: 'var(--warning)' },
      { name: 'Resume Structure', value: 90, color: 'var(--success)' },
    ],

    recommendedSkills: ['TypeScript', 'Next.js', 'REST APIs', 'Testing (Jest/Cypress)', 'Performance Optimization'],

    nextSteps: [
      {
        num: 1,
        title: 'Improve keyword usage',
        desc: 'Incorporate role-relevant technical keywords naturally into your experience bullet points.',
      },
      {
        num: 2,
        title: 'Strengthen project descriptions',
        desc: 'Explain the technical problem, tools used, and final deliverable.',
      },
      {
        num: 3,
        title: 'Add measurable achievements',
        desc: 'Use numbers and percentages to demonstrate performance impact.',
      },
    ],

    createdAt: new Date().toISOString(),
  };
}
