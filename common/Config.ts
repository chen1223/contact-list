export const BACKEND_ENDPOINT =
  process.env.NEXT_PUBLIC_BACKEND_ENDPOINT || 'http://localhost:3000';

export const API_PATHS = {
  CONTACT_API: `${BACKEND_ENDPOINT}/api/contacts`,
};

export const MESSAGE_DURATION = 3000;
