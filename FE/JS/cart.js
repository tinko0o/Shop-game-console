const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));
const http = "http://localhost:8080/api/";
const userID = User?.data._id;
const alertSuccess = $(".alert-primary");
const alertDanger = $(".alert-danger");
const cartQuantities = $(".quantities-cart");
import {header,formatCurrency,alertFullil,alertFail} from "./header.js";
let dataCart = [];

// UPdate Quantity Cart
function U_quantityCart(){
  if(User){
    fetch(`${http}carts/cart/amount`,{
      headers:{
        "Content-type": "application/json; charset=UTF-8",
        authentication: User?.token,                         
      },
      // method:"post",
      // body: JSON.stringify({_id,quantity:1})
    })
    .then((data)=>data.json())
    .then((data)=>{
      if(data.success)
      {
        cartQuantities.innerHTML = data?.data;
      }
      else{
        header().logoff.click();
      }
    })
    .catch(()=>{
      alertFail();
    })
  }else{
    cartQuantities.innerHTML = "";
  }
}
//render cart
function renderCart(data){
  if(data.data != null){
    const html = data.data.products.map((val,index) => {
        let total = val.quantity*val.price;
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
            ${formatCurrency(val.price)}
        </th>
        <th>

            <div class="quantity-product">
                <button data-id="${index}" class="sub">-</button>
                <input class="quantity" data-id="${index}" type="number" value="${val.quantity}" min="1" max="100">
                <button data-id="${index}" class="plus">+</button>
            </div>
        </th>
        <th>${formatCurrency(total)}</th>
        <th>
            <button data-id="${val.id}" class="delete">
            <i class="fa-solid fa-xmark"></i>
            </button>
        </th>
    </tr>
        `
    });

    $("#add-to-cart").innerHTML = html.join("");
    $(".total-text").innerHTML = `Tổng tiền: ${formatCurrency(data.data.total)}`;
  }
  else{
      $("#add-to-cart").innerHTML = "";
      $(".total-text").innerHTML = "Tổng tiền: 0đ";
      
    }
}
async function deleteAllCart(){
    await fetch(`${http}carts/cart/delete`,{
        headers: {                     
        "Content-type": "application/json; charset=UTF-8",
        authentication: User.token,},
        method:"delete",
        
    })
    .then((data) => data.json())
    .then((data) => {
      console.log(data.success)
      if(!data.success){
        renderCart(data);
        alertFail()
      }else{
        dataCart = [];
        renderCart(data);
        alertFullil("xóa tất cả thành công")
      }
        // console.log(dataCart)
    })
}
async function getCart(){
    await fetch(`${http}carts/cart`,{
        headers: {                     
        "Content-type": "application/json; charset=UTF-8",
        authentication: User.token,},
        method:"get",
        
    })
    .then((data) => data.json())
    .then((data) => {
      if(data.data === null){
        renderCart(data);

      }else{
        dataCart = [...data.data.products];
        renderCart(data);
      }
        // console.log(dataCart)
    })
}
//delete cart
async function deleteCart(id){
    await fetch(`${http}carts/cart/delete/${id}`,{
        headers: {                     
        "Content-type": "application/json; charset=UTF-8",
        authentication: User.token,},
        method:"delete",
        
    })
    .then((data) => data.json())
    .then((data) => {
      if(data.success){
        alertFullil(data.message)
        getCart();
      }else{
        alertFail(data.message)
      }
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
          fetch(`${http}carts/cart/update/${id}`,{
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
              alertFullil("Cập nhật sản phẩm thành công");
            }
            else{
              alertFail();
              console.log(data)
            }
          })
          .catch((err)=>{
            alertFail(err);
          })
        
}
window.addEventListener("load",function(){
    header();
    getCart();
    U_quantityCart()
    const addCart = $("#add-to-cart");
    const deleteAll = $(".detele-all");
    deleteAll.addEventListener("click",function(){
      deleteAllCart();
      U_quantityCart()
    })
    addCart.addEventListener("change", function (e) {
        const quantityInput = e.target.closest(".quantity");
        const index = quantityInput.dataset.id;
        const id = dataCart[index].id;
        console.log(id)
        if(quantityInput){
            console.log(quantityInput.value)
            if (+quantityInput.value >= 1 && +quantityInput.value <= 100) {
              dataCart[index].quantity= quantityInput.value; 
                updateCart(id,parseInt(quantityInput.value));
                // alertFullil();
                U_quantityCart()
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
      const del = e.target.closest(".delete")
          U_quantityCart()
      if (sub) {
        const index = sub.dataset.id;
        const id = dataCart[index].id;
        if (dataCart[index].quantity > 1) {
          dataCart[index].quantity--;
          // sub.nextElementSibling.value = dataCart[index].quantity;
          updateCart(id,dataCart[index].quantity)
          U_quantityCart()
        }
      }
      if (plus) {
        const index = plus.dataset.id;
        const id = dataCart[index].id;
        if (dataCart[index].quantity < 100) {
          dataCart[index].quantity++;
          // plus.nextElementSibling.value = dataCart[index].quantity;
          updateCart(id,dataCart[index].quantity)
          U_quantityCart()
        }
      }
      if(del){
        const id = del.dataset.id;
        console.log(id)
        deleteCart(id);
        U_quantityCart()
      }
    })
    const btnCheckout= $(".checkout")
    btnCheckout.addEventListener("click",function(e){
      if(dataCart.length != 0){
        window.location.replace("./payment.html")
      }
      else{
        alertFail("gio hang trong")
      }
    })
})