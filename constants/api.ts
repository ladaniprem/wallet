// Prefer an env var in Expo; default to Render API in production
// Accepts accidental path segments like "/api/health" and normalizes to "/api".
const raw = process.env.EXPO_PUBLIC_API_URL || "https://wallet-api-yfnt.onrender.com/api";

function normalizeApiBase(url: string): string {
    try {
        const u = new URL(url);
        // If path ends with "/api/health" or includes extra segments, collapse to "/api"
        if (u.pathname.startsWith("/api")) {
            u.pathname = "/api";
        }
        // Remove any trailing slash for consistency
        u.pathname = u.pathname.replace(/\/$/, "");
        return u.toString().replace(/\/$/, "");
    } catch {
        // If not a valid URL, fall back to the intended Render API base
        return "https://wallet-api-yfnt.onrender.com/api";
    }
}

export const API_URL = normalizeApiBase(raw);