
/**
 * Phone number formatting and validation utilities
 */

export const formatToE164 = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+1${digits}`;
  } else if (digits.length > 10 && !phone.startsWith("+")) {
    return `+${digits}`;
  } else if (phone.startsWith("+")) {
    return `+${digits}`;
  }
  return `+${digits}`;
};

export const validatePhoneNumber = (phone: string): boolean => {
  const e164Regex = /^\+[1-9]\d{6,14}$/;
  return e164Regex.test(phone);
};
