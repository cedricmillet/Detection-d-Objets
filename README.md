# Detection-d-Objets
Classe JS de détection d'objets dans une video à l'aide d'algorithmes de traitements (soustration et seuillage) image par image.

Il s'agit d'une interface prête à l'emploi et ne nécéssitant aucune configuration.

![ScreenShot](https://raw.githubusercontent.com/cedricmillet/Detection-d-Objets/master/screen.png)


## Avertissement
Le code n'est pas propre ni optimisé car écrit rapidement.

## Fonctionnement
* A intervalle régulière, une capture d'écran de la vidéo est effectuée
* L'image générée est ensuite soustraite à l'image de départ de la vidéo
* Une fois l'opération soustraction effectuée, l'image est binarisée
* Une fois l'image binarisée, une recherche des objets est effectuée
* La recherche des objets dépend de plusieurs paramètres (precision recherche, une taille mini, une taille maxi...)



## Installation
* Ouvrez _index.html_ dans **Mozilla Firefox**, les autres navigateurs ne supportent pas certaines opérations sur les **canvas**
