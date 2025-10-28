/**
 * Утиліти для автокомпліту
 */

/**
 * Фільтрує масив по введеному тексту
 */
export function filterAutocomplete(items: readonly string[], query: string, limit: number = 10): string[] {
  if (!query || query.length < 1) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return items
    .filter(item => item.toLowerCase().includes(lowerQuery))
    .slice(0, limit);
}

/**
 * Нормалізує назву навички (перша літера велика)
 */
export function normalizeSkillName(skill: string): string {
  if (!skill) return '';
  const trimmed = skill.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Перевіряє чи навичка вже існує в списку (case-insensitive)
 */
export function isSkillDuplicate(skill: string, existingSkills: string[]): boolean {
  const normalized = skill.toLowerCase().trim();
  return existingSkills.some(s => s.toLowerCase() === normalized);
}

