// context/SurveyContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// 👇 Aquí defines la estructura de tus respuestas (puedes tiparla si deseas más control)
const initialResponses = {
  nombre: '',
  genero: '',
  edad: 0,

  semestre: 0,
  situacionLaboral: 0,

  fumador: 0,
  responsabilidadesFamiliares: 0,
  horasEjercicio: 0,

  comunicacionFamiliar: 0,

  cargaAcademica: 0,
  satisfaccionRecompensas: 0,

  calidadSueno: 0,
  frecuenciaAnsiedad: 0,
  frecuenciaDepresion: 0,
  dificultadEmociones: 0
};

// 👇 Interfaz del contexto
interface SurveyContextType {
  responses: typeof initialResponses;
  updateResponse: (field: keyof typeof initialResponses, value: any) => void;
}

// 👇 Crear el contexto con un valor inicial nulo o tipado opcional
const SurveyContext = createContext<SurveyContextType | null>(null);

// 👇 Interfaz para el proveedor que acepte children como nodo React
interface ProviderProps {
  children: ReactNode;
}

// 👇 Componente proveedor con props tipadas
export const SurveyProvider = ({ children }: ProviderProps) => {
  const [responses, setResponses] = useState(initialResponses);

  const updateResponse = (field: keyof typeof initialResponses, value: any) => {
    setResponses(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SurveyContext.Provider value={{ responses, updateResponse }}>
      {children}
    </SurveyContext.Provider>
  );
};

// 👇 Hook para consumir el contexto
export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey debe usarse dentro de SurveyProvider');
  }
  return context;
};