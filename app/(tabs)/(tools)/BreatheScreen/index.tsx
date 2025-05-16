import { View, Text, Animated, Easing, TouchableOpacity } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { useSurvey } from '@/hooks/SurveyContext';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedView from '@/components/shared/ThemedView';

/* ---- Tipo y técnicas ---- */
type BreathingTechnique = {
  id: string; name: string; description: string;
  inhaleTime: number; holdTime: number; exhaleTime: number; pauseTime: number;
  benefits: string; cbMessage: string;
};
const breathingTechniques: BreathingTechnique[] = [
  { id:'box', name:'Respiración Cuadrada', description:'Inhala 4s, mantén 4s, exhala 4s, espera 4s',
    inhaleTime:4000, holdTime:4000, exhaleTime:4000, pauseTime:4000,
    benefits:'Calma la mente y reduce la ansiedad.',
    cbMessage:'Observa tus pensamientos sin juzgarlos mientras respiras.' },
  { id:'478', name:'Técnica 4‑7‑8', description:'Inhala 4s, mantén 7s, exhala 8s',
    inhaleTime:4000, holdTime:7000, exhaleTime:8000, pauseTime:0,
    benefits:'Induce relajación y mejora el sueño.',
    cbMessage:'Con cada exhalación, libera tensiones y pensamientos negativos.' },
  { id:'diaphragmatic', name:'Respiración Diafragmática', description:'Inhala 5s, exhala 5s',
    inhaleTime:5000, holdTime:0, exhaleTime:5000, pauseTime:0,
    benefits:'Reduce el cortisol y activa la relajación.',
    cbMessage:'Siente cómo el presente es lo único que importa en este momento.' },
];

