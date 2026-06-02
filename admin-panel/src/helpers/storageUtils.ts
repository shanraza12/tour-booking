import CryptoJS from 'crypto-js';

const SECRET_KEY = 'fallback-dev-key-change-this';

const encrypt = (data) => {
  if (!data) return null;
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

const decrypt = (ciphertext) => {
  if (!ciphertext) return null;
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted ? JSON.parse(decrypted) : null;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null; // Tampered or wrong key
  }
};

export const setLocalItem = (key, value) => {
  const encrypted = encrypt(value);
  if (encrypted) {
    localStorage.setItem(key, encrypted);
  }
};

export const getLocalItem = (key) => {
  const encrypted = localStorage.getItem(key);
  return decrypt(encrypted);
};

export const removeLocalItem = (key) => {
  localStorage.removeItem(key);
};

export const setSessionItem = (key, value) => {
  const encrypted = encrypt(value);
  if (encrypted) {
    sessionStorage.setItem(key, encrypted);
  }
};

export const getSessionItem = (key) => {
  const encrypted = sessionStorage.getItem(key);
  return decrypt(encrypted);
};

export const removeSessionItem = (key) => {
  sessionStorage.removeItem(key);
};