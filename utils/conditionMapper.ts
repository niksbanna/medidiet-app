/**
 * Utility for mapping display names of medical conditions to standardized slugs
 * that can be used consistently across the application.
 */

// Map of display names to slug keys
export const CONDITION_MAP: Record<string, string> = {
  'Diabetes Type 1': 'diabetes',
  'Diabetes Type 2': 'diabetes',
  'Hypertension': 'hypertension',
  'High Blood Pressure': 'hypertension',
  'Kidney Disease': 'kidney_disease',
  'Chronic Kidney Disease': 'kidney_disease',
  'Thyroid Disorder': 'thyroid_disorder',
  'Hypothyroidism': 'thyroid_disorder',
  'Hyperthyroidism': 'thyroid_disorder',
  'Heart Disease': 'heart_disease',
  'Cardiovascular Disease': 'heart_disease',
  'Celiac Disease': 'celiac_disease',
  'Gluten Intolerance': 'celiac_disease',
  'Irritable Bowel Syndrome': 'ibs',
  'IBS': 'ibs',
  'Polycystic Ovary Syndrome': 'pcos',
  'PCOS': 'pcos'
  // Add more mappings as needed
};

/**
 * Maps a display name of a medical condition to its standardized slug key.
 * If no mapping exists, converts the input to a slug format.
 * 
 * @param displayName The display name of the medical condition
 * @returns The standardized slug key
 */
export function mapConditionToSlug(displayName: string): string {
  // Check if we have a direct mapping
  if (CONDITION_MAP[displayName]) {
    return CONDITION_MAP[displayName];
  }
  
  // Otherwise, convert to a slug format (lowercase, underscores)
  return displayName.toLowerCase().replace(/\s+/g, '_');
}

/**
 * Gets the display name for a slug key, if available.
 * 
 * @param slug The slug key
 * @returns The display name or the original slug if no mapping exists
 */
export function getConditionDisplayName(slug: string): string {
  // Find the display name by searching through the map
  for (const [display, mappedSlug] of Object.entries(CONDITION_MAP)) {
    if (mappedSlug === slug) {
      return display;
    }
  }
  
  // If no mapping exists, convert from slug format to display format
  return slug
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}