/* ================================> Variables Declaration and Selection <================================ */
let rowData = document.getElementById("rowData");
//Declares a variable <rowData> and assigns it the DOM element.
let searchContainer = document.getElementById("searchContainer");
//Declares a variable <searchContainer> and assigns it the DOM element.
let submitBtn;
//Declares a variable <submitBtn>.
/* ================================> *********************************** <================================ */

$(document).ready(() => {
//Execute a callback function once the DOM is fully loaded using jQuery. It ensures that all DOM elements are available and can be manipulated.
    searchByName("").then(() => {
    //Calls a function named <searchByName> with an empty string as an argument and it is responsible for fetching data based on the search query.
        $(".loading-screen").fadeOut(500)
        $("body").css("overflow", "visible")

    })
})
//Calls a searchByName function with an empty string, and then hides a loading screen and enables scrolling once the data is fetched. 

/* ================================> Side Nav Menu <================================ */
//Toggle functionality for a side navigation menu, where clicking the icon triggers either the opening or closing animation based on the current state of the menu.
function openSideNav() {
//Declares a function named <openSideNav> which controls the opening animation of the side navigation menu.
    $(".side-nav-menu").animate({ left: 0 }, 500);
    //Animates the left property of the element with class <side-nav-menu>,effectively moving the menu to the left edge of the screen, making it visible.
    $(".open-close-icon").removeClass("fa-align-justify");
    $(".open-close-icon").addClass("fa-x");

    for (let i = 0; i < 5; i++) {
        $(".links li").eq(i).animate({ top: 0 }, (i + 5) * 100)
        //Animates the menu items to move upwards, potentially hiding them when closing the menu.
    }
}

function closeSideNav() {
//Declares a function named <closeSideNav> which controls the closing animation of the side navigation menu.
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth()
    //Declares a variable <boxWidth> and stores the outer width of the first element with class <nav-tab> inside the element with class side-nav-menu. It retrieves the width of the menu itself.
    $(".side-nav-menu").animate({ left: -boxWidth }, 500);
    //Animates the left property of the element with class <side-nav-menu>. It sets the left position to <-boxWidth>, effectively moving the menu off-screen to the left by its own width, hiding it.
    $(".open-close-icon").addClass("fa-align-justify");
    $(".open-close-icon").removeClass("fa-x");

    $(".links li").animate({ top: 300 }, 500)
}

closeSideNav()

$(".side-nav-menu i.open-close-icon").click(() => {
    //Sets up an event listener using jQuery.
        if ($(".side-nav-menu").css("left") == "0px") {
        //Checks the current CSS value of the <left> property for the element with class <side-nav-menu>. If it's equal to "0px", the menu is open.
            closeSideNav()
        } else {
            openSideNav()
        }
    })
/* ================================> ************* <================================ */

/* ================================> Home Section <================================ */
function displayMeals(arr) {
    let items = "";
    //Initializes an empty string c<items> to store the generated HTML.

    for (let i = 0; i < arr.length; i++) {
    //Iterates through each meal object in the arr array.
        items += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex justify-content-center align-items-center text-dark p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
        //Appends HTML to the <items> string for each meal.
        //<onclick="getMealDetails('${arr[i].idMeal}')">: Adds an <onclick> event listener to trigger the <getMealDetails> function with the current meal's ID.
        //<meal-layer>: Creates a layer over the image for the meal's title.
        //<${arr[i].strMeal}>: Displays the meal's name within the layer.
    }

    rowData.innerHTML = items
    //Assigns the generated HTML <items> to the <innerHTML> property of the <rowData> element, to update the DOM for displaying the meals on the page.
}

