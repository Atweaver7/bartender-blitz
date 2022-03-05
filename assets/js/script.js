var pageContentEl = document.getElementById("page-content");
var promptEl = document.getElementById("prompt");
let howToBtn = document.getElementById("how-to-btn");
var submitBtn = document.getElementById("start");
let modal = document.getElementById("modal");
let span = document.getElementsByClassName("close")[0];

//create a go back button for each new page
var restartBtn = document.createElement("button");
restartBtn.type = "click";
restartBtn.className = "restart";
restartBtn.textContent = "Restart";

howToBtn.onclick = function () {
  modal.style.display = "block";
};

span.onclick = function () {
  modal.style.display = "none";
};
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

var gameOn = function (event) {
  var targetEl = event.target;
  //when the start button is clicked
  if (targetEl.matches("#start")) {
    //reset the page and load the next
    resetPage(promptEl);
    displayLiquorBases();
  }
};

var resetPage = function (page) {
  //remove all the main page content and return a new div
  page.remove();
  return (newPromptEL = document.createElement("div"));
};

//popular alcohol bases we are working with
var liquorBases = ["gin", "vodka", "tequila", "whiskey", "rum", "brandy"];

var displayLiquorBases = function () {
  //iterate for every base liquor
  for (i = 0; i < liquorBases.length; i++) {
    //create a card for each base
    var liquorBaseEl = document.createElement("div");
    liquorBaseEl.className = "w3-panel w3-round-xlarge flex";
    liquorBaseEl.textContent =
      liquorBases[i].charAt(0).toUpperCase() + liquorBases[i].slice(1);

    var imageUrl =
      "https://www.thecocktaildb.com/images/ingredients/" +
      liquorBases[i] +
      ".png";
    //create an image element of the base liquor
    var liquorImageEl = document.createElement("img");
    liquorImageEl.setAttribute("src", imageUrl);
    liquorImageEl.setAttribute("alt", liquorBaseEl.textContent);

    //create a select button for each card
    var liquorBaseButtonEl = document.createElement("button");
    liquorBaseButtonEl.type = "click";
    liquorBaseButtonEl.innerHTML = "Select"
    liquorBaseButtonEl.className =
      "liquor-btn w3-hover-red w3-button w3-indigo w3-round-xxlarge w3-xxxlarge";

    //append new elements to page
    liquorBaseEl.appendChild(liquorImageEl);
    liquorBaseEl.appendChild(liquorBaseButtonEl);
    newPromptEL.appendChild(liquorBaseEl);
    pageContentEl.appendChild(newPromptEL);
    pageContentEl.appendChild(restartBtn);
  }
};

var selectLiquorBase = function (event) {
  var targetEl = event.target;
  //if a liquor button is clicked
  if (targetEl.matches(".liquor-btn")) {
    //grab the text of the target button and lower case it
    var selectedLiquor = targetEl.parentElement.textContent;
    selectedLiquor = selectedLiquor.toLowerCase();
    //reset the page and load the next
    resetPage(newPromptEL);
    getLiquorData(selectedLiquor);
  } else if (targetEl.matches(".restart")) {
    location.reload();
  }
};

//empty array to hold drink Ids
var drinkIds = [];

var getLiquorData = function (selectedLiquor) {
  var apiUrl =
    "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" +
    selectedLiquor;
  //fetch the api
  fetch(apiUrl).then(function (response) {
    //request was successful
    if (response.ok) {
      //parse the response
      response.json().then(function (data) {
        for (i = 0; i < data.drinks.length; i++) {
          //push every drink Id associated with this liquor into the array
          drinkIds.push(data.drinks[i].idDrink);
        }
        displayCocktails();
      });
    }
  });
};

var displayCocktails = function () {
  //iterate for each id in the selected liquor's array
  for (i = 0; i < drinkIds.length; i++) {
    var apiUrl =
      "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + drinkIds[i];

    fetch(apiUrl).then(function (response) {
      //request was successful
      if (response.ok) {
        //parse the response
        response.json().then(function (data) {
          var id = drinkIds[i];
          var cocktailEl = document.createElement("div");
          cocktailEl.className = "card w3-card w3-panel w3-round-xlarge flex";
          cocktailEl.setAttribute("id", id);
          cocktailEl.textContent = data.drinks[0].strDrink;
          var cocktailImageEl = document.createElement("img");
          cocktailImageEl.setAttribute("src", data.drinks[0].strDrinkThumb);
          cocktailImageEl.setAttribute("alt", cocktailEl.textContent);
          var cocktailButtonEl = document.createElement("button");
          cocktailButtonEl.className =
            "cocktail-btn liquor-btn w3-hover-red w3-button w3-indigo w3-round-xxlarge w3-xxxlarge";
          cocktailButtonEl.type = "click";

          //append to elements
          cocktailEl.appendChild(cocktailButtonEl);
          cocktailEl.appendChild(cocktailImageEl);
          newPromptEL.appendChild(cocktailEl);
        });
      }
    });
  }
  pageContentEl.appendChild(newPromptEL);
  pageContentEl.appendChild(restartBtn);
};

var selectCocktail = function (event) {
  var targetEl = event.target;
  if (targetEl.matches(".cocktail-btn")) {
    var selectedCocktail = targetEl.parentElement.textContent;
    selectedCocktail = selectedCocktail.toLowerCase();

    resetPage(newPromptEL);
    getCocktailIngredients(selectedCocktail);
  }
};

var getCocktailIngredients = function (selectedCocktail) {
  var apiUrl =
    "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" +
    selectedCocktail;
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      displayIngredients(data.drinks[0]);
    });
  });
};

var displayIngredients = function (ingredientStorage) {
  var ingredientsList = document.createElement("div");
  var ingredients = document.createElement("ul");

  var drinkKeys = Object.keys(ingredientStorage);
  var ingredient = drinkKeys.filter(function (item) {
    return item.includes("strIngredient");
  });
  var measures = drinkKeys.filter(function (item) {
    return item.includes("strMeasure");
  });

  ingredient.forEach(function (item, i) {
    if (!ingredientStorage[item]) return;
    var ingredientItem = document.createElement("li");
    ingredientItem.textContent = `${ingredientStorage[item]} - ${
      ingredientStorage[measures[i]]
    }`;
    ingredients.append(ingredientItem);
  });

  ingredientsList.className = "ingredient-list";

  ingredients.setAttribute("id", ingredientStorage);

  ingredientsList.appendChild(ingredients);
  pageContentEl.appendChild(ingredientsList);
  pageContentEl.appendChild(restartBtn);
};

//listen for events
pageContentEl.addEventListener("click", gameOn);
pageContentEl.addEventListener("click", selectLiquorBase);
pageContentEl.addEventListener("click", selectCocktail);

// // Script to open and close sidebar
// function w3_open() {
//     document.getElementById("mySidebar").style.display = "block";
//     document.getElementById("myOverlay").style.display = "block";
//   }

//   function w3_close() {
//     document.getElementById("mySidebar").style.display = "none";
//     document.getElementById("myOverlay").style.display = "none";
//   }

//   // Modal Image Gallery
//   function onClick(element) {
//     document.getElementById("img01").src = element.src;
//     document.getElementById("modal01").style.display = "block";
//     var captionText = document.getElementById("caption");
//     captionText.innerHTML = element.alt;
//   }
