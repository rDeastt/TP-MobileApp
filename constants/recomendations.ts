import { Ionicons } from '@expo/vector-icons';

export type BurnoutLevel = 'low' | 'moderate' | 'high' | 'error';

export interface Recommendation {
  id: string;
  level: BurnoutLevel;
  title: string;
  summary: string;
  body: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

export const recommendations: Recommendation[] = [
  /* ─────────────── LOW (<30 %) ─────────────── */
  {
    id: 'low-breathing',
    level: 'low',
    title: 'Respira consciente cada día',
    summary: '3 a 5 min por la mañana y noche para prevenir estrés.',
    iconName: 'cloud-outline',
    body: `
Dedica 3 a 5 minutos por la mañana y por la noche a la técnica de respiración cuadrada o 4-7-8 usando la herramienta Respiración Consciente de la app.

Esto estabiliza tu sistema nervioso, mejora el sueño y previene la acumulación de estrés diario.
    `,
  },
  {
    id: 'low-goals',
    level: 'low',
    title: 'Define metas académicas semanales',
    summary: 'Dos objetivos concretos te ayudan a mantener el enfoque.',
    iconName: 'checkmark-done-outline',
    body: `
Desde hoy, planifica dos metas específicas por semana (como terminar un resumen o asistir a todas tus clases) y márcalas como cumplidas.

Esto reduce la dispersión mental y refuerza tu sensación de logro.
    `,
  },
  {
    id: 'low-active-breaks',
    level: 'low',
    title: 'Incluye pausas activas cada hora',
    summary: 'Pequeños descansos que restauran tu energía mental.',
    iconName: 'walk-outline',
    body: `
Durante tus sesiones de estudio, toma pausas breves para estirarte o cambiar de entorno al menos cada hora.

La app ofrece la herramienta de Pausa Activa, con ejercicios de estiramiento y yoga guiados.
    `,
  },
  {
    id: 'low-hobby-time',
    level: 'low',
    title: 'Haz algo que disfrutes a diario',
    summary: 'El placer previene el desgaste emocional.',
    iconName: 'happy-outline',
    body: `
Dedica tiempo a lo que te gusta: ejercicio, dibujo, lectura o música. 

Estas actividades refuerzan tu bienestar emocional y previenen el agotamiento académico.
    `,
  },

  /* ─────────────── MODERATE (30–49 %) ─────────────── */
  {
    id: 'mod-pomodoro-breaks',
    level: 'moderate',
    title: 'Pomodoro y pausas activas',
    summary: 'Estudio en bloques + movimiento para evitar saturación.',
    iconName: 'timer-outline',
    body: `
Usa la herramienta Pomodoro: 25 min de estudio + 5 min de descanso.  
Tras 4 ciclos, realiza una pausa activa completa con estiramientos.

Esto previene la sobrecarga y mantiene tu concentración.
    `,
  },
  {
    id: 'mod-cognitive-shift',
    level: 'moderate',
    title: 'Transforma pensamientos negativos',
    summary: 'Reformula creencias limitantes con TCC.',
    iconName: 'sync-outline',
    body: `
Cuando aparezcan frases como “no puedo” o “soy un desastre”, entra a la herramienta Transformación de Pensamientos (TCC).

Completa un ejercicio de reestructuración y gana claridad emocional.
    `,
  },
  {
    id: 'mod-purpose-link',
    level: 'moderate',
    title: 'Conecta lo que estudias con tu propósito',
    summary: 'Da sentido a tu esfuerzo diario.',
    iconName: 'bulb-outline',
    body: `
Haz una lista de cómo tu carrera o materia actual puede ayudarte a lograr tus metas personales o profesionales.

Esto activa tu motivación interna. Guarda tus reflexiones en la app si lo deseas.
    `,
  },
  {
    id: 'mod-mind-body',
    level: 'moderate',
    title: 'Mindfulness y ejercicio diario',
    summary: 'Dos prácticas clave para restaurar el equilibrio.',
    iconName: 'fitness-outline',
    body: `
Realiza sesiones diarias de mindfulness y ejercicio moderado.  
Estas prácticas reducen el estrés y previenen el avance del burnout.

Utiliza las herramientas de la app para ayudarte a establecer la rutina.
    `,
  },

  /* ─────────────── HIGH (≥50 %) ─────────────── */
  {
    id: 'high-prof-help',
    level: 'high',
    title: 'Busca ayuda profesional de inmediato',
    summary: 'El primer paso para recuperar tu estabilidad.',
    iconName: 'medkit-outline',
    body: `
Si te sientes agotado, con bajo rendimiento, o con pensamientos negativos constantes, contacta a un psicólogo o counselor.

El apoyo profesional es esencial para superar el burnout severo.
    `,
  },
  {
    id: 'high-dual-mindfulness',
    level: 'high',
    title: 'Mindfulness al despertar y antes de dormir',
    summary: 'Reduce rumiación y recupera tu centro.',
    iconName: 'leaf-outline',
    body: `
Usa la función Mindfulness de la app dos veces al día (5–10 min).  
El temporizador y los mensajes guiados te ayudarán a reestablecer tu calma.

Hazlo diariamente para cortar el ciclo de agotamiento emocional.
    `,
  },
  {
    id: 'high-thought-record',
    level: 'high',
    title: 'Reescribe pensamientos destructivos',
    summary: 'Reduce el impacto de tus ideas más críticas.',
    iconName: 'bookmark-outline',
    body: `
Accede a la herramienta TCC y trabaja con pensamientos como “soy un fracaso” o “todo me supera”.

Al escribirlos, analizarlos y reformularlos, les quitas fuerza y recuperas tu autoeficacia.
    `,
  },
  {
    id: 'high-physical-soft',
    level: 'high',
    title: 'Ejercicio suave y frecuente',
    summary: 'Recupera tu cuerpo, mejora tu mente.',
    iconName: 'barbell-outline',
    body: `
Haz ejercicios físicos suaves y pausas frecuentes durante el día.

La app incluye Rutina Sencilla de Ejercicios y Pausa Activa para ayudarte a comenzar sin forzar tu cuerpo.
    `,
  },
];
