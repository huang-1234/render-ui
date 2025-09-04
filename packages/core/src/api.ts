const baseFontSize = 12;
export function rem(px: number): string {
  return `${px / baseFontSize}rem`;
}

export function rpx(px: number): string {
  return `${px / baseFontSize}rpx`;
}

export function go(url: string): void {
  window.location.href = url;
}

export function back(): void {
  window.history.back();
}

export function redirect(url: string): void {
  window.location.href = url;
}

export function switchTab(url: string): void {
  window.location.href = url;
}

export function navigateBack(): void {
  window.history.back();
}