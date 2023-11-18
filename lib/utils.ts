import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getOrigin = (req?: Request) => {
  if (req) {
    const host = req.headers.get('host')
    const forwardedProto = req.headers.get('x-forwarded-proto')

    const protocol = forwardedProto === 'https' ? 'https' : 'http';

    return `${protocol}://${host}`
  }

  return window.location.origin
}

export const getReceiptIDFromURL = (url: string): string => {
  const parsedUrl = new URL(url);
  const path = parsedUrl.pathname;

  const parts = path.split('/');
  if (parts.length > 1) {
    const uuid = parts[parts.length - 1].split('.')[0];
    return uuid;
  }

  return "";
}
