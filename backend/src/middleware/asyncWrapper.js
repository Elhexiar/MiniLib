// backend/src/middleware/asyncWrapper.js

/** @import { RequestHandler } from 'express' */

/**
 * Enveloppe un handler Express async pour propager les erreurs.
 * @param {RequestHandler} fn - Handler async
 * @returns {RequestHandler} Handler avec gestion d'erreur automatique
 */
const asyncWrapper = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
export default asyncWrapper;
