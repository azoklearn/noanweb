# 🚀 NOAN WEB - Site Agence de Communication

Site web professionnel inspiré du design NANCOMCY pour l'agence **Noan Web** à Nancy, France.

## ✨ Caractéristiques

### 🎨 Design & Animations
- **Preloader animé** avec effet d'écrans rotatifs (4 couleurs)
- **Hero section** avec animation "reveal" mot par mot
- **Bouton showreel** interactif qui suit la souris
- **Compteurs animés** avec effet de rouleau (slot machine)
- **Cartes prestations** avec effets de brillance et lift au hover
- **Boutons marquee** avec défilement de texte au survol
- **Effet glitch** sur la sélection de texte
- **Menu overlay** en plein écran avec animation fluide

### 🎯 Sections
1. **Hero** - Titre animé + bouton showreel
2. **Stats** - Compteurs avec chiffres clés
3. **Communication** - Présentation 2 colonnes avec image
4. **Feuille de route** - 3 blocs moteur/carburant/setup
5. **Prestations** - Grille de services (6 blocs)
6. **CTA** - Appel à l'action final
7. **Footer** - Informations de contact

## 📋 Technologies Utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Animations avancées, Grid, Flexbox
- **JavaScript** - Vanilla JS (pas de framework)
- **GSAP** - Librairie d'animation (CDN)
- **Google Fonts** - Oswald & Plus Jakarta Sans

## 🎨 Palette de Couleurs

- **Noir** : `#000000` - Fond principal
- **Bleu** : `#142DEB` - Accent principal
- **Rose** : `#FFABE7` - Accent secondaire
- **Rouge** : `#E30C00` - Footer
- **Blanc** : `#FFFFFF` - Texte

## 📱 Responsive Design

Le site est entièrement responsive avec 3 breakpoints :
- **Desktop** : > 991px
- **Tablet** : 768px - 991px
- **Mobile** : < 768px

## 🚀 Installation & Utilisation

### Méthode 1 : Ouverture directe
1. Double-cliquez sur `index.html`
2. Le site s'ouvre dans votre navigateur par défaut

### Méthode 2 : Serveur local (recommandé)

**Avec Python :**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Avec Node.js :**
```bash
# Installer http-server globalement
npm install -g http-server

# Lancer le serveur
http-server -p 8000
```

**Avec PHP :**
```bash
php -S localhost:8000
```

Puis ouvrez : `http://localhost:8000`

### Méthode 3 : Avec VS Code
1. Installez l'extension **Live Server**
2. Clic droit sur `index.html`
3. Sélectionnez "Open with Live Server"

## 📂 Structure des Fichiers

```
noan-web/
│
├── index.html              # Page principale
├── style.css               # Tous les styles
├── script.js               # Toutes les animations
├── logo-placeholder.png    # Logo de l'agence
├── README.md              # Ce fichier
└── AMELIORATIONS.md       # Liste des améliorations
```

## ⚙️ Personnalisation

### Changer le logo
Remplacez `logo-placeholder.png` par votre logo (format PNG ou SVG recommandé)

### Modifier les couleurs
Dans `style.css`, cherchez et remplacez :
- `#142DEB` pour changer le bleu
- `#FFABE7` pour changer le rose
- `#E30C00` pour changer le rouge

### Ajuster les animations
Dans `script.js`, modifiez :
- `PRELOADER_TRANSITION_DURATION` pour la vitesse du preloader
- `attractionStrength` pour l'effet magnétique du bouton showreel
- `--dur` et `--stagger` dans CSS pour le reveal du titre

### Ajouter votre vidéo showreel
Dans `script.js`, ligne ~180, remplacez l'alerte par votre modal vidéo :
```javascript
showreelBtn.addEventListener('click', function() {
    // Ouvrir votre modal vidéo ici
    // Exemple : modal.show() ou window.open('video.html')
});
```

## 📞 Informations de Contact

- **Nom** : Noan Web
- **Ville** : Nancy, France
- **Téléphone** : 07 66 87 39 15
- **Année de création** : 2025

Pour modifier ces informations, éditez `index.html` :
- Ligne 73 : Téléphone dans le header
- Ligne 185 : Adresse et téléphone dans le footer

## 🎬 Animations Incluses

### JavaScript
- ✅ Preloader avec écrans rotatifs
- ✅ Menu hamburger animé
- ✅ Reveal mot par mot (Hero)
- ✅ Compteurs avec effet rouleau
- ✅ Bouton showreel magnétique
- ✅ Smooth scroll
- ✅ Parallax sur les cartes
- ✅ Effet glitch sur sélection
- ✅ Intersection Observer

### CSS
- ✅ Boutons marquee avec défilement
- ✅ Cartes avec shine effect
- ✅ Transitions cubic-bezier premium
- ✅ Keyframes pour rotations
- ✅ Hover effects avancés

## 🔧 Dépannage

### Le preloader ne disparaît pas
- Ouvrez la console (F12)
- Vérifiez s'il y a des erreurs JavaScript
- Actualisez la page (Ctrl + F5)

### Les animations ne fonctionnent pas
- Vérifiez que JavaScript est activé
- Assurez-vous que GSAP (CDN) se charge correctement
- Testez sur un autre navigateur

### Le site ne s'affiche pas correctement
- Videz le cache du navigateur
- Vérifiez que tous les fichiers sont dans le même dossier
- Utilisez un serveur local au lieu d'ouvrir directement le HTML

## 🌐 Navigateurs Supportés

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ Internet Explorer : Non supporté

## 📈 Performance

- ⚡ Pas de librairies lourdes (seulement GSAP en CDN)
- ⚡ Animations GPU-accelerated
- ⚡ Images optimisées
- ⚡ Code minifié (à faire avant mise en production)

## 🚀 Prochaines Étapes

1. **Ajouter vos contenus** :
   - Remplacer les images placeholder
   - Ajouter vos vrais projets
   - Intégrer votre vidéo showreel

2. **Optimiser pour la production** :
   - Minifier CSS et JS
   - Compresser les images
   - Ajouter un favicon

3. **SEO** :
   - Ajouter des meta tags Open Graph
   - Créer un sitemap.xml
   - Optimiser les balises meta

4. **Fonctionnalités** :
   - Formulaire de contact fonctionnel
   - Google Analytics
   - Module de gestion de cookies

## 📝 Licence

Ce projet est un template personnalisé pour Noan Web.
Design inspiré par NANCOMCY.

---

**Créé avec ❤️ pour Noan Web - Nancy, France 🇫🇷**

Pour toute question : 07 66 87 39 15
