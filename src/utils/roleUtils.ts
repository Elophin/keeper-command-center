export type UserRole = 'admin' | 'employee' | 'hexanurse' | 'security';

/**
 * Determines user role based on email domain patterns
 */
export const getRoleFromEmail = (email: string): UserRole => {
  const emailLower = email.toLowerCase();
  
  if (emailLower === 'admin@hexaware.com') {
    return 'admin';
  }
  
  if (emailLower === 'nurse@hexaware.com') {
    return 'hexanurse';
  }
  
  if (emailLower === 'security@hexaware.com') {
    return 'security';
  }
  
  if (emailLower === 'employee@hexaware.com') {
    return 'employee';
  }
  
  // Default fallback for any other domain
  return 'employee';
};

/**
 * Gets default employee ID based on email
 */
export const getEmployeeIdFromEmail = (email: string): string => {
  // Extract username part before @ and use as employee ID
  const username = email.split('@')[0];
  return username.toUpperCase();
};

/**
 * Gets default department based on role
 */
export const getDepartmentFromRole = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Administration';
    case 'hexanurse':
      return 'Medical';
    case 'security':
      return 'Security';
    case 'employee':
    default:
      return 'General';
  }
};

/**
 * Gets default office location based on role
 */
export const getOfficeLocationFromRole = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return 'Admin Office - Floor 5';
    case 'hexanurse':
      return 'Medical Wing - Floor 2';
    case 'security':
      return 'Security Station - Ground Floor';
    case 'employee':
    default:
      return 'General Office - Floor 3';
  }
};