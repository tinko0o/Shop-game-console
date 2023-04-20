const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));
const http = "http://localhost:8080/api/";
const userID = User?.data._id;
const alertSuccess = $(".alert-primary");
const alertDanger = $(".alert-danger");
let dataCart = [];

function header(){
    //show user
    if (User) {
        const showUser = $(".user");
        // console.log(User.data?.name)
        showUser.innerHTML = `<i class="fa-solid fa-user"></i> ${User.data?.name}
        <ul class="dropdown-user">
            <li class="profile">Your profile</li>
            <li class="purchase"><a href="./puchase.html">Purchase</a></li>
            <li class="logout">Logout</li>
        </ul>
        `;

        // btn log-out
        const logoff = $(".logout");
        logoff.addEventListener("click", function () {
          localStorage.removeItem("loginUser");
          window.location.reload();
        });
    }
}
//alert
function alertFullil() {
  alertSuccess.children[0].textContent = `Add successfuly`;
  alertSuccess.classList.add("get-active");
  setTimeout(() => {
    alertSuccess.classList.remove("get-active");
  }, 1000);
}

function alertFail() {
  alertDanger.children[0].textContent = `Something fail!`;
  alertDanger.classList.add("get-active");
  setTimeout(() => {
    alertDanger.classList.remove("get-active");
  }, 1000);
}
//render cart
function renderCart(data){
    const html = data.data.products.map((val,index) => {
        let total = val.quantity*val.price;
        // console.log(val._id)
        return `
        <tr class="product-item">
        <th>
            <a data-id="${val._id}" href="" class="img">
                <img src="${val.img}" alt="">
            </a>
        </th>
        <th>
            <div class="name-product">
                ${val.name}
            </div>
        </th>
        <th>
            ${val.price}
        </th>
        <th>

            <div class="quantity-product">
                <button data-id="${index}" class="sub">-</button>
                <input class="quantity" data-id="${val._id}" type="number" value="${val.quantity}" min="1" max="100">
                <button data-id="${index}" class="plus">+</button>
            </div>
        </th>
        <th>${total}</th>
        <th>
            <button class="delete">
                <i class="fa-solid fa-trash"></i>
            </button>
        </th>
    </tr>
        `
    });
    $("#add-to-cart").innerHTML = html.join("");
    $(".total-text").innerHTML = `Total: ${data.data.total}`;
}

async function getCart(){
    await fetch(`${http}carts/get`,{
        headers: {                     
        "Content-type": "application/json; charset=UTF-8",
        authentication: User.token,},
        method:"get",
        
    })
    .then((data) => data.json())
    .then((data) => {
        dataCart = [...data.data.products];
        renderCart(data);
        // console.log(dataCart)
    })
}
//update Cart
async function updateCart(id,quantity){
        // const _id = quantityInput.dataset.id;
        // console.log(id)
          // const dataPoduct={
          //   id:dataPoductID,
          //   quantity:1,
          // };
          fetch(`${http}carts/update/${id}`,{
            headers:{
              "Content-type": "application/json; charset=UTF-8",
              authentication: User.token,                         
            },
            method:"put",
            body: JSON.stringify({quantity})
          })
          .then((data)=>data.json())
          .then((data)=>{
            console.log(data)
            if(data.success)
            {
                renderCart(data);
              alertFullil();
            }
            else{
              alertFail();
            }
          })
          .catch(()=>{
            alertFail();
          })
        
}
window.addEventListener("load",function(){
    header();
    getCart();

    const addCart = $("#add-to-cart");
    addCart.addEventListener("change", function (e) {
        const quantityInput = e.target.closest(".quantity");
        const id = quantityInput.dataset.id;
        console.log(id)
        if(quantityInput){
            console.log(quantityInput.value)
            if (+quantityInput.value >= 1 && +quantityInput.value <= 100) {
                updateCart(id,quantityInput.value);
                alertFullil();
                // quantity=+quantityInput.value;
            }
            else{
              alertDanger.children[0].textContent = "The input must be less than 100";
              alertDanger.classList.add("get-active");
              setTimeout(() => {
                alertDanger.classList.remove("get-active");
              }, 2000);
            }
        }
    });

    addCart.addEventListener("click",function(e){
      const quantity = $(".quantity");
      const sub = e.target.closest(".sub");
      const plus = e.target.closest(".plus");
      if (sub) {
        const index = sub.dataset.id;
        const id = dataCart[index]._id;
        if (dataCart[index].quantity > 1) {
          dataCart[index].quantity--;
          // sub.nextElementSibling.value = dataCart[index].quantity;
          updateCart(id,dataCart[index].quantity)
        }
      }
      if (plus) {
        const index = plus.dataset.id;
        const id = dataCart[index]._id;
        if (dataCart[index].quantity < 100) {
          dataCart[index].quantity++;
          // plus.nextElementSibling.value = dataCart[index].quantity;
          updateCart(id,dataCart[index].quantity)
        }
      }
    })
})