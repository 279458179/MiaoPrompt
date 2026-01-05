export interface PromptResponse {
  englishPrompt: string;
  chineseTranslation: string;
  negativePrompt: string;
  reasoning: string;
  suggestedAspectRatio: string;
}

export interface StyleOption {
  id: string;
  label: string;
  icon: string; // Emoji or simple text
  description: string;
}

export const STYLES: StyleOption[] = [
  { id: 'none', label: '自由发挥', icon: '✨', description: '不限制特定风格' },
  { id: 'anime', label: '日系动漫', icon: '🌸', description: '二次元、插画风格' },
  { id: 'photorealistic', label: '真实摄影', icon: '📸', description: '像照片一样真实' },
  { id: '3d', label: '3D 渲染', icon: '🧊', description: 'C4D, Blender, 盲盒风' },
  { id: 'cyberpunk', label: '赛博朋克', icon: '🌃', description: '霓虹灯、未来感' },
  { id: 'oil', label: '油画艺术', icon: '🎨', description: '厚涂、印象派' },
  { id: 'ghibli', label: '吉卜力', icon: '🍃', description: '宫崎骏风格' },
  { id: 'chinese_ink', label: '中国水墨', icon: '🖌️', description: '传统水墨韵味' },
];

export const ASPECT_RATIOS = [
  { id: '1:1', label: '方形 (1:1)' },
  { id: '16:9', label: '宽屏 (16:9)' },
  { id: '9:16', label: '手机壁纸 (9:16)' },
  { id: '4:3', label: '画框 (4:3)' },
  { id: '3:4', label: '肖像 (3:4)' },
];