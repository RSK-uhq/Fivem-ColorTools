<div align="center">
  <img src="https://i.imgur.com/your-awesome-banner.png" alt="Bannière RSK-UHQ FiveM Color Replacer" width="700"/>
  <h1>FiveM Color Replacer - RSK-UHQ</h1>
  <p>Un outil puissant et interactif pour transformer facilement les couleurs dans vos ressources FiveM.</p>
  <p>
    <a href="#fonctionnalités">Fonctionnalités</a> •
    <a href="#pré-requis">Pré-requis</a> •
    <a href="#installation">Installation</a> •
    <a href="#utilisation">Utilisation</a> •
    <a href="#formats-de-couleur-supportés">Formats Supportés</a> •
    <a href="#contribution">Contribution</a> •
    <a href="#licence">Licence</a>
  </p>
</div>

---

## 🌟 Introduction

Le **FiveM Color Replacer** est un script universel conçu pour simplifier la modification des couleurs au sein de vos ressources FiveM. Que vous souhaitiez harmoniser la palette de couleurs de votre serveur, ou simplement remplacer une couleur spécifique par une autre, cet outil intuitif et interactif est fait pour vous !

Il prend en charge une large gamme de formats de fichiers et de notations de couleurs, offrant une flexibilité maximale.

## ✨ Fonctionnalités

* **🔍 Détection Intelligente :** Identifie les couleurs par noms (ex: `pink`, `purple`), codes hexadécimaux (`#FF0000`, `#F00`), et formats RGBA/RGB (`{255, 0, 0, 255}`, `rgba(255, 0, 0, 1)`).
* **📂 Support Multi-fichiers :** Analyse et modifie les fichiers `.js`, `.css`, `.lua`, `.json`, `.html`, `.xml`, `.yml`, `.yaml`.
* **🤖 Modes de Remplacement Multiples :**
    * **Automatique :** Remplace toutes les occurrences automatiquement, en conservant le format original.
    * **Manuel par Couleur Unique :** Permet de choisir une couleur de remplacement différente pour chaque couleur unique détectée.
    * **Manuel Ligne par Ligne :** Offre un contrôle granulaire en validant ou modifiant chaque remplacement sur sa ligne.
* **💾 Sauvegarde Sécurisée :** Les fichiers modifiés sont sauvegardés dans un dossier `result-uhq` séparé, préservant ainsi vos fichiers originaux.
* **🌈 Interface Interactive :** Utilise `inquirer` pour des prompts conviviaux et `chalk` pour un affichage coloré dans le terminal.

## 🚀 Pré-requis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants :

* [**Node.js**](https://nodejs.org/en/download/) (version 14.x ou plus récente recommandée)
* [**npm**](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (normalement inclus avec Node.js)

## 📦 Installation

1.  **Clonez le dépôt :**
    ```bash
    git clone [https://github.com/ton-utilisateur/ton-repo-github.git](https://github.com/ton-utilisateur/ton-repo-github.git)
    cd ton-repo-github
    ```
    (Remplace `ton-utilisateur/ton-repo-github` par le chemin de ton propre dépôt)

2.  **Installez les dépendances :**
    ```bash
    npm install
    ```

## 🎮 Utilisation

1.  **Lancez le script :**
    ```bash
    npm start
    ```
    Ou directement :
    ```bash
    node index.js
    ```

2.  **Suivez les instructions** dans le terminal :
    * Entrez la ou les couleurs que vous souhaitez rechercher (séparées par des virgules).
    * Spécifiez la couleur par laquelle vous souhaitez les remplacer.
    * Indiquez le chemin complet de votre dossier `resources` FiveM à scanner.

    Le script vous guidera ensuite pour chaque fichier détecté, vous permettant de choisir le mode de remplacement.


Bienvenue ! Ce script va t'aider à transformer n'importe quelle couleur en une autre dans tes ressources FiveM.
Les fichiers modifiés seront sauvegardés dans un nouveau dossier "result-uhq" à côté de ton dossier scanné.
N'oublie pas de faire une sauvegarde de tes ressources avant de commencer !
✨ RSK-UHQ - Tous droits réservés ✨

? 🎨 Quelle(s) couleur(s) veux-tu rechercher ? (Ex: "pink", "#FFC0CB", "rgba(255,192,203,1)", "rose,lightpink" - séparées par virgule): pink
? 🌈 Par quelle couleur veux-tu les remplacer ? (Ex: "red", "#FF0000", "rgb(255,0,0)"): blue
? 📁 Entrez le chemin complet du dossier "resources" à scanner (ex: C:/fxserver/resources): C:/path/to/your/resources

  Dossier de sortie créé: C:/path/to/your/result-uhq
  Un fichier .gitignore a été ajouté dans 'C:/path/to/your/result-uhq'.

🚀 Démarrage du scan dans: C:/path/to/your/resources
Les fichiers modifiés iront dans: C:/path/to/your/result-uhq

Recherche de: pink
Remplacement par: blue

*** RSK-UHQ POWERED ***

--- Fichier détecté: your-resource/ui/app.js ---
  L   12: const myColor = 'pink';
  L   34: element.style.color = 'pink';
? Que veux-tu faire avec ce fichier ? (Use arrow keys)
❯ 🔄 Remplacer automatiquement toutes les couleurs cibles par la couleur de remplacement (format conservé)
  🎨 Remplacer manuellement chaque couleur cible unique (tu choisis pour chaque couleur)
  ✏️ Remplacer ligne par ligne (tu valides chaque remplacement sur sa ligne)
  ⏭️ Ignorer ce fichier
    ```
    </details>

3.  **Vérifiez vos fichiers** : Une fois le script terminé, tous les fichiers modifiés se trouveront dans le dossier `result-uhq` créé à côté de votre dossier `resources` d'origine. Il est **FORTEMENT RECOMMANDÉ** de vérifier ces fichiers avant de les déployer sur votre serveur.

## 🎨 Formats de Couleur Supportés

Le script est capable de détecter et de remplacer les formats de couleurs suivants :

* **Noms de couleurs HTML/CSS :** `red`, `blue`, `pink`, `purple`, `lime`, `orange`, `white`, `black`, etc.
* **Codes Hexadécimaux :** `#FF0000` (6 chiffres), `#F00` (3 chiffres).
* **Formats RGBA/RGB (style Lua/FiveM) :** `{255, 0, 0, 255}` (avec ou sans alpha).
* **Formats RGBA/RGB (style CSS) :** `rgb(255, 0, 0)`, `rgba(255, 0, 0, 0.5)`.

## 🤝 Contribution

Les contributions sont les bienvenues ! Si vous avez des idées d'amélioration, des rapports de bugs, ou des fonctionnalités à ajouter, n'hésitez pas à ouvrir une issue ou à soumettre une pull request.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

<div align="center">
  <h3>✨ RSK-UHQ - Tous droits réservés ✨</h3>
  <p>🔥 Le script qu'il te faut ! 🔥</p>
</div>
