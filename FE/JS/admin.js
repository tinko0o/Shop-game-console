const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));
const alertSuccess = $(".alert-primary");
const alertDanger = $(".alert-danger");
const http = "http://localhost:8080/api/";
let getDataProduct = {};
if (!User.data.isAdmin) {
  window.location.replace("./index.html");
}
// btn log-out
const logoff = $(".log-out");
logoff.addEventListener("click", function () {
  localStorage.removeItem("loginUser");
  window.location.replace("./index.html");
});
//formatDate
function formatDate(date) {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

function formattedDate(date) {
  const dated = new Date(`${date}`)
  return formatDate(dated)
};
//reset /empty value input
function resetProduct(data) {
  this.img = $("#p-img").value = "";
  this.name = $("#p-name").value = "";
  this.date = $("#p-r_date").value = "";
  this.manufacturer = $("#p-manufac").value = "";
  this.type = $("#p-type").value = "";
  this.price = $("#p-price").value = "";
  this.description = $("#p-descript").value = "";
}

//console.log
function log(value) {
  console.log(`${value}: `, value)
}
formatCurrency
function formatCurrency(price, symbol = "đ") {
  var DecimalSeparator = Number('1.2').toLocaleString().substr(1, 1);
  var priceWithCommas = price.toLocaleString();
  var arParts = String(priceWithCommas).split(DecimalSeparator);
  var intPart = arParts[0];
  var decPart = arParts.length > 1 ? arParts[1] : '';
  decPart = (decPart + '000').substr(0, 3);
  return intPart + symbol;
}
//alert
function alertFullil(message = "success") {
  alertSuccess.children[0].textContent = `${message}`;
  alertSuccess.classList.add("get-active");
  setTimeout(() => {
    alertSuccess.classList.remove("get-active");
  }, 1000);
}

function alertFail(message = "Something fail!") {
  alertDanger.children[0].textContent = `${message}`;
  alertDanger.classList.add("get-active");
  setTimeout(() => {
    alertDanger.classList.remove("get-active");
  }, 1000);
}
function renderTopProducts(data) {
  const productHtml = data.data.map((val, index) => {
    return `
    <tr class="top-product-item">
        <th style="text-align: center; width: 5px;">${index+1}</th>
        <th>
            <a href="#" class="img">
                <img id="product-top" src="${val.img}" alt="">
            </a>
        </th>
        <th>
            <div class="name-product">
                ${val.name}
            </div>
        </th>
        <th>${val.type}</th>
        <th>${formatCurrency(val.price)}</th>
        <th>${val.quantity}</th>

    </tr>
  `;
  });
  $("#top-product-item").innerHTML = productHtml.join("");
}
//Render
function renderUser(data) {
  const productHtml = data.data.map((val, index) => {
    return `
    <tr data-id="${val._id}">
        <td data-key="name">${val.name}</td>
        <td data-key="email">${val.email}</td>
        <td data-key="phone">${val.phone ? val.phone : ""}</td>
        <td data-key="city">${val.city ? val.city : ""}</td>
        <td data-key="district">${val.district ? val.district : ""}</td>
        <td data-key="wards">${val.wards ? val.wards : ""}</td>
        <td data-key="street">${val.streetAndHouseNumber ? val.streetAndHouseNumber : ""}</td>
        <td>
            <!--<a class="save-user" title="Add" data-toggle="tooltip"><i class="fa-solid fa-plus-minus"></i></a> -->
            <a data-id="${val._id}" class="edit-user" title="Edit" data-toggle="tooltip"><i class="fa-solid fa-pencil"></i></a>
            <a data-id="${val._id}" class="delete-user" title="Delete" data-toggle="tooltip"><i class="fa-solid fa-trash"></i></a>
        </td>
    </tr>
    `;
  });
  $("#tbody-user").innerHTML = productHtml.join("");
}
function renderProduct(data) {
  const productHtml = data.data.map((val, index) => {
    return `
    <tr data-id="${val?._id} class="product-item">
        <th data-key="img" data-value="${val.img}">
            <a data-id=${val._id} href="#" class="img d-block">
                <img src="${val.img}" alt="">
            </a>
        </th>
        <th data-key="name" data-value="${val.name}" class="name-product">
        ${val.name}

        </th>
        <th data-key="release_date" data-value="${formattedDate(val.release_date)}">${formattedDate(val.release_date)}</th>
        <th data-key="type" data-value="${val.type}"> ${val.type} </th>
        <th data-key="manufacturer" data-value="${val.manufacturer}"> ${val.manufacturer} </th>
        <th data-key="price" data-value="${val.price}"> ${formatCurrency(val.price)} </th>
        <th data-key="description" data-value="${val.description}" class="description">
          ${val.description}
        </th>
        <th class="d-flex">
            <a data-id="${val?._id}" class=" btn btn-danger edit-product" title="Add" data-toggle="tooltip"><i class="fa-solid fa-pencil"></i></a>
            <a data-id="${val?._id}"class=" btn btn-primary delete-product" title="cancel" data-toggle="tooltip"><i class="fa-solid fa-xmark"></i></a>
        </th>
    </tr>
  `;
  });
  $("#tbody-product").innerHTML = productHtml.join("");
}
function renderPuchase(data) {
  const html = data.data.map((val, index) => {
    let count = 0;
    const producthtml = val.products.map((v, i) => {
      count = count + v.quantity;
      return `
            <div data-id="${v.id}" class="product">
                <img src="${v.img}" alt="">
                <div class="p-name">
                    <h4 class="name-product">${v.name}</h4>
                    <span class="quantity">X${v.quantity}</span>
                </div>
                <p class="p-total">${formatCurrency(v.price)}</p>
            </div>
            `
    });
    return `
                <div class="block">
                    <div class="address">
                        <div class="address-content">
                            <p class="u-name"><strong>Người đặt:</strong>${val.name}</p>
                            <p class="u-phone"><strong>Số điện thoại:</strong>${val.phone}</p>
                            <p class="p-address"><strong>Địa chỉ:</strong>${val.address}</p>
                        </div>
                        <div class="total">
                            <p class="t-price"><strong>Tổng tiền:</strong>${formatCurrency(val.total)}</p>
                            <p class="t-quantity"><strong>Tổng sản phẩm:</strong>x${count}</p>
                            <p class="p-createdAt"><strong>Ngày đặt:</strong>${formattedDate(val.createdAt)}</p>
                        </div>
                        <div class="status">
                            <p class="s-status"><strong>Trạng thái:</strong>${val.status}</p>
                            <hr style="margin-bottom: 0; color: white;">
                            <button data-id="${val._id}" class="btn btn-secondary btn-cancel">Hủy Đơn</button>
                            <button data-id="${val._id}" class="btn btn-primary  btn-confirm">Xác nhận</button>
                            <button data-id="${val._id}" class="btn btn-success btn-deleved">Đã giao</button>                           
                        </div>                        
                    </div>
                    <hr>
                    <div data-id="${val._id}" class="products">
                        ${producthtml.join("")}
                    </div>
                </div>        
        `
  })
  $(".purchased").innerHTML = html.join("");
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
      // log(data)
      renderProduct(data);
    })
    .catch((err) => {
      console.log(err);
    })
}
//get all Top Sale Product
async function getTopProducts() {
  await fetch(`${http}products/abc/top-sales-products`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User?.token,
    },
  })
    .then((data) => data.json())
    .then((data) => {
      // log(data)
      renderTopProducts(data);
    })
    .catch((err) => {
      console.log(err);
    })
}
getTopProducts()
async function getUser() {
  await fetch(`${http}users`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User?.token,
    },
  })
    .then((data) => data.json())
    .then((data) => {
      renderUser(data);
    })
    .catch((err) => {
      console.log(err);
    })
}
async function getAllOder() {
  await fetch(`${http}oders/all-orders`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User?.token,
    },
  })
    .then((data) => data.json())
    .then((data) => {
      log(data)
      renderPuchase(data);
    })
    .catch((err) => {
      console.log(err);
    })
}
async function getStatistic() {
  await fetch(`${http}sales-Reports`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User?.token,
    },
  })
    .then((data) => data.json())
    .then((data) => {
      // renderUser(data);
      // console.log(data)
      $(".rating-product").innerHTML = data.data[0]?.totalProducts || 0
      $(".rating-revenue").innerHTML = formatCurrency(data.data[0]?.totalSales) || 0 
      $(".rating-users").innerHTML = data.data[0]?.totalUsers || 0
      $(".rating-orders").innerHTML = data.data[0]?.numberOfOrder || 0
    })
    .catch((err) => {
      console.log(err);
    })
}
getStatistic();
//add new product
async function addProduct(data) {
  await fetch(`${http}products/add`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User?.token,
    },
    method: "POST",
    body: JSON.stringify(data)
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res.success) {
        alertFail(res.message);
      } else {
        alertFullil(res.message)
      }
    })
    .catch((err) => {
      alertFail();
      log(err);
    })
}
async function editUser(data, id) {
  await fetch(`${http}users/edit/${id}`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User?.token,
    },
    method: "put",
    body: JSON.stringify(data)
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res.success) {
        alertFail(res.message);
      } else {
        alertFullil(res.message)
        console.log(res.message)
      }
    }).catch((err) => {
      alertFail();
    })
}
async function deleteUser(id) {
  await fetch(`${http}users/delete/${id}`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User?.token,
    },
    method: "delete",
    // body:JSON.stringify(data)
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res.success) {
        alertFail(res.message);
      } else {
        alertFullil(res.message)
        console.log(res.message)
      }
    }).catch((err) => {
      alertFail();
    })
}
async function updateProduct(id, data) {
  await fetch(`${http}products/update/${id}`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User?.token,
    },
    method: "put",
    body: JSON.stringify(data)
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res.success) {
        alertFail(res.message);
      } else {
        alertFullil(res.message)
        // product();
      }
    }).catch((err) => {
      alertFail();
    })
}
async function deleteProduct(id) {
  await fetch(`${http}products/delete/${id}`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User?.token,
    },
    method: "delete",
    // body:JSON.stringify(data)
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res.success) {
        alertFail(res.message);
      } else {
        alertFullil("delete success")
        product();
      }
    }).catch((err) => {
      alertFail();
    })
}
//Oder
function cancelOder(id) {
  fetch(`${http}oders/peding/confirm/cancel/${id}`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User?.token,
    },
    method: "put",
    // body: JSON.stringify({id})
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.success) {
        alertFullil(data.message)
        getAllOder();
      }
      else {
        alertFail(data.message)
      }
    })
    .catch(() => {
      alertFail();
    })

}
function confimOder(id) {
  fetch(`${http}oders/confirm/${id}`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User?.token,
    },
    method: "put",
    // body: JSON.stringify({id})
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.success) {
        alertFullil(data.message)
        getAllOder();
      }
      else {
        alertFail(data.message)
      }
    })
    .catch(() => {
      alertFail();
    })

}
function delivedOder(id) {
  fetch(`${http}oders/confirm/delivery/${id}`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User?.token,
    },
    method: "put",
    // body: JSON.stringify({id})
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.success) {
        alertFullil(data.message)
        getAllOder();
      }
      else {
        alertFail(data.message)
      }
    })
    .catch(() => {
      alertFail();
    })

}
document.addEventListener("DOMContentLoaded", function (event) {
  product();
  getUser()
  getAllOder();
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

  const tabUser = $(".table-user")
  tabUser.addEventListener("click", function (e) {
    const editBtn = e.target.closest(".edit-user")
    const deleteBtn = e.target.closest(".delete-user")
    if (editBtn) {
      const row = editBtn.closest("tr");
      const inputs = row.querySelectorAll("td:not(:last-child)");

      // Disable all edit buttons while editing
      const editButtons = row.querySelectorAll(".edit-user");
      editButtons.forEach(button => button.disabled = true);

      // Change the edit button to a save button
      editBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
      editBtn.classList.remove("edit-user");
      editBtn.classList.add("save-user");

      // Enable the delete button while editing
      const deleteButton = row.querySelector(".delete-user");
      deleteButton.disabled = false;

      // Add input fields to each cell
      inputs.forEach((cell, index) => {
        const dataKey = cell.getAttribute('data-key');
        if (dataKey !== 'password' && dataKey !== 'isAdmin'&& dataKey !== 'email') {
          const text = cell.textContent;
          cell.innerHTML = `<input type="text" value="${text}">`;
        }
      });
    }
    const saveBtn = e.target.closest(".save-user");
    if (saveBtn) {
      const row = saveBtn.closest("tr");
      const inputs = row.querySelectorAll("input");
      const id = saveBtn.dataset.id;
      // Change the save button back to an edit button
      saveBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
      saveBtn.classList.remove("save-user");
      saveBtn.classList.add("edit-user");

      // Disable the delete button while not editing
      const deleteButton = row.querySelector(".delete-user");
      deleteButton.disabled = true;

      // Enable all edit buttons while not editing
      const editButtons = row.querySelectorAll(".edit-user");
      editButtons.forEach(button => button.disabled = false);
      let data = {
        name: row.querySelector('td[data-key="name"]').textContent,
        email: row.querySelector('td[data-key="email"]').textContent,
        phone: row.querySelector('td[data-key="phone"]').textContent,
        city: row.querySelector('td[data-key="city"]').textContent,
        district: row.querySelector('td[data-key="district"]').textContent,
        wards: row.querySelector('td[data-key="wards"]').textContent,
        street: row.querySelector('td[data-key="street"]').textContent,
      };
      inputs.forEach((input, index) => {
        const keyIndex = index + 1; // Adjust the index by adding 1
        let adjustedIndex = keyIndex;
        if (keyIndex >= 2) {
          adjustedIndex += 1; // Skip the locked email cell
        }
        const key = row.querySelector(`td:nth-child(${adjustedIndex})`).getAttribute("data-key");
        if (key !== "password" && key !== "isAdmin") {
          if (key === "email") {
            const text = row.querySelector(`td[data-key="${key}"]`).textContent;
            data[key] = text;
          } else {
            data[key] = input.value;
            row.querySelector(`td[data-key="${key}"]`).textContent = input.value;
          }
        }
      });
      const dataUser = { ...data, streetAndHouseNumber: data.street };
      editUser(dataUser, id);
    }
    if (deleteBtn) {
      const row = deleteBtn.closest("tr");
      row.remove();
      const id = deleteBtn.dataset.id;
      deleteUser(id)
    }
  })
  //Main Product
  const btnAddNewProduct = $(".add-new-product");
  const table_product = $('#tbody-product');
  // product-items addEventListener
  const tbodyProduct = $(".product-items");
  tbodyProduct.addEventListener("click", function (e) {
    const btnEditProduct = e.target.closest(".edit-product");
    if (btnEditProduct) {
      const row = btnEditProduct.closest("tr");
      const inputs = row.querySelectorAll("th:not(:last-child)");

      // Disable all edit buttons while editing
      const editButtons = row.querySelectorAll(".edit-product");
      editButtons.forEach((button) => (button.disabled = true));

      // Change the edit button to a save button
      btnEditProduct.innerHTML = ' <i class="fa-solid fa-check">'
      btnEditProduct.classList.remove("edit-product");
      btnEditProduct.classList.add("save-product");

      // Enable the delete button while editing
      const deleteButton = row.querySelector(".delete-product");
      deleteButton.disabled = false;

      // Add input fields to each cell
      inputs.forEach((cell, index) => {
        const text = cell.dataset.value;
        cell.innerHTML = `<input type="text" value="${text}">`;
      });
    }

    const saveBtn = e.target.closest(".save-product");
    if (saveBtn) {
      const row = saveBtn.closest("tr");
      const inputs = row.querySelectorAll("input");
      const id = saveBtn.dataset.id;

      // Change the save button back to an edit button
      saveBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
      saveBtn.classList.remove("save-product");
      saveBtn.classList.add("edit-product");

      // Disable the delete button while not editing
      const deleteButton = row.querySelector(".delete-product");
      deleteButton.disabled = true;

      // Enable all edit buttons while not editing
      const editButtons = row.querySelectorAll(".edit-product");
      editButtons.forEach((button) => (button.disabled = false));
      let data = {
        img: row.querySelector('th[data-key="img"]').dataset.value,
        name: row.querySelector('th[data-key="name"]').dataset.value,
        type: row.querySelector('th[data-key="type"]').dataset.value,
        release_date: row.querySelector('th[data-key="release_date"]').dataset.value,
        manufacturer: row.querySelector('th[data-key="manufacturer"]').dataset.value,
        price: row.querySelector('th[data-key="price"]').dataset.value,
        description: row.querySelector('th[data-key="description"]').dataset.value,
      };
      inputs.forEach((input, index) => {

        const key = row.querySelector(`th:nth-child(${index + 1})`).dataset.key;
        if (key !== null) {
          const value = input.value;
          data[key] = value;
          if (key.startsWith("img")) {
            row.querySelector("th:first-child").innerHTML = `<img src="${value}" alt="">`;
          } else {
            row.querySelector(`th[data-key="${key}"]`).dataset.value = value;
            row.querySelector(`th[data-key="${key}"]`).textContent = value;
          }
        }
        // input.parentElement.removeChild(input);
      });
      updateProduct(id, data);
      console.log(data)
    }



    const btnCancelProduct = e.target.closest(".cancel-product");
    const btnDeleteProduct = e.target.closest(".delete-product");
    const btnAdd = e.target.closest(".add-product");
    if (btnCancelProduct) {
      btnCancelProduct.closest("tr").remove();
      $(".add-new-product").removeAttribute("disabled");
    }
    if (btnAdd) {
      const img = $("#p-img").value;
      const name = $("#p-name").value;
      const release_date = $("#p-r_date").value;
      const manufacturer = $("#p-manufac").value;
      const type = $("#p-type").value;
      const price = $("#p-price").value;
      const description = $("#p-descript").value;

      const data = {
        img, name, release_date, type, manufacturer, price, description
      }
      resetProduct(data);
      // log(data)
      addProduct(data);
      setTimeout(() => {
        product();
      }, 1000);
    }
    if (btnCancelProduct) {
      // $(".add-product").classList.remove("add-product-active");
      // console.log("hehe")
      // $(btnCancelProduct).parents("tr").remove();
      // $(".add-new").removeAttr("disabled");

    };
    if (btnDeleteProduct) {
      const id = btnDeleteProduct.dataset.id
      deleteProduct(id)
    }
    const detailImg = e.target.closest(".img")
    if (detailImg) {
      const id = detailImg.dataset.id
      window.location.href = `./detail.html?idpd=${id}`
    }
  });

  btnAddNewProduct.onclick = function (e) {
    this.setAttribute("disabled", "disabled");
    const row = `                            
    <tr>
      <form class="wrapper-product" action="#">
          <td><input id="p-img" type="text" class="form-control" name="img" placeholder="Link ảnh"></td>
          <td><input id="p-name" type="text" class="form-control" name="name" placeholder="Tên"></td>
          <td><input id="p-r_date" type="text" class="form-control" name="release_date" placeholder="Ngày ra mắt"></td>
          <td>
              <select id="p-type" class="form-control" name="type" style="padding: 0px 8px 6px;">
                  <option value="">Chọn</option>
                  <option value="Máy XBOX SERIES">Máy XBOX SERIES</option>
                  <option value="Máy PS5">Máy PS5</option>
                  <option value="Máy PS4">Máy PS4</option>
                  <option value="Máy Nintendo Switch">Máy Nintendo Switch</option>
                  <option value="Game PS4">Game PS4</option>
                  <option value="Game PS5">Game PS5</option>
                  <option value="Game Nintendo Switch">Game Nintendo Switch</option>
                  <option value="Game XBOX SERIES">Game XBOX SERIES</option>
                  <option value="Phụ kiện PS5">Phụ kiện PS5</option>
                  <option value="Phụ kiện PS4">Phụ kiện PS4</option>
                  <option value="Phụ kiện Nintendo Switch">Phụ kiện Nintendo Switch</option>
                  <option value="Phụ Kiện XBOX SERIES">Phụ Kiện XBOX SERIES</option>
              </select>
          </td>
          <td><input id="p-manufac" type="text" class="form-control" name="manufacturer" placeholder="Sản xuất"></td>
          <td><input id="p-price" type="text" class="form-control" name="price" placeholder="Giá"></td>
          <td><textarea id="p-descript" class="form-control" name="description" placeholder="Mô tả" style="height: 150px"></textarea></td>
          <td>
              <a class="add-product" type="submit" title="Add"><i class="fa-solid fa-plus"></i></a>
              <a class="cancel-product" title="cancel"><i class="fa-solid fa-xmark"></i></a>
          </td>
      </form>
    </tr>`;
    table_product.insertAdjacentHTML("beforebegin", row);
    // $(".add-product").classList.add("add-product-active");
  };
  // btnCancelProduct.onclick = function (e) {
  //   // $(".add-product").classList.remove("add-product-active");
  //   console.log("hehe")
  //   $(this).parents("tr").remove();
  // 	$(".add-new").removeAttr("disabled");
  // };


  //Main purchase
  const oderUser = $(".purchased")
  oderUser.addEventListener("click", function (e) {
    const btnCancel = e.target.closest(".btn-cancel")
    const btnDelivery = e.target.closest(".btn-deleved")
    const btnconfirm = e.target.closest(".btn-confirm")
    if (btnCancel) {
      const cancelId = btnCancel.dataset.id
      cancelOder(cancelId)
      // console.log(cancelId)

    }
    if (btnconfirm) {
      const confirmId = btnconfirm.dataset.id
      confimOder(confirmId)
      // console.log(confirmId)
    }
    if (btnDelivery) {
      const deliveryId = btnDelivery.dataset.id
      delivedOder(deliveryId)
    }
  })
});