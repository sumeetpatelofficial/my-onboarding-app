import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatCardNumberForDisplay = (raw = "") => {
  const trimmed = raw.replace(/[^0-9]/g, "");
  return trimmed.replace(/(.{4})/g, "$1 ").trim();
};

export const maskCardNumber = (number = "") => {
  const clean = number.replace(/\D/g, ""); // keep digits only

  if (clean.length <= 4) return clean; // don't mask very short inputs

  const last4 = clean.slice(-4);
  const masked = clean.slice(0, -4).replace(/\d/g, "*");

  // Format into groups of 4
  return (masked + last4).replace(/(.{4})/g, "$1 ").trim();
};

export const maskCVV = (cvv = "") => {
  const clean = cvv.replace(/\D/g, "");
  return clean.replace(/\d/g, "*");
};

export const formatExpiryForDisplay = (raw = "") => {
  const digits = raw.replace(/[^0-9]/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export const getCardBrand = (num = "") => {
  if (!num) return "unknown";
  if (/^4/.test(num)) return "visa";
  if (/^5[1-5]/.test(num)) return "mastercard";
  if (/^3[47]/.test(num)) return "amex";
  if (/^6(?:011|5)/.test(num)) return "discover";
  return "unknown";
};