# Noanweb Landing Page

## 📋 Vue d'ensemble

Site landing page moderne avec React + Vite, animations Framer Motion et design Tailwind CSS. Hébergé sur Vercel.

**Stack**: React 18 • TypeScript • Vite 5 • Tailwind CSS • Framer Motion

---

## 🏗️ Structure du projet

```
src/
├── main.tsx              # Point d'entrée React
├── App.tsx               # Composant racine (gère le loading screen)
├── index.css             # Styles globaux
└── components/
    ├── Hero.tsx          # Section héros (section visible au chargement)
    ├── About.tsx         # Section "À propos"
    ├── Features.tsx      # Section fonctionnalités
    ├── Contact.tsx       # Section contact
    ├── LoadingScreen.tsx # Écran de chargement animé
    ├── WordsPullUp.tsx   # Composant d'animation de texte
    ├── WordsPullUpMultiStyle.tsx  # Variante multi-style du composant
    └── AnimatedLetter.tsx         # Animation lettre par lettre
```

---

## 🎯 Sections du site

| Section | Fichier | Description |
|---------|---------|-------------|
| **Hero** | `Hero.tsx` | Landing page d'accueil avec CTA |
| **About** | `About.tsx` | Présentation du projet/produit |
| **Features** | `Features.tsx` | Liste des fonctionnalités principales |
| **Contact** | `Contact.tsx` | Formulaire ou infos de contact |
| **Loading** | `LoadingScreen.tsx` | Animation au chargement initial |

---

## 🎨 Composants réutilisables

### WordsPullUp
Animation qui fait apparaître les mots en les "tirant" vers le haut (fade-in).
- Props: `text`, `className`, `showAsterisk`, `delay`
- Déclenche au scroll (InView)

### WordsPullUpMultiStyle
Variante du composant pour appliquer différents styles à des mots spécifiques.

### AnimatedLetter
Animation lettre par lettre pour des textes importants.

---

## 🚀 Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement (port 5173/5174)
npm run dev

# Build pour production
npm run build

# Prévisualiser la build
npm run preview
```

### URL locale
- **Dev**: http://localhost:5174/ (peut varier si 5173 est occupé)

---

## 📦 Dépendances principales

- **framer-motion**: Animations fluides
- **lucide-react**: Icônes
- **react & react-dom**: Framework React
- **tailwindcss**: Styling utilitaire
- **vite**: Build tool ultra-rapide
- **typescript**: Type-safety

---

## 🔧 Configuration

### Vite (`vite.config.ts`)
Build optimisée pour React avec hot module replacement.

### Tailwind (`tailwind.config.js`)
Configuration utilitaire CSS pour le design cohérent.

### TypeScript (`tsconfig.json`)
Strict mode activé pour la sécurité des types.

### Vercel (`vercel.json`)
Configuration de déploiement automatique.

---

## 🎬 Flux d'utilisation

1. **Chargement** → `LoadingScreen` s'affiche avec animation
2. **Hero** → Page d'accueil avec CTA principal
3. **Navigation** → Utilisateur scroll vers About → Features → Contact
4. **Animations** → Chaque section s'anime au scroll via Framer Motion + `useInView`

---

## 📝 Notes de développement

- **Mode strict React** activé pour déboguer les problèmes de rendu
- **Animations au scroll** via `useInView` (Framer Motion) → déclenchement une seule fois
- **Design sombre** (bg-black) avec contraste blanc
- **Responsive** via classes Tailwind
- **Auto-deployed** sur Vercel à chaque push sur `main`

---

## 🔄 Git & CI/CD

- **Branche principale**: `main`
- **Hébergement**: Vercel
- **Déploiement**: Automatique sur push vers `main`
- **Derniers commits**:
  - Update logos, favicon, tab title, card links
  - Add vercel.json for Vite deployment
  - Remove node_modules, add .gitignore
  - Initial commit

---

## ⚡ Performance

- Vite garantit un dev server ultra-rapide (<200ms)
- Animations GPU-accelerées via Framer Motion
- Code-splitting automatique lors du build
- Lighthouse-friendly (lazy loading, optimisation d'images)

---

## 📚 Prochaines étapes possibles

- [ ] Ajouter Google Analytics ou autre tracking
- [ ] Intégrer un CMS pour contenu dynamique
- [ ] Optimiser les images (next/image ou equivalent)
- [ ] Ajouter un blog (Blog.tsx)
- [ ] Tests unitaires (Vitest + React Testing Library)
- [ ] Dark/Light mode toggle
