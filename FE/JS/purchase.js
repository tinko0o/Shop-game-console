const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));
const http = "http://localhost:8080/api/";
const userID = User?.data.idUser;
import {header,formatCurrency,alertFullil,alertFail} from "./header.js";
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
            <div data-id="${v.id}" class="product">
                <img src="${v.img}" alt="">
                <div class="p-name">
                    <h4 class="name-product">${v.name}</h4>
                    <span class="quantity">X${v.quantity}</span>
                </div>
                <p class="p-total">${v.price}</p>
                <div data-id="${v.id}" data-rating="5" class="stars-rating">
                    <i class="fa-sharp fa-solid fa-star"></i>
                    <i class="fa-sharp fa-solid fa-star"></i>
                    <i class="fa-sharp fa-solid fa-star"></i>
                    <i class="fa-sharp fa-solid fa-star"></i>
                    <i class="fa-sharp fa-solid fa-star"></i>
                </div>
                <button class="btn btn-rate">Rating</button>
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
                            <p class="p-createdAt"><strong>createdAt:</strong>${val.createdAt}</p>
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
function handleRatingClick(event) {
  const starElement = event.target.closest(".stars-rating .fa-star");
  if (starElement) {
    const rating = $('.stars-rating').dataset.rating;
    const starsContainer = starElement.parentElement;
    const allStars = Array.from(starsContainer.children);
    const selectedIndex = allStars.indexOf(starElement);
    allStars.forEach((star, index) => {
      if (index <= selectedIndex) {
        star.classList.add("filled");
      } else {
        star.classList.remove("filled");
      }
    });
    starsContainer.dataset.rating = selectedIndex;
  }
}
window.addEventListener("load",function(e){
  header();
    const purchased= $(".purchased");
    purchased.addEventListener('click',function(e){
    const product = e.target.closest('.product')
    const stars =e.target.closest(".stars-rating .fa-star")
    const rate = e.target.closest(".btn-rate")
    const img = e.target.closest("img")
    const name = e.target.closest(".name-product")
    if (stars) {
      handleRatingClick(e);
    }
    if(rate){
        const id = product.dataset.id;
        log(id)
      }
    if(img || name){
        const id = product.dataset.id;
        window.location.href = `./detail.html?idpd=${id}`
    }


    });

})