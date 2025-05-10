import {Ionicons} from '@expo/vector-icons'

interface MenuRoute{
  title: string,
  icon:keyof typeof Ionicons.glyphMap,
  name:string
}

export const questRoutes: MenuRoute[] = [
  {
    title: 'Nombre',
    icon: 'refresh-outline',
    name: 'NameScreen/index',
  },
  {
    title: 'Genero',
    icon: 'refresh-outline',
    name: 'GenderScreen/index',
  },
  {
    title: 'Edad',
    icon: 'refresh-outline',
    name: 'AgeScreen/index',
  },


  {
    title: 'Semestre',
    icon: 'refresh-outline',
    name: 'SemesterScreen/index',
  },
  {
    title: 'Situacion Laboral',
    icon: 'refresh-outline',
    name: 'WorkSituationScreen/index',
  },


  {
    title: 'Fumador',
    icon: 'refresh-outline',
    name: 'SmokeScreen/index',
  },
  {
    title: 'Responsabilidades Familiares',
    icon: 'refresh-outline',
    name: 'FamilyResponsabilityScreen/index',
  },
  {
    title: 'Horas de Ejercicio',
    icon: 'refresh-outline',
    name: 'ExerciseScreen/index',
  },


  {
    title: 'Comunicacion Familiar',
    icon: 'refresh-outline',
    name: 'FamilyComunicationScreen/index',
  },


  {
    title: 'Carga Academica',
    icon: 'refresh-outline',
    name: 'AcademicLoadScreen/index',
  },
  {
    title: 'Satisfaccion de la recompensas',
    icon: 'refresh-outline',
    name: 'SatisfactionRewardsScreen/index',
  },


  {
    title: 'Calidad de sueño',
    icon: 'refresh-outline',
    name: 'SleepQualityScreen/index',
  },
  {
    title: 'Frecuencias de ansiedad',
    icon: 'refresh-outline',
    name: 'AnxietyFrecuencyScreen/index',
  },
  {
    title: 'Frecuencia de Depresion',
    icon: 'refresh-outline',
    name: 'DepressionFrecuencyScreen/index',
  },
  {
    title: 'Dificutad de Control de Emociones',
    icon: 'refresh-outline',
    name: 'ControlEmotionsScreen/index',
  },
];

export const Test: MenuRoute[] = [
  {
    title: 'TestScreen',
    icon: 'refresh-outline',
    name: 'TestScreen/index',
  },
  {
    title: 'RecomendationsScreen',
    icon: 'refresh-outline',
    name: 'RecomendationsScreen/index',
  },
]

export const Tools: MenuRoute[] = [
  {
    title: 'Herramientas',
    icon: 'square-outline',
    name: 'ToolsScreen/index',
  },
  {
    title: 'Pomodoro',
    icon: 'square-outline',
    name: 'PomodoroScreen/index',
  },
  {
    title: 'Rutina sencilla',
    icon: 'square-outline',
    name: 'RoutineScreen/index',
  },
  {
    title: 'Respiración consciente',
    icon: 'square-outline',
    name: 'BreatheScreen/index',
  },
  {
    title: 'Meditacion',
    icon: 'square-outline',
    name: 'MeditationScreen/index',
  },
  {
    title: 'Transforma tus Pensamientos',
    icon: 'square-outline',
    name: 'ThoughtsScreen/index',
  },
]
// export const uiMenuRoutes: MenuRoute[] = [
//   {
//     title: 'Switches',
//     icon: 'toggle-outline',
//     name: 'switches/index',
//   },
//   {
//     title: 'Alerts',
//     icon: 'alert-circle-outline',
//     name: 'alerts/index',
//   },
//   {
//     title: 'TextInputs',
//     icon: 'document-text-outline',
//     name: 'text-inputs/index',
//   },
// ];

// export const animationMenuRoutes: MenuRoute[] = [
//   {
//     title: 'Animation 101',
//     icon: 'cube-outline',
//     name: 'animation-101/index',
//   },
//   {
//     title: 'Animation 102',
//     icon: 'albums-outline',
//     name: 'animation-102/index',
//   },
// ];

// export const allRoutes = [
//   //...menuRoutes,
//   //...uiMenuRoutes,
//   //...animationMenuRoutes,
// ];
