const submitButton = document.querySelector("#submit-button"),
resetButton = document.querySelector(`button[type="reset"]`),
alertBlock = document.querySelector("#notification-block"),
message = alertBlock.querySelector("h4"),
list = document.querySelector("ul"),
input = document.querySelector("input");

const productAppend = "Product append",
productDeleted = "Product deleted",
nameChanged = "Name of product changed",
emptyList = "Empty list",
enterProduct = "Enter product";

let buyList = [];

function AddClassToAlertBlock(colorBlock, text, mustAdd) {
    if (mustAdd) {
        alertBlock.classList.add(colorBlock);
        message.textContent = text;
    }
    else {
        alertBlock.classList.remove(colorBlock);
        message.textContent = "";
    }
} 

function Message(colorBlock, text) {
    AddClassToAlertBlock(colorBlock, text, true);

    const removeAdd = setTimeout(() => {
        AddClassToAlertBlock(colorBlock, "", false);
    }, 1000);
}

function ToggleClassOfResetButton() {
    if (list.innerHTML == "") {
        resetButton.classList.remove("showed");
    }
    else {
        resetButton.classList.add("showed");
    }
}

function ResetList() {
    buyList = [];
    localStorage.clear();
    list.innerHTML = "";
    Message("red", emptyList);
}

function ConvertedIntoHTMLProducts() {
    const convertedList = buyList.map((product) => {
        return `<li class="products">
        <h5>${product}</h5>
        <div class="button-list">
          <button class="delete-buttons">
            <img src="Icons/del-icon.svg" alt="delete"/>
          </button>
          <button class="edit-buttons">
            <img src="Icons/edit-icon.svg" alt="edit"/>
          </button>
        </div>
      </li>`
    });

    return convertedList.join("");
}

function DeclareIconButtons() {
    const deleteButtons = document.querySelectorAll(".delete-buttons"),
    editButtons = document.querySelectorAll(".edit-buttons");

    deleteButtons.forEach((deleteButton, index) => {
        deleteButton.addEventListener("click", function() {
            DeleteProduct(index);
        });
    });

    editButtons.forEach((editButton, index) => {
        editButton.addEventListener("click", function() {
            const productName = buyList[index];
            
            EditProduct(productName, index);
        });
    });
}

let isEditButtonClicked = false,
indexOfProductToEdit = 0,
isInputClicked = false;

function DeleteProduct(index) {
    buyList.splice(index, 1);
    localStorage.setItem("product", JSON.stringify(buyList));
    list.innerHTML = ConvertedIntoHTMLProducts();
    DeclareIconButtons();
    ToggleClassOfResetButton();
}

function SubmitEditName() {
    buyList[indexOfProductToEdit] = input.value; 
    localStorage.setItem("product", JSON.stringify(buyList));
    list.innerHTML = ConvertedIntoHTMLProducts();
    submitButton.textContent = "Submit";
    isEditButtonClicked = false;
}

function EditProduct(productName, index) {
    isEditButtonClicked = true;
    submitButton.textContent = "Edit";
    input.value = productName;
    indexOfProductToEdit = index;
}

function AddProduct() {
    buyList.unshift(input.value);
    localStorage.setItem("product", JSON.stringify(buyList));
    list.innerHTML = ConvertedIntoHTMLProducts();
    DeclareIconButtons();
}




submitButton.addEventListener("click", function() {
    if (isEditButtonClicked && input.value) {
        SubmitEditName();
        Message("green", nameChanged);
        DeclareIconButtons();
    }
    else {
        if (!input.value) {
            Message("red", enterProduct);
        }
        else {
            AddProduct();
            Message("green", productAppend);
        }
        ToggleClassOfResetButton();
    }
    input.value = "";
});

resetButton.addEventListener("click", function() {
    ResetList();
    submitButton.textContent = "Submit";
    isEditButtonClicked = false;
    Message("red", emptyList);
    ToggleClassOfResetButton();
});

window.addEventListener("load", function() {
    if (localStorage.getItem("product")) {
        buyList = JSON.parse(localStorage.getItem("product"));
        list.innerHTML = ConvertedIntoHTMLProducts();
        DeclareIconButtons();
        ToggleClassOfResetButton();
    }
});

window.addEventListener("click", function(event) {
    if (event.target.matches("input")) {
        isInputClicked = true;
    }
    else {
        isInputClicked = false;
    }
});

window.addEventListener("keydown", function(event) {
    if (event.key == "Meta") {
        isInputClicked = false;
    }

    if ((event.key == "s" && !isInputClicked) 
        || 
        (event.key == "e" && isEditButtonClicked && !isInputClicked)) {
        submitButton.click();
    }
    else if (event.key == "r" && resetButton.classList.contains("showed") && !isInputClicked) {
        resetButton.click();
    }
});