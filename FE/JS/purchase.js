const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));
const http = "http://localhost:8080/api/";
const userID = User?.data.idUser;
import {header,formatCurrency,alertFullil,alertFail,U_quantityCart} from "./header.js";
//console.log
function log(value) {
  console.log(`${value}: `,value)
}
async function getPurchased() {
    await fetch(`${http}oders/`, {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        authentication: User?.token,                         
        },
    })
        .then((data) => data.json())
        .then((data) => {
        log(data);
        renderPuchase(data);
        })
        .catch((err) => {
        console.log(err);
        })
}
getPurchased();
function renderPuchase(data){
    const html = data.data.map((val,index)=>{
        let count = 0;
        const producthtml = val.products.map((v,i)=>{
            count = count + v.quantity;
            return`
            <div class="product">
                <img src="${v.img}" alt="">
                <div class="p-name">
                    <h4 class="name-product">${v.name}</h4>
                    <span class="quantity">X${v.quantity}</span>
                </div>
                <p class="p-total">${v.price}</p>
                <div class="stars-rating">
                    <i class="fa-sharp fa-solid fa-star"></i>
                    <i class="fa-sharp fa-solid fa-star"></i>
                    <i class="fa-sharp fa-solid fa-star"></i>
                    <i class="fa-sharp fa-solid fa-star"></i>
                    <i class="fa-sharp fa-solid fa-star"></i>
                </div>
                <button class="btn ">Rating</button>
            </div>
            `
        });
        return`
                <div class="block">
                    <div class="address">
                        <div class="address-content">
                            <p class="u-name"><strong>Name:</strong>${val.name}</p>
                            <p class="p-address"><strong>Address:</strong>${val.address}</p>
                        </div>
                        <div class="total">
                            <p class="t-price"><strong>Totail:</strong>${val.total}</p>
                            <p class="t-quantity"><strong>quantity:</strong>x${count}</p>
                        </div>
                    </div>
                    <hr>
                    <div class="products">
                        ${producthtml.join("")}
                    </div>
                </div>        
        `
    })
    $(".purchased").innerHTML = html.join("");
}