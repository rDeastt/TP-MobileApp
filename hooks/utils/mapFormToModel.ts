interface FormResponses {
  edad: number;
  semestre: number;
  situacionLaboral: number;
  fumador: number;
  responsabilidadesFamiliares: number;
  horasEjercicio: number;
  comunicacionFamiliar: number;
  cargaAcademica: number;
  satisfaccionRecompensas: number;
  calidadSueno: number;
  frecuenciaAnsiedad: number;
  frecuenciaDepresion: number;
  dificultadEmociones: number;
  [key: string]: any;
}

export const mapFormToModel = (responses: FormResponses) => {
  return {
    edad: responses.edad,
    fumador: responses.fumador,
    situacion_laboral: responses.situacionLaboral,
    responsabilidades_familiares: responses.responsabilidadesFamiliares,
    semestre: responses.semestre,
    horas_ejercicio: responses.horasEjercicio,
    calidad_sueno: responses.calidadSueno,
    comunicacion_familiar: responses.comunicacionFamiliar,
    carga_academica: responses.cargaAcademica,
    satisfaccion_recompensas: responses.satisfaccionRecompensas,
    frecuencia_ansioso: responses.frecuenciaAnsiedad,
    frecuencia_deprimido: responses.frecuenciaDepresion,
    control_emociones: responses.dificultadEmociones,
  };
};