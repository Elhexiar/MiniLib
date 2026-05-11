// src/types/livre.ts
/**
 * Représente un livre dans le catalogue MiniLib.
 * Correspond exactement à la table livres dans PostgreSQL.
 */
export interface Livre {
  id: number;
  isbn: string;
  titre: string;
  auteur: string;
  annee: number;
  genre: string;
  disponible: boolean;
}
/**
 * Données nécessaires pour créer un nouveau livre.
 * Pas d'id (généré par PostgreSQL) ni de disponible (true par défaut).
 */
export interface CreateLivreDto {
  isbn: string;
  titre: string;
  auteur: string;
  annee?: number; // ? = propriété optionnelle
  genre?: string;
}

/**
 * Filtres optionnels pour la liste des livres.
 */
export interface FiltresLivre {
  genre?: string;
  disponible?: boolean;
  recherche?: string;
}
