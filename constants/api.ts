// Prefer an env var in Expo; default to Render API in production
// Example: set EXPO_PUBLIC_API_URL="https://wallet-api-yfnt.onrender.com/api"
export const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL || "https://wallet-api-yfnt.onrender.com/api";
// export const API_URL = EXPO_PUBLIC_API_URL;