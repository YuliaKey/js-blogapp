import './index.scss';

const articlesContainer = document.querySelector('.articles-container');
const categoriesContainer = document.querySelector(".categories");

const displayArticles = (articles) => {
    const articlesDOM = articles.map((article) => {
        const articleNode = document.createElement('div');
        articleNode.classList.add("article");
        articleNode.innerHTML = 
        `<img src=${article.image ? article.image: "assets/images/default_profile.png"} alt="">
        <h2>${article.title}</h2>
        <p class="article-author">${article.author} - <span>
            ${new Date(article.createdAt).toLocaleDateString('fr-FR', {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"} )}        
        </span></p>
        <p class="article-content">${article.content}</p>
        <div class="article-actions">
            <button class="btn btn-primary" data-id=${article._id}>Modifier</button>
            <button class="btn btn-danger" data-id=${article._id}>Supprimer</button>
        </div>`;

        return articleNode;
    });

    articlesContainer.innerHTML = '';
    articlesContainer.append(...articlesDOM);

    const deleteBtns = articlesContainer.querySelectorAll(".btn-danger"); //recupere tous les boutons
    const editBtns = articlesContainer.querySelectorAll(".btn-primary");

    deleteBtns.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            try {
                const target = event.target;
                const articleId = target.dataset.id;

                const response = await fetch(`https://restapi.fr/api/dwwm_yuliia2/${articleId}`, {method: 'DELETE'}) //im sending request to api to delete an article which was targeted to be deleted (when you click on button delete on the website)
                const body = await response.json();
                fetchArticles();
                console.log(body);
            } catch (error) {
                console.log(error)
            }
        } )
    });

    editBtns.forEach(button => {
        button.addEventListener('click', async (event) => {
            event.preventDefault();
            const target = event.target;

            const articleId = target.dataset.id;
            location.assign(`./form.html?id=${articleId}`);
        } )
    });

}

const displayMenuCategories = (categoriesArray) => {
    const liElements = categoriesArray.map((categoryElement) => {
      const li = document.createElement("li");
      li.innerHTML = `${categoryElement[0]} ( <strong>${categoryElement[1]}</strong> )`;
      return li;
    });
  
    categoriesContainer.innerHTML = "";
    categoriesContainer.append(...liElements);
};

const createMenuCategories = (articles) => {
    const categories = articles.reduce( (acc, article) => {
        if (acc[article.category]) {
            acc[article.category]++
        } else {
            acc[article.category] = 1;
        }

        return acc;
    }, {});

    const categoriesArray = Object.keys(categories).map(category => [category, categories[category]]); // arrays dans array

    displayMenuCategories(categoriesArray);
};



const fetchArticles = async () => {
    // fonction asynchrone qui recupere les donnees depuis l'API
    try {
      const response = await fetch("https://restapi.fr/api/dwwm_yuliia2");
      let articles = await response.json(); // <=== on change 'const' en 'let'
  
      if (!(articles instanceof Array)) {
        // si 'articles' n'est pas un tableau
        articles = [articles]; // on le transforme en tableau
      }
  
      if (articles.length) {
        displayArticles(articles);
        createMenuCategories(articles);
      } else {
        articlesContainer.innerHTML = "<p>Pas d'articles pour le moment</p>";
      }
    } catch (error) {
      console.log(error);
    }
  };

fetchArticles();