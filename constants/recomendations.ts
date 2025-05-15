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
  /* ─────────────── LOW  (<30 %) ─────────────── */
  {
    id: 'low-pomodoro',
    level: 'low',
    title: 'Mantén tu ritmo con Pomodoro',
    summary: 'Sesiones de 25 min con pausas evitan la fatiga.',
    iconName: 'timer-outline',
    body: `
**¿Por qué funciona?**  
Incluso con riesgo bajo, tu energía mental fluctúa. El _método Pomodoro_ mantiene tu productividad sin agotar recursos cognitivos.

### Pasos
1. Abre la herramienta **Pomodoro**.
2. Trabaja 25 min en una tarea.
3. Descansa 5 min: levántate, bebe agua, estira.
4. Repite cuatro ciclos y toma un descanso largo (15 min).

> Al acostumbrarte a estos intervalos, previenes la fatiga prolongada y sostienes la motivación.
    `,
  },
  {
    id: 'low-stretch',
    level: 'low',
    title: 'Pausa activa de estiramientos',
    summary: 'Dos minutos para liberar tensión muscular.',
    iconName: 'accessibility-outline',
    body: `
Cuando estudias varias horas, los músculos del cuello y la espalda se tensan.  
Al menos **cada hora**:

- Haz un _estiramiento del gato_: espalda arqueada y encorvada, 5 repeticiones.  
- Estira tríceps y hombros 20 s por lado.  
- Gira el cuello suavemente 5 veces.

Estos micro-movimientos mejoran la circulación y reducen los micro-dolores que minan tu energía.
    `,
  },
  {
    id: 'low-gratitude',
    level: 'low',
    title: 'Chequeo de gratitud',
    summary: 'Escribe 3 cosas buenas del día para reforzar el ánimo.',
    iconName: 'heart-outline',
    body: `
Un cerebro que aprecia lo logrado mantiene alta la motivación y evita el agotamiento.

**Rutina nocturna (3 min)**  
1. Abre tu diario (o la sección _Notas_ de la app).  
2. Escribe **tres cosas** por las que sientas gratitud hoy (pequeñas victorias sirven).  
3. Respira hondo y lee la lista.  

Esta práctica fortalece el circuito de recompensa y refuerza tu sensación de progreso.
    `,
  },

  /* ─────────────── MODERATE  (30-49 %) ─────────────── */
  {
    id: 'mod-breathing',
    level: 'moderate',
    title: 'Respiración diafragmática',
    summary: 'Baja la tensión en 2 min con respiraciones profundas.',
    iconName: 'medkit-outline',
    body: `
El estrés moderado afecta tu concentración y puede escalar a burnout.

**5 min de respiración diafragmática**
1. Abre “Ejercicios de respiración” › _Diafragmática_.  
2. Inhala 5 s, siente tu abdomen expandirse.  
3. Exhala 5 s, suelta hombros y mandíbula.  
4. Repite 6 ciclos.  

Integra esta pausa cada 90 min de estudio y registra tu nivel de tensión (1-10) antes y después.
    `,
  },
  {
    id: 'mod-exercise',
    level: 'moderate',
    title: 'Rutina física básica',
    summary: 'Activa el cuerpo 3 min para oxigenar la mente.',
    iconName: 'barbell-outline',
    body: `
Moverte rompe la cascada de hormonas del estrés.

**Rutina sencilla (3 min)**
- Marcha suave 30 s  
- Sentadillas lentas 30 s  
- Círculos de brazos 30 s  
- Repite 3 veces.

El flujo sanguíneo cerebral aumenta ~7 %, liberando dopamina y reduciendo sensación de agotamiento.
    `,
  },
  {
    id: 'mod-digital-detox',
    level: 'moderate',
    title: 'Desconexión digital programada',
    summary: 'Bloquea notificaciones 1 h antes de dormir.',
    iconName: 'moon-outline',
    body: `
Las pantallas prolongan la activación cerebral. Programa en tu móvil:
1. **Modo No Molestar** 1 h antes de dormir.  
2. Deja el teléfono fuera de la habitación.  
3. Usa lectura ligera o música relajante.  

Así mejoras la calidad del sueño, fundamental para recuperarte de la carga académica.
    `,
  },

  /* ─────────────── HIGH  (≥50 %) ─────────────── */
  {
    id: 'high-mindfulness',
    level: 'high',
    title: 'Meditación guiada de emergencia',
    summary: '10 min de atención plena para cortar el ciclo de agotamiento.',
    iconName: 'leaf-outline',
    body: `
Con riesgo alto, tu sistema nervioso está en modo “supervivencia”.

1. Abre _Meditación_ › _Mindfulness 10 min_.  
2. Sigue la voz: respira, suelta mandíbula, escanea el cuerpo.  
3. Etiqueta pensamientos (“preocupación”) y vuelve a la respiración.  

Hazlo diariamente durante 7 días y registra tu estado de ánimo.  
En estudios, 10 min de mindfulness reducen cortisol en un 20 % medio.
    `,
  },
  {
    id: 'high-cbt',
    level: 'high',
    title: 'Actividad cognitiva',
    summary: 'Desafía las creencias de “no puedo” con TCC.',
    iconName: 'bookmark-outline',
    body: `
El burnout severo se alimenta de distorsiones (“soy incapaz”).  
En la **Actividad TCC**:

1. Escribe el pensamiento automático.  
2. Arrástralo a la papelera.  
3. Sustitúyelo por una afirmación objetiva.  

Hazlo con 3 pensamientos diarios para re-entrenar tu diálogo interno.
    `,
  },
  {
    id: 'high-help',
    level: 'high',
    title: 'Plan de recuperación progresiva',
    summary: 'Establece micro-objetivos y consulta apoyo profesional.',
    iconName: 'help-buoy-outline',
    body: `
Cuando tu riesgo es alto, necesitas una recuperación estructurada.

**Micro-objetivos (ejemplo):**
- Semana 1: reducir horas de estudio continuo a bloques de 45 min.  
- Semana 2: incluir ejercicio ligero 4 días.  
- Semana 3: sesión de TCC 1 vez.  

**Apoyo profesional**  
- Contacta al psicólogo/counselor de tu universidad.  
- Considera terapia breve centrada en soluciones.  

> Reconocer el agotamiento y buscar ayuda es parte del éxito académico sostenible.
    `,
  },
];
