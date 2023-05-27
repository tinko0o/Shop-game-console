// const { json } = require("body-parser");
// const { join } = require("path");
// const { default: header } = require("./header");
// import head from "./header.js";

// const { changePassword } = require("../../BE/controllers/userController");

// const { changePassword } = require("../../BE/controllers/userController");

// const { json } = require("body-parser");

// import debounce from 'lodash';
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));
const http = "http://localhost:8080/api/";
const userID = User?.data._id;
const alertSuccess = $(".alert-primary");
const alertDanger = $(".alert-danger");
const cartQuantities = $(".quantities-cart");

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
//header
function header(){
    //show user
    if (User) {
        const showUser = $(".user");
        // console.log(User.data?.name)
        showUser.innerHTML = `<i class="fa-solid fa-user"></i> ${User.data?.name}
        <ul class="dropdown-user">
        <li class="profile">
          <div class="btn-group dropstart">
            <button type="button" class=" dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              Thông tin tài khoản
            </button>
            <ul class="dropdown-menu">
              <li>Họ tên: ${User.data?.name}</li>
              <li>Email:${User.data?.email}</li>
              <li class="Change">Đổi mật khẩu
                <div class="dropdown-pass">
                  <form action="#">
                    <input id="old-p" type="password"placeholder="Mật khẩu cũ">
                    <input id="new-p" type="password"placeholder="Mật khẩu mới" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"title="Phải chứa ít nhất một số và một chữ hoa và chữ thường, và ít nhất 8 ký tự trở lên">
                    <input id="re-p" type="password"placeholder="Nhập lại mật khẩu mới">
                    <button class="btn btn-dark btn-changePass" type="submit">Cập nhật</button>
                  </form> 
                </div>
              </li>
              <li>
                <div class="btn-group dropstart">
                  <button type="button" class="btn btn-secondary dropdown-toggle edit-profile" data-bs-toggle="dropdown" aria-expanded="false">
                    Thông tin cá nhân
                  </button>
                  <ul class="dropdown-menu">
                    Edit
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li class="purchase"><a href="./purchase.html">Đơn hàng</a></li>
        <li class="logout">Đăng xuất</li>
    </ul>
        `;
        // btn log-out
        const logoff = $(".logout");
        logoff.addEventListener("click", function () {
          localStorage.removeItem("loginUser");
          window.location.reload();
        });

        const editUser = $(".edit-profile");
        editUser.addEventListener("click", function () {
          window.location.replace("./userProfile.html");
        });

    }
}
// check click cart
$(".cart").addEventListener("click",function(){
  if(User){
    window.location.replace("./cart.html")
  }else{
    alertFail("You need login fist")
  }
})
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
function changePass(password,newPassword,confirmPassword){
  if(User){
    fetch(`${http}users/user/changepassword`,{
      headers:{
        "Content-type": "application/json; charset=UTF-8",
        authentication: User?.token,                         
      },
      method:"put",
      body: JSON.stringify({password,newPassword,confirmPassword})
    })
    .then((data)=>data.json())
    .then((data)=>{
      if(data.success)
      {
        alertFullil(data.message)
      }
      else{
        alertFail(data.message)

      }
    })
    .catch(()=>{
      alertFail();
    })
}
}
//alert
 function alertFullil(message="success") {
  alertSuccess.children[0].textContent = `${message}`;
  alertSuccess.classList.add("get-active");
  setTimeout(() => {
    alertSuccess.classList.remove("get-active");
  }, 1500);
}

