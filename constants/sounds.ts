/**
 * Registro único de sonidos de la app.
 * zap1 = fin de bloque de trabajo (empieza descanso), zap2 = fin de descanso.
 */
export const SOUNDS = {
  workEnd: require('@/assets/sounds/zap1.mp3'),
  breakEnd: require('@/assets/sounds/zap2.mp3'),
  timer: require('@/assets/sounds/timer.mp3'),
  success: require('@/assets/sounds/success.mp3'),
  activePause: require('@/assets/sounds/active-pause.mp3'),
} as const;
