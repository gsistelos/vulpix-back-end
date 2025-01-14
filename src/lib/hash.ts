import { hash } from 'crypto';

export function hashPassword(password: string) {
  return hash(password, 'sha256');
}

export function comparePasswords(password: string, hash: string) {
  return hashPassword(password) === hash;
}
