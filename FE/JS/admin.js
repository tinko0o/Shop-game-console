const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));
const http = "http://localhost:8080/api/";
let getDataProduct = {};
//reset /empty value input
function resetModal() {
  formProduct.elements["img"].value = "";
  formProduct.elements["name"].value = "";
  formProduct.elements["type"].value = "";
  formProduct.elements["manufacturer"].value = "";
  formProduct.elements["price"].value = "";
  formProduct.elements["description"].value = "";
  getDataProduct = {};

}

//console.log
function log(value) {
  console.log(`${value}: `,value)
}
//formatCurrency
function formatCurrency(price, symbol = "đ") {
  var DecimalSeparator = Number('1.2').toLocaleString().substr(1, 1);
  var priceWithCommas = price.toLocaleString();
  var arParts = String(priceWithCommas).split(DecimalSeparator);
  var intPart = arParts[0];
  var decPart = arParts.length > 1 ? arParts[1] : '';
  decPart = (decPart + '000').substr(0, 3);
  return intPart + symbol;
}
//Render
function renderProduct(data){
            const productHtml = data.data.map((val, index) => { 
            return `
                        <tr class="product-item">
                            <th>
                                <a data-id=${val._id} href="#" class="img">
                                    <img src="${val.img}" alt="">
                                </a>
                            </th>
                            <th>
                                <div class="name-product">
                                   ${val.name}
                                </div>
                            </th>
                            <th> ${val.type} </th>
                            <th> ${val.manufacturer} </th>
                            <th> ${formatCurrency(val.price)} </th>
                            <th>
                              ${val.description}
                            </th>
                            <th>
                                <div class="d-flex">
                                    <button data-id=${val._id} class="btn btn-danger edit-product">
                                        <i class="fa-solid fa-pencil"></i>
                                    </button>
                                    <button data-id=${val._id} class="btn btn-primary delete">
                                        <i class="fa-solid fa-xmark"></i>
                                    </button>
                                </div>
                            </th>
                        </tr>
            `;
            });
            $("#tbody-product").innerHTML = productHtml.join("");
}
//get allProduct
async function product(page = 1, search, limit = 100) {
        const checkSearch = search ? search : "";
        await fetch(`${http}products?page=${page}&limit=${limit}`, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            search: checkSearch,
          },
        })
          .then((data) => data.json())
          .then((data) => {
            renderProduct(data);
            // this.page(page, limit, data.length);
          })
          .catch((err) => {
            console.log(err);
          })
        //   .finally(() => {
        //     spinner(false);
        //   });
    }


