
// URL base del backend. Se configura en .env (EXPO_PUBLIC_API_URL);
// tras cambiarla, reiniciar Metro con caché limpia: npx expo start --go -c
const url = process.env.EXPO_PUBLIC_API_URL ?? 'http://192.168.18.4:8000'

const urlContainer = () => {
  return url
}

export default urlContainer
