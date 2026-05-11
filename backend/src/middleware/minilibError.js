// ─── Classe d'erreur métier personnalisée ─────────────────────────────
/**
* Erreur métier MiniLib avec code HTTP associé.
* Permet de distinguer les erreurs métier (400/404) des erreurs serveur
(500).
*
* @extends Error
*/
class MiniLibError extends Error {
    /**
    * @param {string} message - Message lisible
    * @param {number} statusCode - Code HTTP à retourner (400, 404, 409...)
    */
    constructor(message, statusCode = 400) {
        super(message);
        this.name = 'MiniLibError';
        this.statusCode = statusCode;
    }
}

// ─── Middleware de gestion d'erreurs Express ───────────────────────────
// Dans app.js — capture toutes les erreurs lancées dans les routes async
const errorHandler = (err, req, res, next) => {
    // Erreur métier connue → code HTTP spécifique
    if (err instanceof MiniLibError) {
        return res.status(err.statusCode).json({ erreur: err.message });
    }
    // Erreur PostgreSQL → log serveur, 500 générique pour le client
    console.error('[ERREUR SERVEUR]', err.message);
    res.status(500).json({ erreur: 'Erreur interne du serveur' });
};