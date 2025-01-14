import { hash } from 'crypto';

export function hashPassword(password: string) {
  return hash('sha256', password);
}

export function comparePasswords(password: string, hash: string) {
  return hashPassword(password) === hash;
}
