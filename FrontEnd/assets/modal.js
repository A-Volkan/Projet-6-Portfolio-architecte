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
    refreshForm();
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
        refreshForm();
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
                refreshForm();
                firstModal()
            } else if (!response.ok) {
                alert('La session a expirée, veuillez vous reconnecter');
                document.location.href = ("login.html");
            }
        })

}

//reset le formu//

function refreshForm() {
    labelFile.style.padding = "20px 0 20px"
    labelFile.innerHTML = `
    <i class="fa-regular fa-image"></i>
    <div class="button-add-picture">+ Ajouter photo</div>
    <span class="format-picture">jpg, png: 4mo max</span>
    `
    input_file.value = "";
    inputTitle.value = "";
    selectCategories.value = "default";
    buttonValidate.disabled = true;
    buttonValidate.style.background = "#A7A7A7";
    buttonValidate.style.cursor = "auto";
}


