const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const alertSuccess = $(".alert-primary");
const alertDanger = $(".alert-danger");
const User = JSON.parse(localStorage.getItem("loginUser"));
const http = "http://localhost:8080/api/";
const userID = User?.data.idUser;
import {header,formatCurrency,alertFullil,alertFail} from "./header.js";
const cartQuantities = $(".quantities-cart");
const formAddCmt = $("#f-addcmt");
const listCmt = $(".list-cmt");
//console.log
function log(value) {
  console.log(`${value}: `,value)
}

function formatDate(date) {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function formattedDate(date){
  const dated = new Date(`${date}`)
  return formatDate(dated)
};
// console.log(formattedDate("2023-05-06T15:08:31.509Z"));

function getSearchParameters() {
    var prmstr = window.location.search.substring(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
  }
  function transformToAssocArray(prmstr) {
    var params = {};
    var prmarr = prmstr.split("&");
    for (var i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split("=");
      params[tmparr[0]] = tmparr[1];
    }
    return params;
  }

function renderCmt(data){
  const html = data.comments.map((val,index)=>{
    const rep = val.replies.map((v,i)=>{
      return `
          <li class="rep">
        <div class="main-cmt">
            <div class="cmt-top">
                <p class="cmt-top-name">${v.name}${v.isAdmin?"_Admin":""}${v.purchased?"_purchased":""}</p>
            </div>
            <div class="cmt-content">
                <p class="cmt-text"><a href="#">@${v.repliedToUsername}</a>${v.comment}</p>
            </div>
            <div class="cmt-command">
                <button class="btn-rep" data-id="${v._id}" data-parent="${v.parentCommentId}">Reply</button>
                <span>${formattedDate(v.createdAt)}</span>
            </div>
        </div>                                    
    </li>
      `
    })
    // log(replyHtml) 
    return `
        <li class="cmt">
            <div class="main-cmt">
                <div class="cmt-top">
                    <p class="cmt-top-name">${val.name}</p>
                </div>
                <div class="cmt-content">
                    <p class="cmt-text">${val.comment}</p>
                </div>
                <div class="cmt-command">
                    <button class="btn-rep" data-id="${val._id}">Reply</button>
                    <span>${formattedDate(val.createdAt)}</span>
                </div>
            </div>
            <ul class="l-rep">
                ${rep.join("")}
            </ul>
        </li>
    `;
  });
  $(".list-cmt").innerHTML = html.join("");
}
async function getComment() {
    const productId = getSearchParameters().idpd; 
        await fetch(`${http}comments/${productId}`, {
          // headers: {
          //   "Content-type": "application/json; charset=UTF-8",
          // authentication: User?.token,                         
          // },
        })
          .then((data) => data.json())
          .then((data) => {
            log(data);
            // log(data.comments[0].replies)
            renderCmt(data);
          })
          .catch((err) => {
            console.log(err);
          })
    }

function renderContent (data){
    const html_img=`<img class="img-fluid details-img" src="${data.img}" alt="">`
    const html_name = `                          
    <p class="product-category mb-0">${data.manufacturer}</p>
    <h3>${data.name}</h3>
    <hr>
    <p class="product-price">${data.price}</p>`
    const html_description = `                            
    <p class="product-title mt-4 mb-1">About this product</p>
    <p class="product-description mb-4">
    ${data.description}
    </p>`
    $(".image").innerHTML = html_img;
    $(".description").innerHTML = html_description;
    $(".name").innerHTML = html_name;
}

// UPdate Quantity Cart
function U_quantityCart(){
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
}
function addRepCmt(comment,parentCommentId){
    const {idpd} = getSearchParameters();
  fetch(`${http}comments/add`,{
    headers:{
      "Content-type": "application/json; charset=UTF-8",
      authentication: User?.token,                         
    },
    method:"post",
    body: JSON.stringify({productId:idpd,comment,parentCommentId})
  })
  .then((data)=>data.json())
  .then((data)=>{
    if(data.success)
    {
      alertFullil(data.message)
      getComment();
    }
    else{
      alertFail(data.message)
    }
  })
  .catch(()=>{
    alertFail();
  })
}
function addCmt(comment){
    const {idpd} = getSearchParameters();
  fetch(`${http}comments/add`,{
    headers:{
      "Content-type": "application/json; charset=UTF-8",
      authentication: User?.token,                         
    },
    method:"post",
    body: JSON.stringify({productId:idpd,comment})
  })
  .then((data)=>data.json())
  .then((data)=>{
    if(data.success)
    {
      alertFullil(data.message)
      getComment();
    }
    else{
      alertFail(data.message)
    }
  })
  .catch(()=>{
    alertFail();
  })
}
formAddCmt.addEventListener("submit",function(e){
  e.preventDefault();
  const txtCmt=$("#txt-add").value;
  addCmt(txtCmt);
  $("#txt-add").value = "";

})
window.addEventListener("load",function(){
  header();
  U_quantityCart();
  getComment();
    //render html
    const {idpd} = getSearchParameters();
    fetch(`${http}products/${idpd}`)
    .then((data)=>data.json())
    .then((data)=>{
        renderContent(data.data);
    });
    // + - sl quantity
    const sub = $(".sub");
    const plus = $(".plus");
    const quantityInput = $(".quantity");
    let quantity = 1;
    
    quantityInput.addEventListener("change", function (e) {
      if (+this.value >= 1 && +this.value <= 100) {
        quantity = +this.value;
      } else {
        this.value = quantity;
      }
    });
    
    sub.addEventListener("click", function (e) {
      if (quantity > 1) {
        quantity--;
        quantityInput.value = quantity;
      }
    });
    
    plus.addEventListener("click", function (e) {
      if (quantity < 100) {
        quantity++;
        quantityInput.value = quantity;
      }})
      //add-cart
      const btnAddCart = $(".add-cart");
      btnAddCart.addEventListener("click",function(e){
        const id =getSearchParameters().idpd ;
        const quantity=parseInt(quantityInput.value); 
        // const dataPoduct={
        //   id:dataPoductID,
        //   quantity:1,
        // };
        fetch(`${http}carts/add`,{
          headers:{
            "Content-type": "application/json; charset=UTF-8",
            authentication: User.token,                         
          },
          method:"post",
          body: JSON.stringify({id,quantity})
        })
        .then((data)=>data.json())
        .then((data)=>{
          if(data.success)
          {
            alertFullil();
            U_quantityCart();
          }
          else{
            alertFail();
          }
        })
        .catch(()=>{
          alertFail();
        })
      });
    // listCmt.addEventListener("submit",function(e){
    //   e.preventDefault();
    //   const btnSend = e.target.querySelector(".btn-send");
    //   // const txt = e.target.querySelector(".txt").value;
    //   const txt = document.querySelector("#txtRep-add").value;

    //   const parentComment = btnSend.dataset.parent;
    //   log(txt);
    // });
     listCmt.addEventListener("click",function(e){
      e.preventDefault();
      const btnrep = e.target.closest(".btn-rep")
      const f_rep = e.target.closest("#f-addRepCmt")
      const test = e.target.closest("#txt-add");

      if(f_rep){
        const btnSend = $(".btn-send")
        btnSend.onclick = ()=>{
        const txt = $("#txtRep-add").value;
        const parentComment = btnSend.dataset.parent
          addRepCmt(txt,parentComment)         
        }

      }
      // f_rep.addEventListener("submit",function(e){
      //   e.preventDefault();
      //   const txtCmt=$("#txt-add").value;
      //   // addCmt(txtCmt);
      //   log(txtCmt)
      // })

      if(btnrep){
      const idRep = btnrep.dataset.id;
      const parentComment = btnrep.dataset.parent
      $$('.btn-rep').forEach((replyBtns)=>{
              replyBtns.removeAttribute("disabled");
              const currentModelNextSiblings = replyBtns.nextElementSibling.nextElementSibling;
              if (currentModelNextSiblings) {
                currentModelNextSiblings.removeAttribute("disabled");
                currentModelNextSiblings.remove();
              }
      })
        const row = `
            <div class="addcmt">
                <form id="f-addRepCmt" action="#">
                    <textarea class="txt" name="txt-content" id="txtRep-add" maxlength="1000" pattern=".{10,1000}" required="required" minlength="10" cols="30" rows="10" placeholder="Please ask questions"></textarea>
                    <button class="btn btn-send" data-parent="${idRep}" type="submit">Send</button>
                </form>
            </div>
              `
      const replyList  = $(`[data-id="${idRep}"]`);
      // log(replyList)
      replyList.nextElementSibling.insertAdjacentHTML("afterend",row);
        replyList.setAttribute("disabled","disabled");
      };

     });


})
