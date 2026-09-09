import { ROLE_KNOWLEDGE_BASE } from '../data/roleKnowledge';

/**
 * Lightweight RAG Context Retriever
 * Retrieves domain knowledge based on target role, company, or job description
 */
export function getRoleContext(targetRole, analysisType, customJobDesc = '') {
  // Normalize target role string
  const matchedRoleKey = Object.keys(ROLE_KNOWLEDGE_BASE).find(
    (key) => key.toLowerCase() === (targetRole || '').toLowerCase()
  ) || 'Frontend Developer';

  const knowledge = ROLE_KNOWLEDGE_BASE[matchedRoleKey] || ROLE_KNOWLEDGE_BASE['Frontend Developer'];

  if (analysisType === 'job_description' && customJobDesc.trim()) {
    return `
TARGET JOB DESCRIPTION CONTEXT:
"${customJobDesc.trim()}"

BENCHMARK ROLE KNOWLEDGE (${matchedRoleKey}):
- Required Core Skills: ${knowledge.requiredSkills.join(', ')}
- Critical ATS Keywords: ${knowledge.importantKeywords.join(', ')}
- Expected Portfolio Signals: ${knowledge.recommendedProjectSignals.join('; ')}
`;
  }

  return `
TARGET ROLE BENCHMARK KNOWLEDGE (${matchedRoleKey}):
- Required Core Skills: ${knowledge.requiredSkills.join(', ')}
- Critical ATS Keywords: ${knowledge.importantKeywords.join(', ')}
- Common Responsibilities: ${knowledge.commonResponsibilities.join('; ')}
- High Impact Project Signals: ${knowledge.recommendedProjectSignals.join('; ')}
- Standard Industry Tools: ${knowledge.expectedTools.join(', ')}
`;
}
