// ========================================
// GOOGLE REVIEWS - Chargement des avis
// ========================================

/**
 * Pour utiliser cette fonctionnalité, vous avez besoin de :
 * 
 * OPTION 1 - Widget Google (Recommandé - Simple)
 * -----------------------------------------------
 * 1. Allez sur https://business.google.com
 * 2. Connectez-vous à votre compte Google Business
 * 3. Allez dans "Avis" > "Obtenir plus d'avis"
 * 4. Copiez le code du widget fourni par Google
 * 5. Remplacez le contenu de #google-reviews-widget par ce code
 * 
 * OPTION 2 - Google Places API (Plus personnalisé)
 * ------------------------------------------------
 * 1. Créez un projet sur Google Cloud Console
 * 2. Activez l'API "Places API"
 * 3. Créez une clé API
 * 4. Remplacez GOOGLE_PLACES_API_KEY ci-dessous par votre clé
 * 5. Remplacez GOOGLE_PLACE_ID par votre Place ID (trouvable sur Google Maps)
 */

const GOOGLE_PLACES_API_KEY = 'AIzaSyDu7OtByU-uH0OBsfEe-7pko_VO0MQequE';
const GOOGLE_PLACE_ID = '10213506924231430708';

function loadGoogleReviews() {
    const widget = document.getElementById('google-reviews-widget');
    if (!widget) return;

    // Vérifier si la clé API est configurée
    if (!GOOGLE_PLACES_API_KEY || GOOGLE_PLACES_API_KEY === 'AIzaSyDu7OtByU-uH0OBsfEe-7pko_VO0MQequE') {
        console.warn('Google Places API Key non configurée');
        widget.innerHTML = '<p style="color: rgba(255,255,255,0.7); text-align: center; padding: 2rem;">Pour afficher vos avis Google, vous devez :<br><br>1. Créer un projet sur <a href="https://console.cloud.google.com" target="_blank" style="color: #fff; text-decoration: underline;">Google Cloud Console</a><br>2. Activer l\'API "Places API"<br>3. Créer une clé API<br>4. Remplacer GOOGLE_PLACES_API_KEY dans google-reviews.js par votre clé</p>';
        return;
    }

    // Charger les avis depuis Google Places API
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=name,rating,reviews&key=${GOOGLE_PLACES_API_KEY}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'OK' && data.result.reviews) {
                displayReviews(data.result.reviews);
            } else {
                console.error('Erreur API Google:', data.status, data.error_message);
                widget.innerHTML = `<p style="color: rgba(255,255,255,0.7); text-align: center; padding: 2rem;">Impossible de charger les avis pour le moment.<br>Erreur: ${data.error_message || data.status}</p>`;
            }
        })
        .catch(error => {
            console.error('Erreur lors du chargement des avis:', error);
            widget.innerHTML = '<p style="color: rgba(255,255,255,0.7); text-align: center; padding: 2rem;">Erreur lors du chargement des avis. Vérifiez votre connexion internet.</p>';
        });
}

function displayReviews(reviews) {
    const widget = document.getElementById('google-reviews-widget');
    if (!widget) return;

    widget.innerHTML = reviews.slice(0, 6).map(review => `
        <div class="avis-card">
            <div class="avis-header">
                <div class="avis-author">${review.author_name}</div>
                <div class="avis-rating">
                    ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                </div>
            </div>
            <div class="avis-text">${review.text}</div>
            <div class="avis-date">${new Date(review.time * 1000).toLocaleDateString('fr-FR')}</div>
        </div>
    `).join('');
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', () => {
    loadGoogleReviews();
});

