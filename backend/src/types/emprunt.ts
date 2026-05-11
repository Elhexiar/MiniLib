export interface Emprunt {
  id: number;
  livre_id: number;
  adherent_id: number;
  date_emprunt: Date;
  date_retour_prevue: Date;
  date_retour_effective: Date | null; // null = pas encore rendu
}

// Interface enrichie avec les données jointes (JOIN SQL)
export interface EmpruntAvecDetails extends Emprunt {
  titre_livre: string; // depuis livres.titre
  nom_adherent: string; // depuis adherents.nom + prenom
  en_retard: boolean; // calculé : date_retour_prevue < aujourd'hui
}

export interface CreateEmpruntDto {
  livre_id: number;
  adherent_id: number;
}
