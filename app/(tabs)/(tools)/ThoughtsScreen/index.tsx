import { View, Text, TextInput, TouchableOpacity, ScrollView, Animated, Easing, Alert } from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import ThemedView from '@/components/shared/ThemedView';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import { useSurvey } from '@/hooks/SurveyContext';
import { router } from 'expo-router';

// Lista ampliada de pensamientos positivos para sugerir
const positiveThoughtsList = [
  'Dividiré esto en pasos pequeños',
  'Estoy aprendiendo y mejorando constantemente',
  'Puedo mejorar con práctica y paciencia',
  'Sí soy capaz de superar este desafío',
  'Cada día mejoro un poco más',
  'Este desafío me hace más fuerte',
  'Tengo habilidades valiosas que puedo aprovechar',
  'Estoy progresando a mi ritmo y eso está bien',
  'Los errores son oportunidades para aprender',
  'Confío en mi capacidad para crecer',
  'Puedo buscar ayuda cuando la necesite',
  'Soy resiliente frente a las dificultades',
  'Mi esfuerzo dará resultados a largo plazo',
  'Voy a celebrar mis pequeños logros',
  'Cada obstáculo me acerca más a mi meta',
  'Tengo la fortaleza para perseverar',
  'Mi valor no depende de mis logros',
  'Puedo aprender de quienes me rodean',
  'Soy más fuerte de lo que creo',
  'Mis desafíos de hoy son mi fortaleza de mañana'
];

