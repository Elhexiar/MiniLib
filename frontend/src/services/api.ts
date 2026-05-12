// frontend/src/services/api.ts
// Client HTTP centralisé — toute l'app passe par ici

// Vite expose les variables VITE_ via import.meta.env
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export interface ApiError {
  erreur: string;
  champs?: string[];
}

/**
 * Effectue un appel HTTP vers l'API MiniLib.
 * Lance une Error si le status HTTP est >= 400.
 *
 * @param endpoint  Chemin relatif ex: "/livres" ou "/livres/1"
 * @param options   Options fetch natives (method, body, headers...)
 * @returns         Réponse parsée en JSON, typée T
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    // Tenter de lire le message d'erreur renvoyé par l'API
    const erreur: ApiError = await response.json().catch(() => ({
      erreur: `Erreur HTTP ${response.status}`,
    }));
    throw new Error(erreur.erreur);
  }

  // 204 No Content : pas de corps à parser (DELETE)
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
