export const isDarkMode = () => {
  return document.body.classList.contains('dark');
};

export const isValidEmail = (email: string) => {
  const emailPattern = /^(?!\.)([^\s@]+)@[^\s@]+\.[^\s@]{2,}(?<!\.)$/;
  return emailPattern.test(email);
};

export const isEmpty = (obj: any) => {
  if (typeof obj === 'number') return false;
  if (obj === undefined || obj === null || !obj.toString().trim()) return true;
  return false;
};
