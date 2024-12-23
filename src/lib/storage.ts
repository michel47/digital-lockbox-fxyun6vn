export interface Box {
  ciphertext: string;
  iv: string;
  maxTrials: number;
  trialsLeft: number;
}

export function saveBox(boxId: string, box: Box): void {
  localStorage.setItem(`box_${boxId}`, JSON.stringify(box));
}

export function getBox(boxId: string): Box | null {
  const data = localStorage.getItem(`box_${boxId}`);
  return data ? JSON.parse(data) : null;
}

export function removeBox(boxId: string): void {
  localStorage.removeItem(`box_${boxId}`);
}