
//REQUETE GET  A L URL // 
// stocker les donnée de l'api dans les variable//
let allGallery = [];
let allCategorie = [];


//fonction asynchrone getworks//
// .then pour gere la promesse extraire les donnee de la reponse et les convertir au format json//
// traiter les donnée renvoyé precedement//

const getWorks = async () => {

    await fetch("http://localhost:5678/api/works")
        .then((response) => response.json())
        .then((data) => (allGallery = data))


    await fetch("http://localhost:5678/api/categories")
        .then((response) => response.json())
        .then((data) => (allCategorie = data))
        //appelle les fonction avec les donnée recuperer de l'api//
        .then(() => {
            createCategory();
            createGallery(allGallery);
            createGalleryModal(allGallery);
        });

}



//fonction qui va permettre de creer les categories//


const createCategory = () => {
    //creer un nouvel element div avec la class filter et l'ajouter a la fin du noeud en lian la classe filter au parent portfolio//
    const filter = document.createElement("div");
    filter.classList.add("filter");
    portfolio.appendChild(filter);
    //creation fonction pour les bouton //
    const createButton = (category) => {
        const button = document.createElement("div");
        button.classList.add("button");
        button.setAttribute("id", category.name);
        button.textContent = category.name;
        return button;
    };
    //fonction qui filtre les element de la gallerie en fonction du filtre choisi//
    const createGalleryWithFilter = (categoryId) => {
        const allGalleryFilter = allGallery.filter((element) => element.categoryId === categoryId);
        createGallery(allGalleryFilter);
    };
    // fonction qui permet de selectionner le bouton filtre utiliser seulement et d'enlever la class selected au autres//
    const selectButton = (button) => {
        buttonFilter.forEach((button) => button.classList.remove("selected"));
        button.classList.add("selected");
    };
    //array avec fonction createbutton , objet "tous" en argument//
    //boucle for qui parcour chaque categorie du tableau //
    //appel de la fonction createbutton dans une var button avec en argument la categorie pour creer le boutton qui correspond a cette catego//
    const buttonFilter = [createButton({ name: "Tous" })];
    for (let i = 0; i < allCategorie.length; i++) {
        const category = allCategorie[i];
        const button = createButton(category);
        buttonFilter.push(button);//methode push pour ajouter le bouton créé a chaque iteration de la boucle dans le tableau//
    }
    //methode forEach pour chaque element une fonction est executé/
    buttonFilter.forEach((button, i) => {
        button.addEventListener("click", () => {
            //condition si l'indice est different de 0 alors l'utilisateur a cliquer sur un bouton autre que Tous//
            if (i !== 0) {
                const categoryName = button.getAttribute("id");//recup l id du bouton cliquer et le stock dans la var//
                const category = allCategorie.find((category) => category.name === categoryName);//cherche la catego qui correspond a la valeur recup precedement et la stock dans la var//
                //condi verifie si la categorie a ete trouvé que le bouton cliquer correspond bien a une categorie //
                if (category) {
                    const categoryId = category.id;
                    createGalleryWithFilter(categoryId);//filtre les elements de la galerie en fonction de lid de la catego//
                }
                //si l'indice i=0 alors l'user a cliquer sur le bouton tous , tout les elements de la galerie seront donc affichés//
            } else {
                createGallery(allGallery);
            }
            selectButton(button);//remplis le bouton cliqué//
        });
        filter.appendChild(button);//ajoute button au parent filter// 
    });
};



//FONCTION POUR LA GALLERIE//

//creation new div + ajout de la classe gallery a cette div//
let gallery = document.createElement("div");
gallery.classList.add("gallery");

const createGallery = (allGallery) => {
    gallery.innerHTML = allGallery
        //methode map pour parcourir les elem du tableau et les transformer en une balise qui contient img et caption//
        .map(
            (img) =>
                `<figure>
        <img src=${img.imageUrl} alt=${img.title}>
        <figcaption>${img.title}</figcaption>
      </figure>
      `)
        //tout les elements du tableau en une seul chaine de caractere //
        .join("");

    portfolio.appendChild(gallery);

};

