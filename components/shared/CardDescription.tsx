/* src/components/shared/CardDescription.tsx */
import React from 'react';
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  title: string;
  body: string;
  iconName: keyof typeof Ionicons.glyphMap;
  color: string;           // mismo bg-* de la card origen
  onClose: () => void;
}

const CardDescription = ({
  visible,
  title,
  body,
  iconName,
  color,
  onClose,
}: Props) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      {/* Overlay oscuro */}
      <Pressable className="flex-1 bg-black/40 items-center justify-center" onPress={onClose}>
        {/* Card */}
        <View className={`w-11/12 max-h-[80%] p-5 rounded-2xl ${color}`}>
          {/* Header */}
          <View className="flex-row items-center mb-3">
            <Ionicons name={iconName} size={26} color="white" />
            <Text className="text-white text-lg font-bold ml-3 flex-1">
              {title}
            </Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="white" />
            </Pressable>
          </View>

          {/* Body scrollable */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-white text-sm whitespace-pre-wrap">
              {body.trim()}
            </Text>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

export default CardDescription;
