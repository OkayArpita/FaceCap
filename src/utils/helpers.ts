const toHex = (value: number): string => value.toString(16).padStart(2, '0');
const secureRandomUnit = (): number => {
  const bytes = new Uint8Array(4);
  globalThis.crypto.getRandomValues(bytes);
  const raw = new DataView(bytes.buffer).getUint32(0, false);
  return raw / 0x100000000;
};

export const createId = (prefix: string): string => {
  const bytes = new Uint8Array(8);
  globalThis.crypto.getRandomValues(bytes);
  const randomPart = Array.from(bytes, toHex).join('');
  return `${prefix}_${Date.now()}_${randomPart}`;
};

export const randomConfidence = (): number =>
  Math.round((85 + secureRandomUnit() * 14) * 100) / 100;

export const simpleHash = (value: string): string => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
};

export const wait = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));