function alertFail(message="Something fail!") {
  alertDanger.children[0].textContent = `${message}`;
  alertDanger.classList.add("get-active");
  setTimeout(() => {
    alertDanger.classList.remove("get-active");
  }, 1500);
}
// scroll
function scroll(){
  const eScrollTop = $(".scroll-top");
  const navBottom = $(".nav-bottom")
  const windowScroll = window.pageYOffset;
  const header = $("header")
  if (windowScroll >= 120) {
    eScrollTop.classList.add("active-scroll-top");
  } else {
    eScrollTop.classList.remove("active-scroll-top");
  }
  if (windowScroll >= 120) {
    navBottom.classList.add("nav-down");
    header.style.paddingTop = "74px";
  } else {
    navBottom.classList.remove("nav-down");
    header.style.paddingTop = "0";
  }
  eScrollTop.onclick = function (e) {
    document.documentElement.scrollTop = 0;
  };
}
window.addEventListener("scroll",function(){
  scroll();
})

window.addEventListener("load",function(){
    header();
    scroll();
    U_quantityCart();
    // change password user
    const userProfile = $(".user")
    userProfile.addEventListener("click",function(e){
      const btnChange = e.target.closest(".btn-changePass")
      if(btnChange){
        e.preventDefault();
      const oldPassword = document.getElementById("old-p").value;
      const newPassword = document.getElementById("new-p").value;
      const repeatPassword = document.getElementById("re-p").value;
      changePass(oldPassword,newPassword,repeatPassword)
      }
    })
    
    // head()
    const navPage = $(".pagination");
    const products = {
      pageInto: 1,
      searching: "",
      data: [
        {
          name: "Watch",
          img: "./img/sp1.jpg",
          price: 1200,
        },
        {
          name: "Watch",
          img: "./img/sp1.jpg",
          price: 1200,
        },
      ],
    //   updateCart: function () {},
    // const HTTP = "http://localhost:8080/api/";
    page: function (pageNow = 1, limit = 8, countData) {
    const countPage = Math.ceil(countData / limit);
    navPage.innerHTML = `<li class="col prev"><i class="fa-solid fa-angles-left"></i>PREV</li>
            <li class="col  next">NEXT<i class="fa-solid fa-angles-right"></i></li>`;
    if (countPage <= 5) {
        for (let index = 0; index < countPage; index++) {
        const page = document.createElement("li");
        page.classList.add("col");
        page.classList.add("page");
        if (index === pageNow - 1) {
            page.classList.add("active");
        }
        page.setAttribute("data-page", `${index + 1}`);
        page.innerHTML = `<a href="#">${index + 1}</a>`;
        navPage.lastElementChild.insertAdjacentElement("beforebegin", page);
        }
    } else if (countPage >= 6 && pageNow <= 3) {
        const pageOneTwo =
        pageNow === 1
            ? ` <li class="col page active" data-page="1"><a href="#">1</a></li>
            <li class="col page" data-page="2"><a href="#">2</a></li>
            <li class="col page" data-page="3"><a href="#">3</a></li>`
            : pageNow === 2
            ? ` <li class="col page" data-page="1"><a href="#">1</a></li>
            <li class="col page active" data-page="2"><a href="#">2</a></li>
            <li class="col page" data-page="3"><a href="#">3</a></li>`
            : ` <li class="col page" data-page="1"><a href="#">1</a></li>
            <li class="col page" data-page="2"><a href="#">2</a></li>
            <li class="col page active" data-page="3"><a href="#">3</a></li>`;
        navPage.innerHTML = `
            <li class="col prev"><i class="fa-solid fa-angles-left"></i>PREV</li>
            ${pageOneTwo}
            
            <li class="col page" data-page="4"><a href="#">4</a></li>
            <li class="col page" data-page="5"><a href="#">5</a></li>
            <li class="col page last-page" data-page="${countPage}"><a href="#">${countPage}</a></li>
            <li class="col  next">NEXT<i class="fa-solid fa-angles-right"></i></li>
            `;
    } else if (countPage >= 6 && pageNow > 3 && pageNow < countPage - 2) {
        navPage.innerHTML = `
            <li class="col prev"><i class="fa-solid fa-angles-left"></i>PREV</li>
            <li class="col page " data-page="1"><a href="#">1</a></li>
            <li class="col page" data-page="${pageNow - 2}"><a href="#">${
        pageNow - 2
        }</a></li>
            <li class="col page" data-page="${pageNow - 1}"><a href="#">${
        pageNow - 1
        }</a></li>
            <li class="col page active" data-page="${pageNow}"><a href="#">${pageNow}</a></li>
            <li class="col page" data-page="${pageNow + 1}"><a href="#">${
        pageNow + 1
        }</a></li>
            <li class="col page" data-page="${pageNow + 2}"><a href="#">${
        pageNow + 2
        }</a></li>
            <li class="col page last-page" data-page="${countPage}"><a href="#">${countPage}</a></li>
            <li class="col  next">NEXT<i class="fa-solid fa-angles-right"></i></li>
            `;
    } else if (countPage >= 6 && pageNow >= countPage - 2) {
        const pageOneTwo =
        pageNow === countPage - 2
            ? ` <li class="col page active" data-page="${
                countPage - 2
            }"><a href="#">${countPage - 2}</a></li>
            <li class="col page" data-page="${countPage - 1}"><a href="#">${
                countPage - 1
            }</a></li>
            <li class="col page last-page" data-page="${countPage}"><a href="#">${countPage}</a></li>`
            : pageNow === countPage - 1
            ? ` <li class="col page" data-page="${countPage - 2}"><a href="#">${
                countPage - 2
            }</a></li>
            <li class="col page active" data-page="${
            countPage - 1
            }"><a href="#">${countPage - 1}</a></li>
            <li class="col page last-page " data-page="${countPage}"><a href="#">${countPage}</a></li>`
            : ` <li class="col page" data-page="${countPage - 2}"><a href="#">${
                countPage - 2
            }</a></li>
            <li class="col page" data-page="${countPage - 1}"><a href="#">${
                countPage - 1
            }</a></li>
            <li class="col page  last-page active" data-page="${countPage}"><a href="#">${countPage}</a></li>`;
        navPage.innerHTML = `
            <li class="col prev"><i class="fa-solid fa-angles-left"></i></li>
            <li class="col page" data-page="1"><a href="#">1</a></li>
            <li class="col page" data-page="${countPage - 4}"><a href="#">${
        countPage - 4
        }</a></li>
            <li class="col page data-page="${countPage - 3}"><a href="#">${
        countPage - 3
        }</a></li>
            ${pageOneTwo}
            <li class="col  next"><i class="fa-solid fa-angles-right"></i></li>
            `;
    }
    },

    product: async function (page = 1, search, limit = 16) {
        const checkSearch = search ? search : "";
        await fetch(`${http}products?page=${page}&limit=${limit}`, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            // search: checkSearch,
          },
        })
          .then((data) => data.json())
          .then((data) => {
            // console.log(data)
            this.render(data);
            this.page(page, limit, data.length);
          })
          .catch((err) => {
            console.log(err);
          })
        //   .finally(() => {
        //     spinner(false);
        //   });
      },
      product_type: async function (page = 1, sort, type="", limit = 16) {
        const sortBy = sort ? sort : "";
            // console.log("valu Soft" ,sortBy)
        await fetch(`${http}products?limit=${limit}&sortBy=${sortBy}&page=${page}`, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
              type
          },
        })
          .then((data) => data.json())
          .then((data) => {
            this.render(data);
            this.page(page, limit,data.length);
          })
          .catch((err) => {
            console.log(err);
          })
      },
        search: async function (search) {
          console.log(search)
        await fetch(`${http}products/search`, {
        headers: {
          "Content-Type": "application/json"
        },
          method:"post",
          body:JSON.stringify({name:search})
        })
          .then((data) => data.json())
          .then((data) => {
            console.log(data)
            this.render(data);
          })
          .catch((err) => {
            console.log(err);
          })
      },
      
        render: function (data) {
        // if (data.success) {
            const productHtml = data.data.map((val, index) => { 
        //    const checkState = val.state
        //       ? `<li class="content">${val.state}</li>`
        //       : "";
            return `
            <div class="product col-lg-4 col-md-6 col-xl-3">
                <div class="item">
                <div class="image">
                <a class="detail-img" data-id=${val._id} href="#">
                    <img src="${val.img}" alt="imagesProduct">
                </a>
                </div>
                <button data-id=${val._id} class="add-cart">Thêm vào giỏ</button>
                </div>
                <div class="content">
                <p class="price">${formatCurrency(val.price)}</p>
                <h4 class="product-name">${val.name}</h4>
                </div>
            </div>
            `;
            });

            $(".wrapper-products").innerHTML = productHtml.join("");
        // } else {
        //     $(".wrapper-products").innerHTML = data.state;
        // }
        },
        
        handlerEvent: function(){
            const pagination = $(".pagination")
            const wrapperDetail = $(".wrapper-products");
            const searchInput = $(".form-search");
            const nav_dropdown = $(".nav-dropdown")
            const _this = this;
            const select = document.getElementById("my-select");
            let sort;
            let typeClick;
            select.addEventListener("change", function() {
              const sortValue = this.options[select.selectedIndex].value ;
              // console.log(value);
                _this.pageInto = 1;
                _this.product_type(_this.pageInto, sortValue,typeClick );
                sort = sortValue;

            });
            //click category (type)

            const ps5_device = $("#ps5-device");
            const ps5_game = $("#ps5-game");
            const ps5_accessory = $("#ps5-accessory");
            const ps4_device = $("#ps4-device");
            const ps4_game = $("#ps4-game");
            const ps4_accessory = $("#ps4-accessory");
            const xbox_device = $("#xbox-device");
            const xbox_game = $("#xbox-game");
            const xbox_accessory = $("#xbox-accessory");
            const switch_device = $("#switch-device");
            const switch_game = $("#switch-game");
            const switch_accessory = $("#switch-accessory");

            const all =$("#all")
            all.onclick = function(e)
            {
              _this.product_type();
              e.preventDefault();  
                const type = "";
                _this.pageInto = 1;
                _this.product_type(_this.pageInto,sort, type );
                typeClick=type;
            }
            ps5_game.onclick = function(e)
            {
              _this.product_type();
              e.preventDefault();  
                const type = "Game%20PS5";
                _this.pageInto = 1;
                _this.product_type(_this.pageInto,sort, type );
                typeClick=type;
            }          
            ps5_device.onclick = function(e)
            {
              _this.product_type();
              e.preventDefault();  
                const type = "M%C3%A1y%20PS5";
                _this.pageInto = 1;
                _this.product_type(_this.pageInto,sort, type );
                typeClick=type;
            }
            ps5_accessory.onclick = function(e)
            {
              _this.product_type();
              e.preventDefault();  
                const type = "Ph%E1%BB%A5%20ki%E1%BB%87n%20PS5";
                _this.pageInto = 1;
                _this.product_type(_this.pageInto,sort, type );
                typeClick=type;
            }
            ps4_game.onclick = function(e)
            {
              _this.product_type();
              e.preventDefault();  
                const type = "Game%20PS4";
                _this.pageInto = 1;
                _this.product_type(_this.pageInto,sort, type );
                typeClick=type;
            }          
            ps4_device.onclick = function(e)
            {
              _this.product_type();
              e.preventDefault();  
                const type = "M%C3%A1y%20PS4";
                _this.pageInto = 1;
                _this.product_type(_this.pageInto,sort, type );
                typeClick=type;
            }
            ps4_accessory.onclick = function(e)
            {
              _this.product_type();
              e.preventDefault();  
                const type = "Ph%E1%BB%A5%20ki%E1%BB%87n%20PS4";
                _this.pageInto = 1;
                _this.product_type(_this.pageInto,sort, type );
                typeClick=type;
            }
            switch_game.onclick = function(e)
            {
              _this.product_type();
              e.preventDefault();  
                const type = "Game%20Nintendo%20Switch";
                _this.pageInto = 1;
                _this.product_type(_this.pageInto,sort, type );
                typeClick=type;
            }          
            switch_device.onclick = function(e)
            {
              _this.product_type();
              e.preventDefault();  
                const type = "M%C3%A1y%20Nintendo%20Switch";
                _this.pageInto = 1;
                _this.product_type(_this.pageInto,sort, type );
                typeClick=type;
            }
            switch_accessory.onclick = function(e)
            {
              _this.product_type();
              e.preventDefault();  
                const type = "Ph%E1%BB%A5%20ki%E1%BB%87n%20Nintendo%20Switch";
                _this.pageInto = 1;
                _this.product_type(_this.pageInto,sort, type );
                typeClick=type;
            }
            xbox_game.onclick = function(e)
            {
              _this.product_type();
              e.preventDefault();  
                const type = "Game%20XBOX%20SERIES";
                _this.pageInto = 1;
                _this.product_type(_this.pageInto,sort, type );
                typeClick=type;
            }          
            xbox_device.onclick = function(e)
            {
              _this.product_type();
              e.preventDefault();  
                const type = "M%C3%A1y%20XBOX%20SERIES";
                _this.pageInto = 1;
                _this.product_type(_this.pageInto,sort, type );
                typeClick=type;
            }
            xbox_accessory.onclick = function(e)
            {
              _this.product_type();
              e.preventDefault();  
                const type = "Ph%E1%BB%A5%20Ki%E1%BB%87n%20XBOX%20SERIES";
                _this.pageInto = 1;
                _this.product_type(_this.pageInto,sort, type );
                typeClick=type;
            }                
            // click detail image
            wrapperDetail.onclick= function(e){
              e.preventDefault();
              const detailImg = e.target.closest(".detail-img");
              const detailName = e.target.closest(".product-name");
              const btnAddCart = e.target.closest(".add-cart");
                const detail = detailImg;
                if (detail) {
                    const idProduct = detail.dataset.id;
                    window.location.href = `./detail.html?idpd=${idProduct}`;
                  }
                  if(btnAddCart){
                    const id = btnAddCart.dataset.id;
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
                        body: JSON.stringify({id,quantity:1})
                      })
                      .then((data)=>data.json())
                      .then((data)=>{
                        // console.log(data)
                        if(data.success)
                        {
                          alertFullil("Thêm sản phẩm thành công");
                          U_quantityCart();
                        }
                        else{
                          alertFail();
                        }
                      })
                      .catch(()=>{
                        alertFail();
                      })
                    
                  }

            };


            //pagination
            pagination.onclick = function (e) {
                e.preventDefault();
                const page = e.target.closest(".page");
                const prev = e.target.closest(".prev");
                const next = e.target.closest(".next");
                if (prev) {
                  if (_this.pageInto > 1) {
                    _this.pageInto = _this.pageInto - 1;
                    _this.product(_this.pageInto, _this.searching);
                    // spinner();
                  }
                }
                if (next) {
                  const countLastPage = this.children.length;
                  const lastpage = Number(
                    this.children[countLastPage - 2].dataset.page,
                  );
                  if (_this.pageInto < lastpage) {
                    _this.pageInto = _this.pageInto + 1;
                    _this.product(_this.pageInto, _this.searching);
                    // spinner();
                  }
                }
                if (page) {
                  [...this.children].forEach((val) => {
                    val.classList.remove("active");
                  });
                  _this.pageInto = Number(page.dataset.page);
                  _this.product(_this.pageInto, _this.searching);
                //   spinner();
                }
              };
              searchInput.onsubmit = function (e) {
                e.preventDefault();
                const getInfo = this.elements["search"].value;
                _this.searching = getInfo;
                _this.pageInto = 1;
                _this.search( _this.searching);
              };
        },


        // Call all function
        start: function () {
            // spinner(false);
            this.product(this.pageInto, this.searching);
            this.handlerEvent();
            // this.render(this.data);
          },
    };
    products.start();
});