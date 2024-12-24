import * as base64 from './base64';

export { base64 }; // Expose base64 for external use
console.log(base64);

export async function generateSalt(): Promise<Uint8Array> {
  return crypto.getRandomValues(new Uint8Array(32));
}

export function deriveBoxId(salt: Uint8Array): number {
  const view = new DataView(salt.buffer, 0, 4);
  return view.getUint32(0) % 9973;
}

export async function generateKeyCode(): Promise<string> {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return base64.encode(bytes);
}

export async function deriveKey(
  seed: string,
  salt: Uint8Array,
  boxId: number,
  keyCode: string
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${seed}${base64.encode(salt)}${boxId}${keyCode}`);
  
  const hash = await crypto.subtle.digest('SHA-256', data);
  
  return crypto.subtle.importKey(
    'raw',
    hash,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptSecret(
  key: CryptoKey,
  secret: string
): Promise<{ ciphertext: string; iv: string }> {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  
  return {
    ciphertext: base64.encode(ciphertext),
    iv: base64.encode(iv)
  };
}

export async function decryptSecret(
  key: CryptoKey,
  ciphertext: string,
  iv: string
): Promise<string> {
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64.decode(iv) },
    key,
    base64.decode(ciphertext).buffer
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}
