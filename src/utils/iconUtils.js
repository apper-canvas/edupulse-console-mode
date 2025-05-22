import * as LucideIcons from 'lucide-react';

/**
 * Gets a Lucide icon component by name
 * @param {string} iconName - The name of the icon (kebab-case as used in Lucide)
 * @returns {React.ComponentType} The icon component
 */
export const getIcon = (iconName) => {
  // Convert kebab-case to PascalCase for React component name
  const pascalCase = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // Get the icon component from Lucide
  const IconComponent = LucideIcons[pascalCase];

  // Return the icon or a fallback
  if (IconComponent) {
    return IconComponent;
  } else {
    console.warn(`Icon "${iconName}" not found in Lucide. Using fallback.`);
    
    // Return a simple square as fallback
    return (props) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    );
  }
};