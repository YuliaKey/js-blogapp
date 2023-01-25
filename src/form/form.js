import "./form.scss";

const form = document.querySelector('form');
const errorList = document.querySelector("#errors");
const cancelBtn = document.querySelector(".btn-secondary");
let articleId;

const initForm = async () => {
    const params = new URL(location.href);// une query String
    articleId = params.searchParams.get("id"); //on recupere ID depuis la query String
    const submitBtn = document.querySelector('.btn-primary');

    if (articleId) {
        const response = await fetch(`https://restapi.fr/api/dwwm_yuliia2/${articleId}`);

        if (response.status < 299) {
            const article = await response.json();
            // on va remplir notre formulaire avec une fonction below:
            submitBtn.innerText = "Sauvegarder";
            fillForm(article);
        }
    }
};

const fillForm = (article) => {
    const author = document.querySelector('input[name="author"]');
    const image = document.querySelector('input[name="image"]');
    const category = document.querySelector('select[name="category"]');
    const title = document.querySelector('input[name="title"]');
    const content = document.querySelector('textarea');

    author.value = article.author;
    image.value = article.image;
    category.value = article.category;
    title.value = article.title;
    content.value = article.content;
};

initForm();

cancelBtn.addEventListener('click', () => {
    location.assign("./index.html")
})

const formIsValid = (data) => { //catch of errors
    let errors = [];

    if(!data.author || !data.category || !data.content || !data.title) {
        errors.push("Vous devez renseigner tous les champs")
    }

    if(errors.length) { // si qq - renvoi TRUE
        let errorHtml = '';
        errors.forEach(error => {
            errorHtml += `<li>${error}<li>`; // += pour rajouter des li, faire plusieur si plusieurs erreurs
        });
        errorList.innerHTML = errorHtml;
        return false; // mon formulaire n'est pas valide, il y a des erreurs
    } else {
        errorList.innerHTML = '';
        return true; // mon formulaire est vide, tout est ramplie
    }
}

form.addEventListener('submit', async event => {
    event.preventDefault();

    const formData = new FormData(form);
    const entries = formData.entries();

    const data = Object.fromEntries(entries); // to get one object and not lists, we convert it using Object

    if (formIsValid(data)) { //on utilise async/await function to work with api
        try {
            const json = JSON.stringify(data); // get un JSON to send it to api to stock it
            let response;
            
            if (articleId) {
                //j'enregistre la modification de mon article
                response = await fetch(`https://restapi.fr/api/dwwm_yuliia2/${articleId}`, { // i wait a return of my promise so i put await before fetch here
                method: "PATCH", // even when we post something we need to wairt a response that api got our information
                headers: {'Content-Type' : 'application/json'}, // headers - each time you make a request you have a header, here we presise a content type that we gonna send - json)
                body: json
            });
            } else {
                //je creer un nouveau article
                response = await fetch("https://restapi.fr/api/dwwm_yuliia2", { // i wait a return of my promise so i put await before fetch here
                method: "POST", // even when we post something we need to wairt a response that api got our information
                headers: {'Content-Type' : 'application/json'}, // headers - each time you make a request you have a header, here we presise a content type that we gonna send - json)
                body: json
            });
            }

            
            if (response.status < 299){ //less than 300 means that everything is good, no error (we want here to redirect here to the index html page after posting an article)
                location.assign('./index.html')
            };
            
        } catch (error) {
            console.log(error);
        }

    }
    
})