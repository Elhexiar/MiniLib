// backend/src/models/adherentsModel.js
/**
 * Accès aux données adhérents via PostgreSQL.
 * @module adherentsModel
 */
import pool from "../config/database.js";

/** @import { Adherent, CreateAdherentDto } from '../types/index.js' */

/**
 * Génère un numéro adhérent unique au format ADH-XXX.
 * @async
 * @returns {Promise<string>} Numéro adhérent
 */
const genererNumeroAdherent = async () => {
  const result = await pool.query("SELECT COUNT(*) FROM adherents");
  const count = parseInt(result.rows[0].count) + 1;
  return `ADH-${String(count).padStart(3, "0")}`; // ADH-001, ADH-042...
};
/** @async @returns {Promise<Adherent[]>} Tous les adhérents actifs */
export const findAll = async () => {
  const result = await pool.query(
    "SELECT * FROM adherents WHERE actif = true ORDER BY nom, prenom",
  );
  return result.rows;
};
/** @async @param {number} id @returns {Promise<Adherent|null>} */
export const findById = async (id) => {
  const result = await pool.query("SELECT * FROM adherents WHERE id = $1", [
    id,
  ]);
  return result.rows[0] || null;
};

/**
 * Crée un nouvel adhérent avec numéro automatique.
 * @async
 * @param {CreateAdherentDto} data - { nom, prenom, email }
 * @returns {Promise<Adherent>} Adhérent créé
 */
export const create = async ({ nom, prenom, email }) => {
  const numero = await genererNumeroAdherent();
  const result = await pool.query(
    `INSERT INTO adherents (numero_adherent, nom, prenom, email)
VALUES ($1, $2, $3, $4) RETURNING *`,
    [numero, nom, prenom, email],
  );
  return result.rows[0];
};
/**
 * Désactive un adhérent (soft delete — on ne supprime jamais en BDD).
 * @async
 * @param {number} id
 * @returns {Promise<Adherent|null>} Adhérent mis à jour
 */
export const desactiver = async (id) => {
  const result = await pool.query(
    "UPDATE adherents SET actif = false WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0] || null;
};
