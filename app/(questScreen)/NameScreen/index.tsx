import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { useSurvey } from '@/hooks/SurveyContext';
import SpeechBubble from '@/components/questions/SpeechBubble';
import ThemedButton from '@/components/shared/ThemedButton';
import ThemedAvatar from '@/components/questions/ThemedAvatar';
import ThemedView from '@/components/shared/ThemedView';

const LETTERS = "A-Za-zÁÉÍÓÚÜÑáéíóúüñ";

const hasThreeLettersInRow = (s) =>
  new RegExp(`[${LETTERS}]{3,}`).test(s);

const sanitizeName = (raw) => {
  if (!raw) return "";

  // 1) Permitir solo letras y espacio
  let s = raw.replace(new RegExp(`[^${LETTERS} ]`, "g"), "");

  // 2) Colapsar múltiples espacios en uno
  s = s.replace(/\s+/g, " ");

  // 3) Quitar espacio inicial
  s = s.replace(/^ /, "");

  // (OJO) No quitamos el espacio final para permitir escribir la siguiente palabra
  return s;
};

const NameScreen = () => {
  const { responses, updateResponse } = useSurvey();
  const nombre = responses?.nombre || "";

  const handleChange = (text) => {
    const cleaned = sanitizeName(text);
    updateResponse("nombre", cleaned);
  };

  const isNameValid = hasThreeLettersInRow(nombre);

  return (
    <ThemedView margin className="flex-1 justify-between">
      <View className="flex-1 mt-5">
        <View className="items-center mb-2">
          <Text className="font-semibold text-lg text-gray-500">1/6</Text>
          <Text className="text-3xl font-bold text-black">Información Personal</Text>
          <Text className="text-base text-gray-400">
            Completa los campos para poder ayudarte
          </Text>
        </View>

        <View className="items-center justify-center flex-1 pb-10">
          <SpeechBubble
            text="Ya sabes que yo soy Buno 😊 ¿Y tú? ¿Cómo te llamas?"
            source="Buno"
          />
          <ThemedAvatar
            source={require('../../../assets/avatars/avatar-1.png')}
            animate
          />

          <TextInput
            className="border p-2 rounded-full my-4 w-11/12 bg-white"
            placeholder="Escribe tu nombre"
            value={nombre}
            onChangeText={handleChange}
            autoCapitalize="words"
            autoCorrect={false}
            inputMode="text"
          />

          {!isNameValid && nombre.length > 0 && (
            <Text className="text-purple-500 text-sm mt-1">
              Ingresa al menos 3 letras seguidas. Solo se permite un espacio entre palabras.
            </Text>
          )}
        </View>
      </View>

      <View className="mb-5">
        <ThemedButton disabled={!isNameValid} route="GenderScreen">
          Continuar
        </ThemedButton>
      </View>
    </ThemedView>
  );
};

export default NameScreen;
