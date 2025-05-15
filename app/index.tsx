import React, { useEffect, useState } from 'react'
import { Redirect } from 'expo-router'
import {getLastProbability} from '@/components/shared/burnoutHistory';
const BunnoApp = () => {
  // undefined = aún cargando  |  null = sin predicción  |  number = porcentaje
  const [percent, setPercent] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    (async () => {
      const p = await getLastProbability();   // number | null
      setPercent(p);
    })();
  }, []);

  /* 1️⃣ Mientras no tengamos el dato, puedes retornar null o un splash */
  if (percent === undefined) {
    return null;                 // o <SplashScreen />
  }

  /* 2️⃣ Ternario correcto */
  return percent === null ? (
    <Redirect href="/NameScreen" />
  ) : (
    <Redirect href="/HomeScreen" /> //HomeScreen
  );
};

export default BunnoApp;