const ThoughtsScreen = () => {
  const { updateResponse } = useSurvey();
  
  // Estados
  const [inputThought, setInputThought] = useState('');
  const [negativeThoughts, setNegativeThoughts] = useState([]);
  const [positiveThoughts, setPositiveThoughts] = useState(
    positiveThoughtsList.slice(0, 4)
  );
  const [showPositive, setShowPositive] = useState(false); // Inicialmente contraído
  const [isAnimating, setIsAnimating] = useState(false);
  const [completedThoughts, setCompletedThoughts] = useState(0);
  const [phase, setPhase] = useState('input'); // 'input', 'transform', 'complete'
  
  // Referencias animadas
  const thoughtAnimations = useRef([]).current;
  const arrowRotation = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  
  // Efecto para actualizar las animaciones cuando cambia la lista de pensamientos
  useEffect(() => {
    // Asegurarnos de que tengamos suficientes animaciones para todos los pensamientos
    if (thoughtAnimations.length < negativeThoughts.length) {
      const newAnimations = [...Array(negativeThoughts.length - thoughtAnimations.length)]
        .map(() => new Animated.Value(1));
      thoughtAnimations.push(...newAnimations);
    }
  }, [negativeThoughts]);
  
  // Efecto para la flecha del acordeón
  useEffect(() => {
    Animated.timing(arrowRotation, {
      toValue: showPositive ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease)
    }).start();
  }, [showPositive]);
  
  // Rotación de la flecha
  const arrowRotationDeg = arrowRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '90deg']
  });
  
  // Añadir un nuevo pensamiento negativo
  const addNegativeThought = () => {
    if (inputThought.trim() === '') {
      Alert.alert(
        "Campo vacío", 
        "Por favor escribe un pensamiento antes de agregarlo."
      );
      return;
    }
    
    // Agregar el pensamiento y crear una nueva animación para él
    setNegativeThoughts(prevThoughts => [...prevThoughts, inputThought]);
    thoughtAnimations.push(new Animated.Value(1));
    setInputThought('');
    
    // Asegurar que se vea el nuevo pensamiento añadido
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };
  
  // Borrar todos los pensamientos (sin cambiar de pantalla)
  const clearAllThoughts = () => {
    if (isAnimating || negativeThoughts.length === 0) return;
    
    setIsAnimating(true);
    
    // Crear animaciones secuenciales para todos los pensamientos
    const animations = negativeThoughts.map((_, index) => {
      return Animated.timing(thoughtAnimations[index], {
        toValue: 0,
        duration: 500,
        delay: index * 100, // Efecto cascada
        useNativeDriver: true,
        easing: Easing.inOut(Easing.ease)
      });
    });
    
    // Ejecutar todas las animaciones en paralelo
    Animated.stagger(80, animations).start(() => {
      // Reiniciar pensamientos y animaciones
      setNegativeThoughts([]);
      setIsAnimating(false);
      // NO cambiamos de fase al borrar, solo actualizamos el contador
      setCompletedThoughts(0); // Reiniciamos el contador
    });
  };
  
  // Refrescar pensamientos positivos
  const refreshPositiveThoughts = () => {
    // Mezclar y elegir aleatoriamente 4 pensamientos positivos
    const shuffled = [...positiveThoughtsList].sort(() => 0.5 - Math.random());
    setPositiveThoughts(shuffled.slice(0, 4));
  };
  
  // Completar el ejercicio
  const completeExercise = () => {
    setPhase('complete');
    // Actualizar el contexto de la encuesta
    updateResponse('hasCompletedThoughtTransformation', true);
  };
  
  // Botón estilizado
  const Btn = ({text, onPress, color = 'bg-green-500', icon, disabled = false}) => (
    <TouchableOpacity 
      onPress={disabled ? null : onPress}
      activeOpacity={0.7}
      className={`${color} ${disabled ? 'opacity-50' : 'opacity-100'} 
        px-6 py-4 mt-3 rounded-xl items-center w-full flex-row justify-center
        shadow-md`}
    >
      {icon && <View className="mr-2">{icon}</View>}
      <Text className="text-white font-semibold text-lg">{text}</Text>
    </TouchableOpacity>
  );
  
  // Reiniciar el ejercicio
  const resetExercise = () => {
    setNegativeThoughts([]);
    setPositiveThoughts(positiveThoughtsList.slice(0, 4));
    setCompletedThoughts(0);
    setPhase('input');
    setShowPositive(false); // Volver a contraer los pensamientos positivos
    
    // Reiniciamos también las animaciones
    thoughtAnimations.splice(0, thoughtAnimations.length);
  };
  
  // Función para manejar el botón "Transformar mis pensamientos"
  const handleTransformThoughts = () => {
    if (negativeThoughts.length === 0) {
      // Si no hay pensamientos, pasamos directamente a la fase de transformación
      setPhase('transform');
    } else {
      // Si hay pensamientos, mostramos un mensaje sugiriendo que los transforme primero
      Alert.alert(
        "Pensamientos pendientes",
        "Aún tienes pensamientos negativos por transformar. ¿Quieres eliminarlos todos y continuar?",
        [
          {
            text: "Cancelar",
            style: "cancel"
          },
          {
            text: "Eliminar y continuar",
            onPress: () => {
              // Borramos todos los pensamientos y avanzamos
              setNegativeThoughts([]);
              setCompletedThoughts(0);
              setPhase('transform');
            }
          }
        ]
      );
    }
  };
  
  return (
    <ThemedView margin className="flex-1 justify-between">
      {/* Cabecera */}
      <View className="items-center mt-5 mb-4">
        <Text className="text-3xl font-bold">TCCd</Text>
        <Text className="text-base text-yellow-400">✨ Transforma tus pensamientos ✨</Text>
        <Text className="text-center text-gray-500 px-6 mt-1">
          Identifica tus pensamientos negativos y reemplázalos por ideas que te ayuden a avanzar
        </Text>
      </View>
      
      {/* Cuerpo */}
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1" 
        contentContainerStyle={{padding: 16}}
        showsVerticalScrollIndicator={false}
      >
        {phase === 'input' && (
          <>
            {/* Input para nuevos pensamientos */}
            <View className="flex-row mb-4">
              <TextInput
                value={inputThought}
                onChangeText={setInputThought}
                placeholder="Escribe un pensamiento negativo..."
                className="flex-1 p-3 border border-gray-300 rounded-l-xl bg-white"
                onSubmitEditing={addNegativeThought}
                placeholderTextColor="#9CA3AF"
                autoCorrect={false}
              />
              <TouchableOpacity 
                onPress={addNegativeThought}
                activeOpacity={0.6}
                className="bg-green-500 px-4 items-center justify-center rounded-r-xl"
              >
                <Feather name="plus" size={20} color="white" />
              </TouchableOpacity>
            </View>
            
            {/* Lista de pensamientos negativos */}
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-semibold">Pensamientos a transformar:</Text>
                
                {/* Botón de papelera mejorado */}
                <TouchableOpacity 
                  onPress={clearAllThoughts}
                  activeOpacity={0.6}
                  disabled={isAnimating || negativeThoughts.length === 0}
                  className={`${negativeThoughts.length === 0 ? 'opacity-50' : 'opacity-100'} 
                    bg-red-100 rounded-full p-2 flex-row items-center`}
                >
                  <Feather name="trash-2" size={20} color="#EF4444" />
                  <Text className="text-red-500 ml-1 font-medium">Borrar todo</Text>
                </TouchableOpacity>
              </View>
              
              <View className="bg-gray-200 rounded-xl p-4 min-h-40">
                {negativeThoughts.length > 0 ? (
                  negativeThoughts.map((thought, index) => (
                    <Animated.View 
                      key={`thought-${index}-${thought.substring(0, 10)}`}
                      style={{
                        opacity: thoughtAnimations[index],
                        transform: [
                          { scale: thoughtAnimations[index] },
                          { 
                            translateY: thoughtAnimations[index].interpolate({
                              inputRange: [0, 1],
                              outputRange: [50, 0]
                            }) 
                          }
                        ]
                      }}
                      className="mb-2"
                    >
                      <View className="bg-purple-200 rounded-xl p-3 shadow-sm">
                        <Text>{thought}</Text>
                      </View>
                    </Animated.View>
                  ))
                ) : (
                  <View className="items-center justify-center py-8">
                    <Feather name="plus-circle" size={32} color="#9CA3AF" />
                    <Text className="text-gray-500 text-center mt-2">
                      Agrega pensamientos negativos que quieras transformar
                    </Text>
                  </View>
                )}
              </View>
            </View>
            
            {/* Botón de alternar pensamientos positivos */}
            <TouchableOpacity 
              onPress={() => setShowPositive(!showPositive)}
              activeOpacity={0.7}
              className="bg-green-500 p-3 rounded-xl mb-4 flex-row items-center justify-center shadow-sm"
            >
              <Text className="text-white font-semibold mr-2">
                {showPositive ? "Ocultar pensamientos positivos" : "Mostrar pensamientos positivos"}
              </Text>
              <Animated.View style={{ transform: [{ rotate: arrowRotationDeg }] }}>
                <Feather name="chevron-right" size={20} color="white" />
              </Animated.View>
            </TouchableOpacity>
            
            {/* Pensamientos positivos (condicional) */}
            {showPositive && (
              <View className="bg-blue-100 rounded-xl p-4 mb-4 shadow-sm">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-lg font-semibold">Pensamientos positivos:</Text>
                  <TouchableOpacity 
                    onPress={refreshPositiveThoughts}
                    activeOpacity={0.7}
                    className="flex-row items-center bg-blue-50 p-1 px-2 rounded-lg"
                  >
                    <Feather name="refresh-cw" size={16} color="#3B82F6" className="mr-1" />
                    <Text className="text-blue-500">Refrescar</Text>
                  </TouchableOpacity>
                </View>
                
                <View className="space-y-2">
                  {positiveThoughts.map((thought, index) => (
                    <View key={index} className="bg-white rounded-xl p-3 mb-2 shadow-sm">
                      <Text>{thought}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
        
        {phase === 'transform' && (
          <>
            <SpeechBubble 
              text="¡Excelente! Ahora puedes reemplazar los pensamientos negativos con ideas más constructivas." 
              source="Buno"
            />
            <ThemedAvatar 
              source={require('../../../../assets/avatars/avatar-3.png')} 
              animate
            />
            
            <View className="bg-blue-100 rounded-xl p-4 mt-4 shadow-sm">
              <Text className="font-bold text-center mb-3">Pensamientos constructivos:</Text>
              <View className="space-y-2">
                {positiveThoughts.map((thought, index) => (
                  <View key={index} className="bg-white rounded-xl p-3 mb-2 shadow-sm">
                    <Text>{thought}</Text>
                  </View>
                ))}
              </View>
              
              <TouchableOpacity 
                onPress={refreshPositiveThoughts}
                activeOpacity={0.7}
                className="flex-row items-center justify-center mt-3 bg-blue-50 py-2 rounded-lg mx-8"
              >
                <Feather name="refresh-cw" size={16} color="#3B82F6" className="mr-1" />
                <Text className="text-blue-500">Mostrar otras alternativas</Text>
              </TouchableOpacity>
            </View>
            
            <View className="mt-6 p-4 bg-yellow-100 rounded-xl shadow-sm">
              <Text className="text-center text-gray-700">
                La Terapia Cognitivo-Conductual nos enseña que nuestros pensamientos influyen directamente 
                en nuestras emociones y comportamientos. Al reemplazar los pensamientos limitantes por otros 
                más constructivos, podemos cambiar cómo nos sentimos y actuamos.
              </Text>
            </View>
          </>
        )}
        
        {phase === 'complete' && (
          <>
            <SpeechBubble 
              text="¡Felicidades! Has completado el ejercicio de transformación de pensamientos. Con la práctica, este proceso será cada vez más natural." 
              source="Buno"
            />
            <ThemedAvatar 
              source={require('../../../../assets/avatars/avatar-3.png')} 
              animate
            />
            
            <View className="bg-green-100 rounded-xl p-4 mt-4 shadow-sm">
              <Text className="font-bold text-center mb-2">Beneficios de la transformación de pensamientos:</Text>
              <View className="space-y-2">
                <View className="bg-white rounded-xl p-3 mb-2 shadow-sm">
                  <Text>• Reduce la ansiedad y el estrés</Text>
                </View>
                <View className="bg-white rounded-xl p-3 mb-2 shadow-sm">
                  <Text>• Mejora tu confianza y autoestima</Text>
                </View>
                <View className="bg-white rounded-xl p-3 mb-2 shadow-sm">
                  <Text>• Aumenta tu capacidad para resolver problemas</Text>
                </View>
                <View className="bg-white rounded-xl p-3 mb-2 shadow-sm">
                  <Text>• Desarrolla una mentalidad de crecimiento</Text>
                </View>
              </View>
            </View>
          </>
        )}
      </ScrollView>
      
      {/* Pie con botones */}
      <View className="px-6 mb-6">
        {phase === 'input' && (
          <Btn 
            text="Transformar mis pensamientos" 
            onPress={handleTransformThoughts}
            icon={<Feather name="refresh-cw" size={20} color="white" />}
          />
        )}
        
        {phase === 'transform' && (
          <>
            <Btn 
              text="He interiorizado estos pensamientos" 
              onPress={completeExercise}
              icon={<Feather name="check" size={20} color="white" />}
            />
            <Btn 
              text="Volver a mis pensamientos" 
              onPress={() => setPhase('input')}
              color="bg-yellow-500"
              icon={<Feather name="arrow-left" size={20} color="white" />}
            />
          </>
        )}
        
        {phase === 'complete' && (
          <>
            <Btn 
              text="Practicar de nuevo" 
              onPress={resetExercise}
              icon={<Feather name="refresh-cw" size={20} color="white" />}
            />
            <Btn 
              text="Finalizar" 
              onPress={() => {router.push("/ToolsScreen")}}
              color="bg-blue-500"
              icon={<Feather name="check-circle" size={20} color="white" />}
            />
          </>
        )}
      </View>
    </ThemedView>
  );
};

export default ThoughtsScreen;