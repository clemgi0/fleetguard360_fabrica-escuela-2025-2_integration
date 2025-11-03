import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

export const setCookie = (token: string): void => {
  Cookies.set(TOKEN_KEY, token, { 
    expires: 7, // Expira en 7 días
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

export const getCookie = (): string | undefined => {
  return Cookies.get(TOKEN_KEY);
};

export const removeCookie = (): void => {
  Cookies.remove(TOKEN_KEY);
};