document.addEventListener("DOMContentLoaded", function (event) {
  product();
  //sile bar
  const showNavbar = (toggleId, navId, bodyId, headerId) => {
    const toggle = document.getElementById(toggleId),
      nav = document.getElementById(navId),
      bodypd = document.getElementById(bodyId),
      headerpd = document.getElementById(headerId);
    // Validate that all variables exist
    if (toggle && nav && bodypd && headerpd) {
      toggle.addEventListener("click", () => {
        console.log("hehe");
        // show navbar
        nav.classList.toggle("show");
        // change icon
        toggle.classList.toggle("fa-xmark");
        // add padding to body
        bodypd.classList.toggle("body-pd");
        // add padding to header
        headerpd.classList.toggle("body-pd");
      });
    }
  };

  showNavbar("header-toggle", "nav-bar", "body-pd", "header");

  /*===== LINK ACTIVE =====*/
  const linkColor = document.querySelectorAll(".nav_link");

  function colorLink() {
    if (linkColor) {
      linkColor.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    }
  }
  linkColor.forEach((l) => l.addEventListener("click", colorLink));

  // change name Admin
  const nameUser = $(".nav_logo-name");
  if (User) {
    nameUser.textContent = User.data?.name;
  }
  // phan trang dash vs user
  const nav_user = $(".nav-user");
  const nav_dash = $(".nav-dash");
  const nav_product = $(".nav-product");
  const nav_comment = $(".nav-comment");
  const mainUser = $(".main-user");
  const mainDash = $(".main-dashboard");
  const mainProduct = $(".main-product");
  const mainComment = $(".main-comment");
  const main = $$(".main");
  nav_user.onclick = function (e) {
    // mainDash.classList.remove("nav-active")
    main.forEach((l) => l.classList.remove("nav-active"));
    mainUser.classList.add("nav-active");
  };
  nav_dash.onclick = function (e) {
    // mainUser.classList.remove("nav-active")
    main.forEach((l) => l.classList.remove("nav-active"));
    mainDash.classList.add("nav-active");
  };
  nav_product.onclick = function (e) {
    main.forEach((l) => l.classList.remove("nav-active"));
    mainProduct.classList.add("nav-active");
  };
  nav_comment.onclick = function (e) {
    main.forEach((l) => l.classList.remove("nav-active"));
    mainComment.classList.add("nav-active");
  };
  // Main User
  const btnAdd = $(".add-new");
  const btnCancel = $(".cancel");
  btnAdd.onclick = function (e) {
    $(".table-add").classList.add("table-add-active");
  };
  btnCancel.onclick = function (e) {
    $(".table-add").classList.remove("table-add-active");
  };

  //Main Product
  const btnAddNewProduct = $(".add-new-product");
  const table_product = $('#tbody-product');
  // product-items addEventListener
  const items = $(".product-items");
  items.onclick = function(e){
    const btnCancelProduct = e.target.closest(".cancel-product");
    const btnEditProduct = e.target.closest(".edit-product");
    const btnAdd = e.target.closest(".add-product");
    if(btnCancelProduct){
      btnCancelProduct.closest("tr").remove();
		$(".add-new-product").removeAttribute("disabled");
    }
    if(btnAdd){
        const img = $("#p-img").value;
        const name = $("#p-name").value;
        const manufacturer = $("#p-manufac").value;  
        const type = $("#p-type").value;
        const price = $("#p-price").value;
        const description = $("#p-descript").value;
        const data = {
          img,name,type,manufacturer,price,description
        }
        log(data)
    }
    if(btnEditProduct){
      log("hehe")
    //   btnEditProduct.closest("tr").find("td:not(:last-child)").forEach(function(){
		// 	btnEditProduct.html('<input type="text" class="form-control" value="' + $(this).text() + '">');
		// });	
    }

  }
// const formProduct = e.target.closest(".wrapper-product");
// formProduct.submit=function(e){
//   e.preventDefault();
//   const img = this.elements["img"].value;
//   const name = this.elements["name"].value;
//   const manufacturer = this.elements["manufacturer"].value;  
//   const type = this.elements["type"].value;
//   const price = this.elements["price"].value;
//   const description = this.elements["description"].value;
//   const data = {
//     img,name,type,manufacturer,price,description
//   }
// }

  btnAddNewProduct.onclick = function (e) {
    this.setAttribute("disabled","disabled");
    const row = `                            
        <tr>
        <form class="wrapper-product" action="#">
        <td><input id="p-img" type="text" class="form-control" name="img" placeholder="Link Image"></td>
        <td><input id="p-name" type="text" class="form-control" name="name" placeholder="Name Product"></td>
        <td><input id="p-type" type="text" class="form-control" name="type" placeholder="Type"></td>
        <td><input id="p-manufac" type="text" class="form-control" name="manufacturer" placeholder="Manufacturer"></td>
        <td><input id="p-price" type="text" class="form-control" name="price" placeholder="Price"></td>
        <td><input id="p-descript" type="text" class="form-control" name="description" placeholder="description"></td>
        <td>
            <a class="add-product" type="submit" title="Add"><i class="fa-solid fa-plus"></i></a>
            <a class="cancel-product" title="cancel"><i class="fa-solid fa-xmark"></i></a>
        </td>
        </form>
        </tr>`;
    table_product.insertAdjacentHTML("beforebegin",row);
    // $(".add-product").classList.add("add-product-active");
  };
  // btnCancelProduct.onclick = function (e) {
  //   // $(".add-product").classList.remove("add-product-active");
  //   console.log("hehe")
  //   $(this).parents("tr").remove();
	// 	$(".add-new").removeAttr("disabled");

  // };
});
// Main User