getWorks();


// Fonction qui permet de cacher tout les elements d'edition lorsque l'utilisateur n'est pas co //
function hideEdit() {
    const headerEdit = document.querySelector('.header-edit');
    const modifyImg = document.querySelector('.modify-img');
    const modifyArticle = document.querySelector('.modify-article');
    const modifyContent = document.querySelector('.modify-content');
    const liLogout = document.querySelector('.liLogout');
    const login = document.querySelector('.login');

    // Vérifier si l'utilisateur est connecté en vérifiant la présence du token dans le localStorage//
    const userToken = localStorage.getItem('user');

    // Si l'utilisateur est connecté, cacher l'élément de connexion (login)//
    if (userToken) {
        if (login !== null) {
            login.style.display = 'none';
        }
    }

    // Si l'utilisateur n'est pas connecté, cacher les autres éléments//
    else {
        if (headerEdit !== null) {
            headerEdit.style.display = 'none';
        }
        if (modifyImg !== null) {
            modifyImg.style.display = 'none';
        }
        if (modifyArticle !== null) {
            modifyArticle.style.display = 'none';
        }
        if (modifyContent !== null) {
            modifyContent.style.display = 'none';
        }
        if (liLogout !== null) {
            liLogout.style.display = 'none';
        }
    }
}

// Appeler la fonction pour cacher les éléments au chargement de la page//
window.addEventListener('DOMContentLoaded', hideEdit);


//MODALE//

// fonction ouverture de la modale //
//selection des elements//
const modaleWindow = document.querySelector("#modale-window");
const modaleTriggers = document.querySelectorAll(".modale-triger");

//ajout d'un ecouteur devent de clic a chaque element modale-triger//
modaleTriggers.forEach(triger => triger.addEventListener("click", toggleModal))
//fonction pour changer l'etat de la modale//
function toggleModal() {
    modaleWindow.classList.toggle("active")
    createGalleryModal(allGallery);
}

const modalLink = document.querySelector(".modalLink");
if (modalLink !== null)
    modalLink.addEventListener("click", firstModal);



