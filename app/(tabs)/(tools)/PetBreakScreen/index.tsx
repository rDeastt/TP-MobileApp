import { View, Text, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Screen from '@/components/shared/Screen';
import ThemedButton from '@/components/shared/ThemedButton';
import { getPetImageUrl, PetKind } from '@/services/petImages';
import { logCompletion } from '@/services/activityLog';

/** Vistas necesarias para registrar la actividad como completada. */
const VIEWS_TO_COMPLETE = 3;

const PetBreakScreen = () => {
  const [kind, setKind] = useState<PetKind>('dog');
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [views, setViews] = useState(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchImage = useCallback(async (petKind: PetKind) => {
    setLoading(true);
    setError(false);
    try {
      const imageUrl = await getPetImageUrl(petKind);
      if (!mountedRef.current) return;
      setUrl(imageUrl);
      setViews((v) => {
        const next = v + 1;
        if (next === VIEWS_TO_COMPLETE) {
          logCompletion('petBreak');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        return next;
      });
    } catch {
      if (!mountedRef.current) return;
      setError(true);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImage('dog');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const switchKind = (next: PetKind) => {
    Haptics.selectionAsync();
    setKind(next);
    fetchImage(next);
  };

  return (
    <Screen className="px-4">
      <Text className="text-2xl font-bold text-center mt-6 text-content dark:text-content-dark">
        Descanso visual
      </Text>
      <Text className="text-center text-muted dark:text-muted-dark mt-1 mb-4">
        🐾 Un minuto de ternura baja el estrés más de lo que crees 🐾
      </Text>

      {/* Selector perro/gato */}
      <View className="flex-row justify-center gap-3 mb-4">
        {(
          [
            { id: 'dog' as PetKind, label: '🐶 Perritos' },
            { id: 'cat' as PetKind, label: '🐱 Gatitos' },
          ]
        ).map((opt) => (
          <Text
            key={opt.id}
            onPress={() => switchKind(opt.id)}
            className={`px-5 py-2 rounded-full overflow-hidden font-semibold ${
              kind === opt.id
                ? 'bg-main text-white'
                : 'bg-card dark:bg-card-dark text-gray-700 dark:text-gray-300'
            }`}
          >
            {opt.label}
          </Text>
        ))}
      </View>

      {/* Imagen */}
      <View className="flex-1 items-center justify-center">
        <View className="w-full aspect-square max-h-96 rounded-3xl overflow-hidden bg-card dark:bg-card-dark items-center justify-center">
          {error ? (
            <View className="items-center px-6">
              <Text style={{ fontSize: 44, lineHeight: 56 }}>📡</Text>
              <Text className="text-center text-muted dark:text-muted-dark mt-2">
                No se pudo cargar la imagen. Revisa tu conexión e intenta de nuevo.
              </Text>
            </View>
          ) : (
            <>
              {url && (
                <Image
                  source={{ uri: url }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                  transition={300}
                  cachePolicy="memory-disk"
                  onLoadEnd={() => setLoading(false)}
                />
              )}
              {loading && (
                <View className="absolute">
                  <ActivityIndicator size="large" color="#4ADF86" />
                </View>
              )}
            </>
          )}
        </View>

        <Text className="text-sm text-muted dark:text-muted-dark mt-3">
          {views >= VIEWS_TO_COMPLETE
            ? '✅ Descanso registrado — sigue si quieres'
            : `Mira ${VIEWS_TO_COMPLETE} para completar tu descanso (${views}/${VIEWS_TO_COMPLETE})`}
        </Text>
      </View>

      <View className="mb-8">
        <ThemedButton onPress={() => fetchImage(kind)}>
          {kind === 'dog' ? 'Otro perrito 🐶' : 'Otro gatito 🐱'}
        </ThemedButton>
      </View>
    </Screen>
  );
};

export default PetBreakScreen;
