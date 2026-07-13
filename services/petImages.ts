import axios from 'axios';

export type PetKind = 'dog' | 'cat';

/**
 * Imagen aleatoria de mascota desde APIs públicas gratuitas (HTTPS, sin key):
 * - Perros: https://dog.ceo (Stanford Dogs dataset)
 * - Gatos:  https://cataas.com (imagen directa, cache-bust por query)
 */
export const getPetImageUrl = async (kind: PetKind): Promise<string> => {
  if (kind === 'dog') {
    const { data } = await axios.get('https://dog.ceo/api/breeds/image/random', {
      timeout: 8000,
    });
    if (data?.status === 'success' && typeof data.message === 'string') {
      return data.message;
    }
    throw new Error('No se pudo obtener la imagen');
  }
  return `https://cataas.com/cat?width=800&ts=${Date.now()}`;
};