//gallerie dans la modale//
// Création de la galerie dans la modale en utilisant les éléments du tableau "allGallery"//
function createGalleryModal(allGallery) {
    const modalGallery = document.querySelector('.modal-gallery');
    if (modalGallery !== null) {
        modalGallery.innerHTML = allGallery
            .map(
                (img) => `
            <div class="img_modal">
              <img src=${img.imageUrl} alt=${img.title} data-id=${img.id}>
              <div class="icon_delete">
              <i class="fa-regular fa-trash-can"></i>
              </div>
              <figcaption>éditer</figcaption>
            </div>
          `
            )
            .join("");
        //// Ajout d'un écouteur d'event de clic à chaque icone de suppression//
        let iconsDelete = modalGallery.querySelectorAll(".icon_delete");
        for (let iconDelete of iconsDelete) {
            iconDelete.addEventListener('click', deleteProject)
        }
    }
}
//suppression d'un projet//
async function deleteProject(e) {
    const iconDelete = e.target;
    const imgContainer = iconDelete.parentElement.previousElementSibling;
    const id = imgContainer.dataset.id;

    try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Accept": "*/*",
                "Authorization": "Bearer " + localStorage.user,
            },
        });

        if (response.ok) {
            imgContainer.parentElement.remove();
            getWorks();
        } else {
            throw new Error("La session a expirée, veuillez vous reconnecter");
        }
    } catch (error) {
        alert(error.message);
        document.location.href = "login.html";
    }
}


// ajouter des projets//

//initialisation de variables globales des éléments du form//

const modal = document.querySelector('.modale');
const modal_add = document.querySelector('.modale-add');

const arrowModal = document.querySelector(".arrow-modal")
if (arrowModal !== null)
    arrowModal.addEventListener("click", firstModal)

const formUploadImg = document.querySelector(".form-upload-img");
const labelFile = document.querySelector(".form-add-photo");
const input_file = document.createElement("input");
const img_element = document.createElement('img');
img_element.classList.add('img-uploaded')

const btnAdd = document.querySelector('.button-add-gallery');
if (btnAdd !== null)
    btnAdd.addEventListener('click', modalAdd);

const buttonValidate = document.querySelector('.button-validate');


//affiche 1ere modale//

function firstModal() {
    modal.style.display = "block";
    modal_add.style.display = "none";

}

//affiche 2eme modale//

function modalAdd() {
    modal.style.display = "none";
    modal_add.style.display = "block";
    //creation element input de type file//
    input_file.type = "file";
    input_file.id = "file"
    input_file.name = "file";
    input_file.accept = "image/png, image/jpeg";
    input_file.style.display = "none";
    formUploadImg.appendChild(input_file);

    categoriesSelect(allCategorie);
}


// Sélectionner une catégorie pour l'image à envoyer//
function categoriesSelect(categories) {
    const categorySelect = document.getElementById('categories');

    categorySelect.innerHTML = `
   <option value ="default" selected></option>
    `
    //ajoute a la liste deroulante chaque categorie//
    categories.forEach((category) => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}


//recup limage de l'user dans une var file et faire apparaitre un appercu de limg avant la valid//

const inputTitle = document.getElementById("title-picture");
const selectCategories = document.getElementById("categories");

input_file.addEventListener("change", previewFile);

function previewFile(e) {
    const file_extension_regex = /\.(jpe?g|png)$/i;
    if (this.files.length === 0 || !file_extension_regex.test(this.files[0].name)) {
        alert("Format non pris en charge, merci de choisir une autre photo");

        return;
    }

    let file = e.target.files[0];
    let url = URL.createObjectURL(file);
    displayImg(url);

    //function creer l'img et l'incorporer dans le label//

    function displayImg() {
        labelFile.style.padding = "0px";
        img_element.src = url;
        labelFile.innerHTML = "";
        labelFile.appendChild(img_element);
    }
}


//function pour activer ou desactiver le bouton valider une fois les condi remplies //

function buttonValidateForm() {
    if (inputTitle.value !== "" && selectCategories.value !== "default" && input_file.files.length > 0) {
        buttonValidate.style.background = "#1D6154";
        buttonValidate.disabled = false;
        buttonValidate.style.cursor = "pointer";
    } else {
        buttonValidate.disabled = true;
        buttonValidate.style.background = "#A7A7A7";
        buttonValidate.style.cursor = "auto";
    }
};
//ajoute des ecouteur d'event au champs du form//
if (inputTitle !== null) {
    inputTitle.addEventListener('input', buttonValidateForm);
    selectCategories.addEventListener('input', buttonValidateForm);
    input_file.addEventListener('input', buttonValidateForm);
    formUploadImg.addEventListener('submit', addProject);
}

// Submit du formulaire et envoie du projet vers la base de données //

async function addProject(e) {
    e.preventDefault();
    //creer un objet pour envoyer les données du formulaire//
    const formData = new FormData();
    formData.append("image", input_file.files[0]);
    formData.append('title', inputTitle.value);
    formData.append('category', selectCategories.value);

    await fetch('http://localhost:5678/api/works', {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.user,
        },
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                alert('Le projet a bien été ajouté')
                getWorks();

                firstModal()
            } else if (!response.ok) {
                alert('La session a expirée, veuillez vous reconnecter');
                document.location.href = ("login.html");
            }
        })

}



// Fonction de déconnexion//
function logout() {
    // Supprimer le token d'authentification du localStorage//
    localStorage.removeItem('user');

    // Rediriger vers la page d'accueil//
    window.location.href = '/FrontEnd/index.html';
}

// Écouter le clic sur l'élément avec la classe .liLogout//
const logoutButton = document.querySelector('.liLogout');
if (logoutButton !== null) {
    logoutButton.addEventListener('click', logout);
}







