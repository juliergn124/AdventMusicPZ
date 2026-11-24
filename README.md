# Calendrier de l'Avent musical

## Mettre en ligne (GitHub Pages)
1. Crée un dépôt GitHub, puis envoie TOUT le contenu de ce dossier à la racine (index.html, style.css, answers.js, app.js, remake.js, dossier images/).
2. Settings > Pages > Source : "Deploy from a branch", branche main, dossier / (root). Enregistre.
3. Le site est disponible après 1 à 2 minutes sur https://TON-PSEUDO.github.io/NOM-DU-DEPOT/

## Tester
Ajoute `?test=1` à l'adresse : toutes les cases sont ouvertes, la réponse attendue est affichée, on peut sauter à un jour,
simuler tout le jeu (pour voir le final et la vidéo) et tout remettre à zéro. Sauvegarde séparée du vrai jeu.

## Modifier
- answers.js : réponses, liens Spotify, date de départ (CONFIG year/month), nombre d'essais, points, pénalité d'indice.
- Les cases s'ouvrent chaque jour à minuit (heure de l'appareil). Les points sont gardés dans le navigateur (localStorage).
