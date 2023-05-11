import {header,formatCurrency,alertFullil,alertFail} from "./header.js";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));
const http = "http://localhost:8080/api/";
const userID = User?.data._id;
const token =User?.token;
let dataCart = [];
let dataUser = [];
function log(value) {
  console.log(`${value}: `,value)
}
async function getUser(){
    await fetch(`${http}users/user`,{
        headers: {                     
        "Content-type": "application/json; charset=UTF-8",
        authentication: User.token,},
        method:"get",
        
    })
    .then((data) => data.json())
    .then((data) => {
      if(data.data === null){
        alertFail();
      }else{
        log(data)
      localStorage.setItem(
        "loginUser",
        JSON.stringify({data:data.data , token:token})
      );
      }
    })
}

async function updateUser(name,phone,address){
    await fetch(`${http}users/user/update`,{
        headers: {                     
        // "Content-type": "application/json; charset=UTF-8",
        authentication: User.token},
        method:"put",
        body: JSON.stringify(name,phone , address)       
    })
    .then((data) => data.json())
    .then((data) => {
        log(data)
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
        renderProduct(data);
      }else{
        // dataCart = [...data.data.products];
        renderProduct(data);
      }
    })
}
async function oder(data){
    await fetch(`${http}oders/create`,{
        headers: {                     
        "Content-type": "application/json; charset=UTF-8",
        authentication: User.token,},
        method:"post",
        body:JSON.stringify(data) 
        
    })
    .then((data) => data.json())
    .then((data) => {
      if(!data.success){
        alertFail(data?.message);
      }else{
        alertFullil(data?.message);
        window.location.replace("./thank.html");
      }
    })
}
function renderProduct(data){
    if(data.data !=null){
        const html = data.data.products.map((val,index)=>{
        let total = val.quantity*val.price;
            return`
            <div class="product">
                <img src="${val.img}" alt="">
                <div class="p-name">
                    <h4 class="name-product">${val.name}</h4>
                    <span class="quantity">X${val.quantity}</span>
                </div>
                <p class="p-total">${formatCurrency(total)}</p>
            </div>
            `
        })
        $(".products").innerHTML = html.join("");
        $(".subtotal-detail").innerHTML = formatCurrency(data.data.total);
    }else{
        $(".products").innerHTML = " no product";
        $(".subtotal-detail").innerHTML = "0d";
    }
}
window.addEventListener("load",function(){
    getCart();
    header();
    getUser();
    if(User){
        $("#u-name").value= User.data?.name;
        $("#u-name").setAttribute("disabled","disabled")
        $("#u-email").value= User.data?.email;
        $("#u-email").setAttribute("disabled","disabled")
        $("#u-phone").value= User.data?.phone?`${User.data?.phone}` :"";
        $("#u-city").value= User.data?.address.city?`${User.data.address?.city}` :"";
        $("#u-district").value= User.data?.address.district?`${User.data.address?.district}` :"";
        $("#u-ward").value= User.data?.address.wards?`${User.data.address?.wards}` :"";
        $("#u-street").value= User.data?.address.streetAndHouseNumber?`${User.data.address?.streetAndHouseNumber}` :"";

    }
    const form=$(".f-checkout")
    form.addEventListener("submit",function(e){
        const name =this.elements["name"].value;
        const phone =this.elements["phone"].value;
        const email =this.elements["email"].value;
        const city =this.elements["city"].value;
        const district =this.elements["district"].value;
        const wards =this.elements["ward"].value;
        const streetAndHouseNumber =this.elements["street"].value;
        e.preventDefault()
        const dataAdressUser = {name,phone,email,city,district,wards,streetAndHouseNumber}
        log(dataAdressUser)
        // updateUser(name,phone,dataAdressUser);
        // getUser();
        oder(dataAdressUser);
    })
})