/* ---------- Componente ---------- */
const BreatheScreen = () => {
  const { updateResponse } = useSurvey();

  /* ------ estado visual ------ */
  const [tech, setTech]   = useState<BreathingTechnique>(breathingTechniques[0]);
  const [selectedId,setSelected] = useState(tech.id);
  const [phase,setPhase] = useState<'choose'|'prepare'|'inhale'|'hold'|'exhale'|'pause'|'complete'>('choose');
  const [timeLeft,setTimeLeft] = useState(0);

  /* ------ refs ------ */
  const scale = useRef(new Animated.Value(1)).current;
  const tick  = useRef<ReturnType<typeof setInterval>|null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout>|null>(null);
  const running = useRef(false);
  const cycleRef = useRef(0);               // ← contador fiable de ciclos 0‑1‑2

  /* ---- limpieza ---- */
  const clearAll = () => { if(tick.current) clearInterval(tick.current);
                           if(timeout.current) clearTimeout(timeout.current);
                           tick.current=null; timeout.current=null; };
  useEffect(()=>clearAll,[]);

  /* ---- helpers ---- */
  const startCountdown = (ms:number) => {
    const end = Date.now()+ms;
    setTimeLeft(Math.ceil(ms/1000));
    if(tick.current) clearInterval(tick.current);
    tick.current = setInterval(()=>setTimeLeft(Math.max(0,Math.ceil((end-Date.now())/1000))),1000);
    if(timeout.current) clearTimeout(timeout.current);
  };

  const runPhase = (p:typeof phase, ms:number, scaleTo:number, next:()=>void)=>{
    if(!running.current) return;
    setPhase(p);
    startCountdown(ms);
    Animated.timing(scale,{toValue:scaleTo,duration:ms,easing:Easing.inOut(Easing.ease),useNativeDriver:true}).start();
    timeout.current = setTimeout(()=>{ clearAll(); next(); },ms);
  };

  /* ---- flujo ---- */
  const startSession = ()=>{
    clearAll(); running.current=true; cycleRef.current=0;
    scale.setValue(1); setPhase('prepare');
    startCountdown(3000);
    timeout.current = setTimeout(()=>{ clearAll(); startInhale(); },3000);
  };

  const startInhale = ()=> runPhase('inhale',tech.inhaleTime,1.4,()=> tech.holdTime>0?startHold():startExhale());
  const startHold   = ()=> runPhase('hold',tech.holdTime ,1.4,startExhale);
  const startExhale = ()=> runPhase('exhale',tech.exhaleTime,1  ,()=> tech.pauseTime>0?startPause():endCycle());
  const startPause  = ()=> runPhase('pause', tech.pauseTime ,1  ,endCycle);

  const endCycle = ()=>{
    if(!running.current) return;
    cycleRef.current += 1;
    if(cycleRef.current>=3){ finish(); return; }
    timeout.current = setTimeout(startInhale,600);
  };

  const finish = ()=>{
    clearAll(); running.current=false;
    setPhase('complete'); updateResponse('hasCompletedBreathing' as any,true);
  };

  const backToChoose = ()=>{
    clearAll(); running.current=false;
    setPhase('choose'); scale.setValue(1); setTimeLeft(0);
  };

  /* ---- UI helpers ---- */
  const label:Record<typeof phase,string>={
    choose:'',prepare:'Prepárate',inhale:'Inhala',hold:'Mantén',exhale:'Exhala',pause:'Pausa',complete:'¡Sesión completada!'};
  const cycTxt = phase!=='choose'&&phase!=='prepare'&&phase!=='complete'
                 ?` (Ciclo ${cycleRef.current+1}/3)`:'';

  const Btn = ({text,onPress,color='bg-main'}:{text:string;onPress:()=>void;color?:string})=>(
    <TouchableOpacity onPress={onPress} className={`${color} px-6 py-4 mt-5 rounded-full items-center w-full`}>
      <Text className="text-white font-semibold text-lg">{text}</Text>
    </TouchableOpacity>);

  const TechBtn = (t:BreathingTechnique)=>{
    const sel = t.id===selectedId;
    return <TouchableOpacity key={t.id} disabled={phase!=='choose'}
              onPress={()=>{setTech(t);setSelected(t.id)}}
              className={`px-4 py-2 mx-1 mb-2 rounded-full ${sel?'bg-secondary':'bg-gray-200'}`}>
              <Text className={`font-semibold ${sel?'text-white':'text-gray-700'}`}>{t.name}</Text>
           </TouchableOpacity>; };

  /* ---- render ---- */
  return(
  <ThemedView margin className="flex-1 justify-between">
    {/* cabecera */}
    <View className="items-center mt-5 mb-4">
      <Text className="text-3xl font-bold">Ejercicio de Respiración</Text>
      <Text className="text-base text-gray-400">Tómate un momento para relajarte</Text>
    </View>

    {/* cuerpo */}
    <View className="flex-1 items-center">
      {phase==='choose' && (
        <>
          <SpeechBubble text="La respiración consciente reduce el estrés y la ansiedad. ¡Vamos a practicar juntos!" source="Buno"/>
          <ThemedAvatar source={require('../../../../assets/avatars/avatar-3.png')} animate/>
          <Text className="text-lg font-semibold mt-6">Elige una técnica:</Text>
          <View className="flex-row flex-wrap justify-center mt-2 mb-4">{breathingTechniques.map(TechBtn)}</View>
          <View className="bg-gray-100 p-4 rounded-xl mb-4 w-11/12">
            <Text className="font-bold text-center text-lg mb-1">{tech.name}</Text>
            <Text className="text-center text-gray-700 mb-1">{tech.description}</Text>
            <Text className="text-center text-gray-700 italic">{tech.benefits}</Text>
          </View>
        </>
      )}

      {(phase!=='choose' && phase!=='complete') && (
        <View className="items-center">
          <Text className="text-2xl font-bold mb-4">{label[phase]}{cycTxt}</Text>
          <Text className="text-lg text-gray-600 mb-10">{timeLeft}s</Text>
          <Animated.View className="bg-blue-500 rounded-full items-center justify-center"
             style={{width:160,height:160,transform:[{scale:scale}]}}>
            <Text className="text-white font-semibold text-xl">{label[phase]}</Text>
          </Animated.View>
          <View className="mt-12 space-y-5 w-56">
            <Btn text="Detener" onPress={backToChoose} color="bg-[#f472b6]"/>
          </View>
        </View>
      )}

      {phase==='complete' && (
        <>
          <SpeechBubble text="¡Excelente! La práctica regular de la respiración consciente fortalece tu capacidad para manejar el estrés."
                        source="Buno"/>
          <ThemedAvatar source={require('../../../../assets/avatars/avatar-3.png')} animate/>
        </>
      )}
    </View>

    {/* pie */}
    <View className="px-6 mb-6 space-y-5">
      {phase==='choose'   && <Btn text="Iniciar" onPress={startSession}/>}
      {phase==='complete' && <>
        <Btn text="Practicar de nuevo" color="bg-[#6366f1]" onPress={startSession}/>
        <Btn text="Volver" onPress={backToChoose} color="bg-main"/>
      </>}
    </View>
  </ThemedView>);
};
export default BreatheScreen;
