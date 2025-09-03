export const IconMap = {
  'check-circle': '\ue77d',
  'close-circle': '\ue77e',
  'right': '\ue7eb',
  'left': '\ue7ec',
  'up': '\ue7ee',
  'down': '\ue7ef',
  'search': '\ue752',
  'ellipsis': '\ue7fc',
  'picture': '\ue79f',
  'message': '\ue78f',
  'star': '\ue7df',
  'heart': '\ue7df',
  // 更多图标...
} as const;

export type IconName = keyof typeof IconMap;