async function getMealDetails(mealID) {
//Defines an asynchronous function named <getMealDetails> that takes a parameter <mealID>.
    closeSideNav()
    rowData.innerHTML = ""
    //Sets the inner HTML content of an element with the ID <rowData> to an empty string which clears any previous content displayed there.
    $(".loading-screen").fadeIn(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.

    //searchContainer.innerHTML = "";
    //Clears any existing content from the <searchContainer> element, likely to avoid overlapping content during category display.
    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    //Fetches data from the provided URL using the fetch API and assigns the response to a variable named <respone>. It ensures the function pauses until the fetch completes.
    respone = await respone.json()
    //Converts the response from the fetch (JSON format) into a JavaScript object and assigns it back to the respone variable.

    displayMealDetails(respone.meals[0])
    //Calls the function <displayMealDetails> and passes the first element from the meals array within the response object. 
    $(".loading-screen").fadeOut(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.
}

function displayMealDetails(meal) {
//Dfines a function named <displayMealDetails> that takes a parameter meal which is an object containing the meal details.
    //searchContainer.innerHTML = "";
    //Clears any existing content from the <searchContainer> element, likely to avoid overlapping content during category display.

    let ingredients = ``
    //Declares a variable named <ingredients> as an empty string, which is used to build the ingredient list HTML.

    for (let i = 1; i <= 20; i++) {
    //Iterates 20 times, assuming there can be up to 20 ingredients.
        if (meal[`strIngredient${i}`]) {
        //Checks if a property named <strIngredient> with a dynamic number appended exists on the meal object.
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
            //If the property exists, it appends HTML content to the ingredients string, creating a list item for each ingredient with its measure and name.
        }
    }

    let tags = meal.strTags?.split(",")
    //let tags = meal.strTags.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }



    let items = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    rowData.innerHTML = items
    //Sets the inner HTML content of the <rowData> element to the items string, effectively displaying the formatted meal details.
}
/* ================================> ************ <================================ */

/* ================================> Search Section <================================ */
function showSearchInputs() {
    searchContainer.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search by Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search by First Letter">
        </div>
    </div>`

    rowData.innerHTML = ""
}

async function searchByName(term) {
//Defines an asynchronous function named <searchByName> that takes a single argument called <term>.
    closeSideNav()
    rowData.innerHTML = ""
    //Sets the inner HTML content of an element with the ID <rowData> to an empty string.
    $(".loading-screen").fadeIn(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    //Fetches data from the provided URL using the fetch API and assigns the response to a variable named <respone>. It ensures the function pauses until the fetch completes.
    response = await response.json()
    //Converts the response from the fetch (JSON format) into a JavaScript object and assigns it back to the respone variable.

    response.meals ? displayMeals(response.meals) : displayMeals([])
    //Uses a ternary operator to check if the <response.meals> property exists. If meals exist, it calls a function named <displayMeals> with the <response.meals> data.
    $(".loading-screen").fadeOut(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.

}

async function searchByFLetter(term) {
    closeSideNav()
    rowData.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.

    term == "" ? term = "a" : "";
    //Ensures that the <term> variable always has a value before making an API call. If term is initially empty, it sets it to "a" to initiate the API search with at least one character.
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
    //Fetches data from the provided URL using the fetch API and assigns the response to a variable named <respone>. It ensures the function pauses until the fetch completes.
    response = await response.json()
    //Converts the response from the fetch (JSON format) into a JavaScript object and assigns it back to the respone variable.

    response.meals ? displayMeals(response.meals) : displayMeals([])
    //Uses a ternary operator to check if the <response.meals> property exists. If meals exist, it calls a function named <displayMeals> with the <response.meals> data.
    $(".loading-screen").fadeOut(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.
}
/* ================================> ************** <================================ */

/* ================================> Categories Section <================================ */
async function getCategories() {
    rowData.innerHTML = ""
    //Clears any existing content from the <rowData> element, to prepare for displaying categories.
    $(".loading-screen").fadeIn(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.
    //searchContainer.innerHTML = "";
    //Clears any existing content from the <searchContainer> element, likely to avoid overlapping content during category display.

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    //Fetches data from the provided URL using the fetch API and assigns the response to a variable named <respone>. It ensures the function pauses until the fetch completes.
    response = await response.json()
    //Converts the fetched response from a JSON format to a JavaScript object and stores it back in the response variable.

    displayCategories(response.categories)
    //Calls the <displayCategories> function, passing the <categories> array extracted from the API response, where this array contains information about each category.
    $(".loading-screen").fadeOut(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.
}

function displayCategories(arr) {
    let items = "";
    //Initializes an empty string <items> to store the generated HTML content for the categories.

    for (let i = 0; i < arr.length; i++) {
    //Iterates through each category object in the <arr> array received from the <getCategories> function.
        items += `
        <div class="col-md-3">
                <div onclick="getCategoryMeals('${arr[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strCategoryThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute text-center text-dark p-2">
                        <h3>${arr[i].strCategory}</h3>
                        <p>${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                    </div>
                </div>
        </div>
        `
        //Appends HTML to the <items> string for each category.
        //<onclick="getCategoryMeals('${arr[i].strCategory}')">: Adds an onclick event listener to trigger the <getCategoryMeals> function with the current category's name for filtering meals.
    }

    rowData.innerHTML = items
    //Assigns the generated HTML <items> to the <innerHTML> property of the <rowData> element, to update the DOM for displaying the categories on the page.
}

async function getCategoryMeals(category) {
//Defines an async function named <getCategoryMeals> that takes a parameter 'category'.
    rowData.innerHTML = ""
    //Sets the inner HTML content of an element with the ID <rowData> to an empty string which clears any previous content displayed there.
    $(".loading-screen").fadeIn(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    //Fetches data from the provided URL using the fetch API and assigns the response to a variable named <respone>. It ensures the function pauses until the fetch completes.
    response = await response.json()
    //Converts the response from the fetch (JSON format) into a JavaScript object and assigns it back to the respone variable.

    displayMeals(response.meals.slice(0, 20))
    $(".loading-screen").fadeOut(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.
}
/* ================================> ****************** <================================ */

/* ================================> Area Section <================================ */
async function getArea() {
    rowData.innerHTML = ""
    //Clears any existing content from the <rowData> element, to prepare for displaying areas.
    $(".loading-screen").fadeIn(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.
    //searchContainer.innerHTML = "";
    //Clears any existing content from the <searchContainer> element, likely to avoid overlapping content during category display.

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    //Fetches data from the provided URL using the fetch API and assigns the response to a variable named <respone>. It ensures the function pauses until the fetch completes.
    respone = await respone.json()
    //Converts the response from the fetch (JSON format) into a JavaScript object and assigns it back to the respone variable.
    console.log(respone.meals);

    displayArea(respone.meals)
    $(".loading-screen").fadeOut(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.
}

function displayArea(arr) {
    let items = "";

    for (let i = 0; i < arr.length; i++) {
        items += `
        <div class="col-md-3">
                <div onclick="getAreaMeals('${arr[i].strArea}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${arr[i].strArea}</h3>
                </div>
        </div>
        `
    }

    rowData.innerHTML = items
    //Assigns the generated HTML <items> to the <innerHTML> property of the <rowData> element, to update the DOM for displaying the area on the page.
}

async function getAreaMeals(area) {
    rowData.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    //Fetches data from the provided URL using the fetch API and assigns the response to a variable named <respone>. It ensures the function pauses until the fetch completes.
    response = await response.json()
    //Converts the response from the fetch (JSON format) into a JavaScript object and assigns it back to the respone variable.

    displayMeals(response.meals.slice(0, 20))
    $(".loading-screen").fadeOut(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.
}
/* ================================> ************ <================================ */

/* ================================> Ingredients Section <================================ */
async function getIngredients() {
    rowData.innerHTML = ""
    //Clears any existing content from the <rowData> element, to prepare for displaying ingredients.
    $(".loading-screen").fadeIn(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.
    //searchContainer.innerHTML = "";
    //Clears any existing content from the <searchContainer> element, likely to avoid overlapping content during category display.

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    //Fetches data from the provided URL using the fetch API and assigns the response to a variable named <respone>. It ensures the function pauses until the fetch completes.
    respone = await respone.json()
    //Converts the response from the fetch (JSON format) into a JavaScript object and assigns it back to the respone variable.
    console.log(respone.meals);

    displayIngredients(respone.meals.slice(0, 20))
    $(".loading-screen").fadeOut(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.
}

function displayIngredients(arr) {
//Declares a function named <displayIngredients> that takes an array arr as an argument, and it responsible for displaying a list of ingredients and their descriptions.
    let items = "";
    //Declares a variable <items> and initializes it as an empty string. This variable is used to build the HTML string that will be displayed on the page.

    for (let i = 0; i < arr.length; i++) {
        items += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
        </div>
        `
    }

    rowData.innerHTML = items
    //Assigns the generated HTML <items> to the <innerHTML> property of the <rowData> element, to update the DOM for displaying the ingredients on the page.
}

async function getIngredientsMeals(ingredients) {
    rowData.innerHTML = ""
    $(".loading-screen").fadeIn(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
    //Fetches data from the provided URL using the fetch API and assigns the response to a variable named <respone>. It ensures the function pauses until the fetch completes.
    response = await response.json()
    //Converts the response from the fetch (JSON format) into a JavaScript object and assigns it back to the respone variable.


    displayMeals(response.meals.slice(0, 20))
    $(".loading-screen").fadeOut(300)
    //Uses jQuery to show a loading screen element with a fade-in animation.

}
/* ================================> ******************* <================================ */

/* ================================> Contact Us Section <================================ */
function showContacts() {
    rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
    submitBtn = document.getElementById("submitBtn")

    // >>>>> Event Listeners <<<<< //
    //The <addEventListener> method attaches a function to the <focus> event, which is triggered when the user clicks on it.
    //Each event listener sets its corresponding boolean flag to <true> when the respective input field is focused.
    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouched = true
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true
    })
}


// >>>>> Boolean Flags <<<<< //
//Declares a boolean flag to track whether the input field has been focused on.
let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;


// >>>>> Input Validation Functions <<<<< //
//Checks if the input field has been touched, then calls a function to validate the input.
//If validation passes, the "Alert" error message is hidden. If validation fails, the "Alert" error message is shown.
function inputsValidation() {
    if (nameInputTouched) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")

        }
    }

    if (emailInputTouched) {

        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")

        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")

        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

        }
    }

    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

        }
    }

    if (nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passwordValidation() && repasswordValidation()) {
    //Checks if all the validation functions return true using logical AND (&&) to ensure that all conditions are met.
        submitBtn.removeAttribute("disabled")
        //If all validations pass, the disabled attribute is removed from the <submitBtn> element, enabling the button.
    } else {
        submitBtn.setAttribute("disabled", true)
        //If any validation fails, the disabled attribute is added to the <submitBtn> element, disabling the button.
    }
}

// >>>>> Validation Function <<<<< //
function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}
/* ================================> ****************** <================================ */