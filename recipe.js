/*
 * CSE 154 
 * Section 4 | Exercise 2 (Solution)
 * 10.23.18
 *
 * This page provides functionality to interact with the CSE 154 Recipe web service and 
 * display recipes to a page.
 */
(function() {
  "use strict";
  const RECIPES_URL = "https://courses.cs.washington.edu/courses/cse154/webservices/recipe/recipe.php";
  
  window.addEventListener("load", initialize);
  
  /** 
   * When the window loads, get all of the recipe buttons and set them up
   * to show their recipes when clicked.
   */
  function initialize() {
    let recipes = document.querySelectorAll("input");
    for (let i = 0; i < recipes.length; i++) {
      recipes[i].onclick = showRecipe;
    }
    recipes[0].click(); // show first recipe by default
  }

  /**
   * Get the recipe of the button clicked and append it to the page.
   */
  function showRecipe() {
    // Clear current recipe
    $("recipe-area").innerHTML = "";
    let url = RECIPES_URL + "?recipe=" + this.value;
    // Get the recipe
    fetch(url, {mode: 'cors'}) 
      .then(checkStatus)
      .then(JSON.parse)
      .then(appendToPage)
      .catch(console.log)
  }

  /* 
   * Appends the given recipe data to the page. 
   * @param {object} - json object representing various recipe information to
   *                   add to page.
   */
  function appendToPage(response) {
    let recipeArea = $("recipe-area");
    let img = gen("img");
    let info = response.recipe.information;

    img.src = info.image;
    img.alt = info.name;
    recipeArea.appendChild(img);

    let title = gen("h1");
    title.innerText = img.alt;
    recipeArea.appendChild(title);

    let description = gen("p");
    description.innerText = info.description.text;
    recipeArea.appendChild(description);

    let ingredientListTitle = gen("h2");
    ingredientListTitle.innerText = "Ingredients:";
    recipeArea.appendChild(ingredientListTitle);

    let list = gen("ul");
    let ingredients = response.recipe.ingredients.item;

    for (let i = 0; i < ingredients.length; i++) {
      let li = gen("li");
      li.innerText = ingredients[i].text;
      list.appendChild(li);
    }
    recipeArea.appendChild(list);
  }

  /* ==============================  Helper Functions ============================== */
  /*
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @return {object} - valid result text if response was successful, otherwise rejected
   *                    Promise result
   */
  function checkStatus(response) { 
    if (response.status >= 200 && response.status < 300 || response.status == 0) {  
      return response.text();
    } else {  
      return Promise.reject(new Error(response.status + ": " + response.statusText)); 
    } 
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} id - element ID
   * @return {object} DOM object associated with id.
   */
  function $(id) {
    return document.getElementById(id);
  }

  /*
   * Returns a new DOM element with the given tag name (if one exists). If el is not
   * a correct tag name, returns undefined.
   * @param {string} el - tag name
   * @return {object} newly-created DOM object of given tag type
   */
  function gen(el) {
    return document.createElement(el);
  }

})();