// document.addEventListener("DOMContentLoaded", function() {
//     var tooltipElements = document.querySelectorAll('[data-toggle="tooltip"]');
//     for (var i = 0; i < tooltipElements.length; i++) {
//       tooltipElements[i].addEventListener("mouseover", function() {
//         var tooltipText = this.getAttribute("title");
//         var tooltip = document.createElement("div");
//         tooltip.innerHTML = tooltipText;
//         tooltip.classList.add("tooltip");
//         this.appendChild(tooltip);
//       });
//       tooltipElements[i].addEventListener("mouseout", function() {
//         var tooltip = this.querySelector(".tooltip");
//         this.removeChild(tooltip);
//       });
//     }

//     var actions = document.querySelector("table td:last-child").innerHTML;

//     var addNewButton = document.querySelector(".add-new");
//     addNewButton.addEventListener("click", function() {
//       this.disabled = true;
//       var index = document.querySelectorAll("table tbody tr").length - 1;
//       var row = '<tr>' +
//                 '<td><input type="text" class="form-control" name="name" id="name"></td>' +
//                 '<td><input type="text" class="form-control" name="department" id="department"></td>' +
//                 '<td><input type="text" class="form-control" name="phone" id="phone"></td>' +
//                 '<td>' + actions + '</td>' +
//                 '</tr>';
//       var table = document.querySelector("table");
//       table.insertAdjacentHTML("beforeend", row);
//       var newAddButton = document.querySelectorAll(".add, .edit")[index + 1];
//       newAddButton.classList.toggle("hidden");
//       var newEditButton = document.querySelectorAll(".add, .edit")[index + 2];
//       newEditButton.classList.toggle("hidden");
//       var newInputs = document.querySelectorAll("table tbody tr")[index + 1].querySelectorAll('input[type="text"]');
//       for (var i = 0; i < newInputs.length; i++) {
//         newInputs[i].addEventListener("blur", function() {
//           if (this.value.trim() === "") {
//             this.classList.add("error");
//           } else {
//             this.classList.remove("error");
//           }
//         });
//       }
//     });

//     document.addEventListener("click", function(event) {
//       if (event.target.classList.contains("add")) {
//         var empty = false;
//         var inputs = event.target.parentNode.parentNode.querySelectorAll('input[type="text"]');
//         for (var i = 0; i < inputs.length; i++) {
//           if (inputs[i].value.trim() === "") {
//             inputs[i].classList.add("error");
//             empty = true;
//           } else {
//             inputs[i].parentNode.innerHTML = inputs[i].value;
//           }
//         }
//         if (!empty) {
//           var addButton = event.target;
//           var editButton = addButton.parentNode.querySelector(".edit");
//           addButton.classList.toggle("hidden");
//           editButton.classList.toggle("hidden");
//           var addButtonRow = addButton.parentNode.parentNode;
//           var addNewButton = document.querySelector(".add-new");
//           addNewButton.disabled = false;
//         }
//       } else if (event.target.classList.contains("edit")) {
//         var row = event.target.parentNode.parentNode;
//         var cells = row.querySelectorAll("td:not(:last-child)");
//         for (var i = 0; i < cells.length; i++) {
//           var cellText = cells[i].innerHTML;
//           cells[i].innerHTML = '<input type="text" class="form-control" value="' + cellText + '">';
//         }
//         var addButton = event.target;
//         var editButton = addButton.parentNode.querySelector(".edit");
//         addButton.classList.toggle("hidden");
//         editButton.classList.toggle("hidden");
//         var addNewButton = document.querySelector(".add-new");}})
//     })
