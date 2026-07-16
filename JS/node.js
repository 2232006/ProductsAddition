var productName = document.getElementById("name");
var productPrice = document.getElementById("price");
var productCategory = document.getElementById("category");
var productImg = document.getElementById("formFile");
var productDescription = document.getElementById("desc");
var addbtn = document.getElementById("add");
var Updatebtn = document.getElementById("update");
var productList = [];

var Id = 0;
if (localStorage.getItem("ProductLlist")) {
  productList = JSON.parse(localStorage.getItem("ProductLlist"));
  if (productList.length > 0) {
    Id = Math.max(...productList.map((p) => p.Id)) + 1;
  }
  displayProduct(productList);
} else {
  noProducts();
}
function noProducts() {
  document.getElementById("products").innerHTML = `<div
            class="col col-12 d-flex justify-content-center align-items-center mt-5 mb-5"
          >
            <h2>No Products Added</h2>
          </div>`;
}
function noProductsmatch() {
  document.getElementById("products").innerHTML = `<div
            class="col col-12 d-flex justify-content-center align-items-center mt-5 mb-5"
          >
            <h2>No Products match</h2>
          </div>`;
}
function addProductToLocalStorage() {
  localStorage.setItem("ProductLlist", JSON.stringify(productList));
}
function addProduct() {
  if (
    validFormInput(productName) &&
    validFormInput(productPrice) &&
    validFormInput(productCategory) &&
    validFormInput(productDescription) &&
    validImage(productImg, true)
  ) {
    removeIsValid();
    var product = {
      Id: Id++,
      name: productName.value,
      price: productPrice.value,
      category: productCategory.value,
      image: `./images/${productImg.files[0].name}`,
      description: productDescription.value,
    };
    productList.push(product);
    addProductToLocalStorage();
    clearInputs();
  }

  displayProduct(productList);
}
function displayProduct(list) {
  var Blackbox = "";
  for (i = 0; i < list.length; i++) {
    Blackbox += `<div class="col-12 col-md-6 col-lg-3"> 
            <div class="product border rounded-2" >
              <div class="product-img">
                <img src="${list[i].image}" alt="" class="w-100" />
              </div>
              <div class="txt p-2 d-flex flex-column row-gap-3">
                <div class="cat-price">
                  <div class="category d-flex justify-content-between">
                    <span class="badge text-bg-primary fw-bold">${list[i].category}</span>
                    <span class="price text-danger">${list[i].price}$</span>
                  </div>
                </div>
                <div class="name-dec d-flex flex-column">
                  <span class="h3">${list[i].highlitedName ? list[i].highlitedName : list[i].name}</span>
                  <span class="desc">${list[i].description}</span>
                </div>
                <div class="icons d-flex justify-content-between">
                  <button class="edit btn bg-warning" data-id="${list[i].Id}"  onclick="editProduct(this.dataset.id)">
                    <i class="fa-solid fa-pen" style="color: rgb(0, 0, 0)"></i>
                  </button>
                  <button class="delete btn bg-danger" data-id="${list[i].Id}"  onclick="deleteProduct(this.dataset.id)">
                    <i
                      class="fa-solid fa-trash"
                      style="color: rgb(0, 0, 0)"
                    ></i>
                  </button>
                </div>
              </div>
            </div>
          </div>`;
  }

  document.getElementById("products").innerHTML = Blackbox;
  if (Blackbox === "") {
    noProducts();
  }
}

function deleteProduct(id) {
  id = Number(id);
  var index = productList.findIndex((product) => product.Id === id);
  productList.splice(index, 1);
  displayProduct(productList);
  addProductToLocalStorage();
}

