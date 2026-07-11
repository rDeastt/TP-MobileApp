export type Emotion = 'sadness' | 'anxiety' | 'anger' | 'frustration' | 'fear';

export type ThoughtItem = {
  id: string;
  situation: string;
  negativeThought: string;
  emotion: Emotion;
  intensity: number;
  alternativeThought: string;
  /** Intensidad reevaluada por el usuario tras transformar (antes → después). */
  newIntensity?: number;
  completed: boolean;
};

export const EMOTION_MAP: Record<Emotion, { icon: string; es: string }> = {
  sadness: { icon: '😔', es: 'Tristeza' },
  anxiety: { icon: '😰', es: 'Ansiedad' },
  anger: { icon: '😠', es: 'Enojo' },
  frustration: { icon: '😤', es: 'Frustración' },
  fear: { icon: '😨', es: 'Miedo' },
};

export const THOUGHTS_STORAGE_KEY = '@thoughts_data';
