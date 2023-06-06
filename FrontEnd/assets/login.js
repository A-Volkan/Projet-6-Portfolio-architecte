//  mail : sophie.bluel@test.tld
//  mot de passe : S0phie


// selection de l'element form //
const loginForm = document.querySelector("form");

//declencher la requete POST//
loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // empeche le comportement par defaut du formulaire , le rechargement de la page//
    loginUser(); // fonction  qui gere le submit du form et la requete//
});


//fonction asynchrone qui envoie la requete POST au serveur et gere la soumission du formulaire //

const loginUser = async () => {
    //recup de la valeur des elem avec l'id email et password//
    const emailLogin = document.getElementById("email").value;
    const passwordLogin = document.getElementById("password").value;

    //creation d'un objet qui contient les valeurs saisies par l'user//
    const userLog = {
        email: emailLogin,
        password: passwordLogin,
    }
    //condition si l'un des deux champ est vide une erreur est lancé//
    if (emailLogin == "" || passwordLogin == "") {
        showToast("Vérifiez que les champs E - mail et Mot de passe soient bien remplis.")
        throw new Error("Vérifiez que les champs E - mail et Mot de passe soient bien remplis.");

    }
    //methode fetch, envoie une requete POST a lurl pour se co avec les donnee de l'user//

    //let response = //
    await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userLog), // converti userlog en format json et l'ajoute au body de la requete//

    })  //fonction de rappel //
        .then((response) => {
            //condi qui verifie si la reponse de la requete http est un succés//
            if (response.ok) {
                response.json()
                    .then((data) => {
                        const userdata = data.token; //extrait le token d'authent et les stock dans la var userdata//
                        //condition qui verif si la valeur userdata est attribué a localstorage , et renvoie vers la page d'acceuil//
                        if (localStorage.user = userdata) {
                            document.location.href = "/FrontEnd/index.html";
                        }
                    })
                //condi alternative si la reponse n'est pas un succès// 
            } else if (!response.ok) {
                //affiche une notification d'erreur//
                showToast("l'identifiant ou le mot de passe est incorrect");
                //lance une nouvelle ligne d'erreur dans la console//
                throw new Error("l’identifiant ou le mot de passe est incorrect");

            }

            //retourne la reponse de la requete en JSON//
            return response.json();
        });
};

//ajout d'une notification en cas d'erreur//
//fonction showtoast avec un message en parametre//
const showToast = (message) => {
    const toast = document.getElementById("alert_toast");
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000)
}