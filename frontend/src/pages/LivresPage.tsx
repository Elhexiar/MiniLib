// frontend/src/pages/LivresPage.tsx
import { useState, useEffect } from "react";
import type { Livre, FiltresLivre } from "../types";
import { getLivres } from "../services/livreService";
import LivreCard from "../components/LivreCard";
import "../index.css";

function LivresPage() {
  // Les 3 états pour tout fetch : données, chargement, erreur
  const [livres, setLivres] = useState<Livre[]>([]);
  const [chargement, setChargement] = useState<boolean>(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [filtres, setFiltres] = useState<FiltresLivre>({});

  // Chargement au montage du composant
  useEffect(() => {
    const chargerLivres = async () => {
      try {
        setChargement(true);
        setErreur(null);

        //artificial delay pour tester le loader
        await new Promise((resolve) => setTimeout(resolve, 500));

        const data = await getLivres(filtres);
        setLivres(data);
      } catch (err) {
        setErreur(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setChargement(false);
      }
    };

    chargerLivres();
  }, [filtres]); // [] = une seule fois au montage

  if (erreur) {
    return (
      <div>
        <p style={{ color: "red" }}>Erreur : {erreur}</p>
        <p>Vérifiez que le backend tourne sur http://localhost:5000</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Catalogue de livres</h1>

      <div className="filtres-input-container" style={{ marginBottom: "16px" }}>
        <div
          className="filtres-recherche-input"
          style={{ marginBottom: "16px" }}
        >
          <form style={{ marginBottom: "24px" }}>
            <label> Trouver un livre : </label>
            <input
              type="search"
              name="recherche"
              placeholder="Titre, auteur..."
            />
            <button
              type="submit"
              style={{ marginLeft: "8px" }}
              onClick={(e) => {
                e.preventDefault();

                const form = e.currentTarget.form;
                const recherche = form
                  ? new FormData(form).get("recherche")?.toString().trim()
                  : "";

                setFiltres((prev) => ({
                  ...prev,
                  recherche: recherche || undefined,
                }));
              }}
            >
              Rechercher
            </button>
          </form>
          {filtres.recherche && (
            <p>
              Résultats pour "<strong>{filtres.recherche}</strong>"
            </p>
          )}
        </div>
        <div className="filtres-genre-input">
          <label>Filtrer par genre : </label>
          <select
            onChange={(e) =>
              setFiltres((prev) => ({
                ...prev,
                genre: e.target.value || undefined,
              }))
            }
            value={filtres.genre || ""}
          >
            <option value="">Tous</option>
            <option value="Roman">Roman</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Informatique">Informatique</option>
          </select>
        </div>
        <div className="filtres-disponible-input" style={{ marginTop: "12px" }}>
          <label>Afficher uniquement les disponibles : </label>
          <select
            onChange={(e) =>
              setFiltres((prev) => ({
                ...prev,
                disponible:
                  e.target.value === "true"
                    ? true
                    : e.target.value === "false"
                      ? false
                      : undefined,
              }))
            }
            value={
              filtres.disponible === true
                ? "true"
                : filtres.disponible === false
                  ? "false"
                  : ""
            }
          >
            <option value="">Tous</option>
            <option value="true">Disponibles</option>
            <option value="false">Empruntés</option>
          </select>
        </div>
      </div>

      <p style={{ marginBottom: "16px", color: "#555" }}>
        {livres.length} livre{livres.length > 1 ? "s" : ""} dans la bibliothèque
      </p>
      {chargement ? (
        <span className="loader"></span>
      ) : livres.length === 0 ? (
        <p>Aucun livre dans le catalogue.</p>
      ) : (
        livres.map((livre) => <LivreCard key={livre.id} livre={livre} />)
      )}
    </div>
  );
}

export default LivresPage;
