import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal } from 'react-native';
import * as Haptics from 'expo-haptics';
import IntensitySlider from './IntensitySlider';
import { ThoughtItem } from './types';

interface Props {
  thought: ThoughtItem;
  onConfirm: (alternativeThought: string, newIntensity: number) => void;
  onClose: () => void;
}

const TransformModal = ({ thought, onConfirm, onClose }: Props) => {
  const [text, setText] = useState('');
  const [newIntensity, setNewIntensity] = useState(Math.max(1, thought.intensity - 3));

  const confirm = () => {
    if (!text.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onConfirm(text.trim(), newIntensity);
  };

  return (
    <Modal visible transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View className="bg-card dark:bg-card-dark w-full rounded-2xl p-5 shadow-lg">
          <Text className="text-lg font-semibold text-content dark:text-content-dark mb-3">
            Transformar pensamiento
          </Text>
          <Text className="text-sm text-muted dark:text-muted-dark mb-2">
            ¿Qué podrías pensar en lugar de ese pensamiento negativo?
          </Text>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Ej: Este error no me define; puedo mejorar..."
            placeholderTextColor="#9BA1A6"
            multiline
            className="border border-gray-300 dark:border-gray-600 rounded-xl p-3 text-base text-content dark:text-content-dark bg-card dark:bg-card-dark h-28"
          />

          <IntensitySlider
            intensity={newIntensity}
            onChange={setNewIntensity}
            label="¿Qué intensidad sientes ahora?"
          />

          <View className="flex-row justify-end mt-2">
            <Pressable
              className="bg-gray-500 rounded-full px-4 py-2 mr-2 active:opacity-80"
              onPress={onClose}
            >
              <Text className="text-white font-medium">Cancelar</Text>
            </Pressable>
            <Pressable
              className={`rounded-full px-4 py-2 ${
                text.trim() ? 'bg-main active:opacity-80' : 'bg-gray-300 dark:bg-gray-700'
              }`}
              disabled={!text.trim()}
              onPress={confirm}
            >
              <Text className="text-white font-semibold">Guardar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default TransformModal;
