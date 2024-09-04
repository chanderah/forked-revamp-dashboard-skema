export const isDarkMode = () => {
  return document.body.classList.contains('dark');
};

export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isEmpty = (obj: any) => {
  if (typeof obj === 'number') return false;
  if (obj === undefined || obj === null || !obj.toString().trim()) return true;
  return false;
};