function clearInputs(product) {
  productName.value = product ? product.name : "";
  productCategory.value = product ? product.category : "";
  productDescription.value = product ? product.description : "";
  productImg.value = "";
  productPrice.value = product ? product.price : "";
}
function editProduct(id) {
  document.getElementById("update").dataset.id = id;
  id = Number(id);
  var index = productList.findIndex((product) => product.Id === id);

  clearInputs(productList[index]);
  addbtn.classList.add("d-none");
  Updatebtn.classList.remove("d-none");
}
function removeIsValid() {
  productName.classList.remove("is-valid");
  productCategory.classList.remove("is-valid");
  productPrice.classList.remove("is-valid");
  productDescription.classList.remove("is-valid");
}
function updateProduct() {
  var id = Number(document.getElementById("update").dataset.id);
  var index = productList.findIndex((product) => product.Id === id);
  if (
    validFormInput(productName) &&
    validFormInput(productCategory) &&
    validFormInput(productPrice) &&
    validFormInput(productDescription) &&
    validImage(productImg, false)
  ) {
    removeIsValid();
    productList[index].name = productName.value;
    productList[index].category = productCategory.value;
    productList[index].price = productPrice.value;
    if (productImg.files.length > 0) {
      productList[index].image = `./images/${productImg.files[0].name}`;
    }
    productList[index].description = productDescription.value;
    addProductToLocalStorage();
    Updatebtn.classList.add("d-none");
    addbtn.classList.remove("d-none");
    clearInputs();
  }

  displayProduct(productList);
}
var matched;
function searchByProductName(keyword) {
  matched = [];
  for (i = 0; i < productList.length; i++) {
    if (
      productList[i].name.toLowerCase().includes(keyword.value.toLowerCase())
    ) {
      matched.push(productList[i]);
      productList[i].highlitedName = productList[i].name
        .toLowerCase()
        .replaceAll(
          keyword.value,
          `<span class="text-warning">${keyword.value}</span>`,
        );
    }
  }
  if (matched.length > 0) {
    displayProduct(matched);
  } else {
    noProductsmatch();
  }
}

function validFormInput(element) {
  console.log(element.id);
  var regex = {
    name: /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z0-9]+$/,
    price: /^([6-9][0-9]{3}|[1-5][0-9]{4}|60000)$/,
    category: /^(shirts|bags|shose|jeans)$/,
    desc: /^[A-Za-z0-9 ]{4,250}$/,
  };
  var isValid = regex[element.id].test(element.value);
  if (isValid) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    element.nextElementSibling.classList.add("d-none");
  } else {
    element.classList.remove("is-valid");
    element.classList.add("is-invalid");
    element.nextElementSibling.classList.remove("d-none");
  }
  return isValid;
}
function validImage(element, required) {
  if (element.files.length === 0) {
    if (required) {
      document.getElementById("chooseImg").classList.remove("d-none");
      document.getElementById("size").classList.add("d-none");
      document.getElementById("type").classList.add("d-none");
      return false;
    }
    return true;
  }
  var regex = /^image\/(jpeg|jbg|png|webp)$/;

  if (!regex.test(element.files[0].type)) {
    document.getElementById("type").classList.remove("d-none");
    document.getElementById("size").classList.add("d-none");
    document.getElementById("chooseImg").classList.add("d-none");
    return false;
  }
  if (element.files[0].size > 2 * 1024 * 1024) {
    document.getElementById("size").classList.remove("d-none");
    document.getElementById("type").classList.add("d-none");
    document.getElementById("chooseImg").classList.add("d-none");
    return false;
  }
  document.getElementById("size").classList.add("d-none");
  document.getElementById("type").classList.add("d-none");
  document.getElementById("chooseImg").classList.add("d-none");
  return true;
}
function sortByName() {
  if (matched && matched.length > 0) {
    matched.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });
    displayProduct(matched);
  } else {
    var sortedList = productList.slice();
    sortedList.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    displayProduct(sortedList);
  }
}
function sortByPrice() {
  if (matched && matched.length > 0) {
    matched.sort(function (a, b) {
      return a.price - b.price;
    });
    displayProduct(matched);
  } else {
    var sortedList = productList.slice();
    sortedList.sort(function (a, b) {
      return a.price - b.price;
    });

    displayProduct(sortedList);
  }
}
