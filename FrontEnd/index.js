const api = "http://localhost:5678/api/";


const work = async () => {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    return data;
}

//creer la galerie //

//const gallery = document.querySelector(".gallery");//

//fonction avec async qui permet d'utiliser les promesse //
const Categories = async () => {
    //effectue une requete http get avec fetch //
    const response = await fetch("http://localhost:5678/api/categories");
    //donnée recupéré au format json//
    const data = await response.json();
    //retourne les donnée //
    return data;
}

//REQUETE GET  A L URL // 
// stocker les donnée de l'api dans la variable//
let allCategorie = [];
let allGallery = [];
// .then pour gere la promesse extraire les donnee de la reponse et les convertir au format json//
// traiter les donnée renvoyé precedement//

const getWorks = async () => {

    await fetch("http://localhost:5678/api/categories")
        .then((response) => response.json())
        .then((data) => (categorie = data))

    await fetch("http://localhost:5678/api/works")
        .then((response) => response.json())
        .then((data) => (allgallery = data))

        .then(() => {
            createCategory();
            createGallery(allGallery);
        });
}



//fonction qui va permettre de creer les categories//

let createCategory = () => {
    let filter = document.createElement("div");
    filter.classList.add("filter");
    portfolio.appendChild(filter);

    filter.innerHTML = `<div class="button" id="0">Tous</div>` + allCategorie
        .map((categories) => `<div class="button" id="${categories.name}">${categories.name}</div>`)

        .join("");

    let buttonFilter = document.querySelectorAll(".button");
    for (let i = 0; i < buttonFilter.length; i++) {
        buttonFilter[i].addEventListener("click", () => {
            if (i = 0) {
                allGalleryFilter = allGallery.filter((element) => element.categoryId == i);
                createGallery(allGalleryFilter);
            }
            else {
                createGallery(allGallery);
            }
        })
    }
}

//FONCTION POUR LA GALLERIE//

//selection de l'element gallery//
//creation new div + ajout de la classe gallery a cette div//
let gallery = document.querySelector('.gallery')
gallery = document.createElement("div");
gallery.classList.add("gallery");

const createGallery = (all) => {
    gallery.innerHTML = all
        .map(
            (img) =>
                `<figure>
    <img src=${img.imageUrl} alt=${img.title}>
    <figcaption>${img.title}</figcaption>
  </figure>
  `
        )
        .join("");

    portfolio.appendChild(gallery);
};

getWorks();

