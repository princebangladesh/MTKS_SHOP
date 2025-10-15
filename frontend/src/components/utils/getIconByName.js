import * as SiIcons from 'react-icons/si';

export const getIconByName = (iconName) => {
  return SiIcons[iconName] || SiIcons.SiApple; // default fallback
};