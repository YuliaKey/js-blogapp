import "./form.scss";

const form = document.querySelector('form');
const errorList = document.querySelector("#errors");
let errors = [];

const formIsValid = (data) => { //catch of errors
    if(!data.author || !data.category || !data.content) {
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

            const response = await fetch("https://restapi.fr/api/dwwm_yuliia", { // i wait a return of my promise so i put await before fetch here
                method: "POST", // even when we post something we need to wairt a response that api got our information
                headers: {'Content-Type' : 'application/json'}, // headers - each time you make a request you have a header, here we presise a content type that we gonna send - json)
                body: json
            })
            const body = await response.json(); // I wait that json will send me the body of response => I affishe le body bellow
            form.reset(); //as soon as we got response we reset our form so it becomes empty again
            console.log(body);
        } catch (error) {
            console.log(error);
        }

    }
    
})