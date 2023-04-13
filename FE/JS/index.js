// const { json } = require("body-parser");
// const { join } = require("path");
// const { default: header } = require("./header");
// import header from "./header";
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));
const http = "http://localhost:8080/api/";
const userID = User?.data.idUser;


function header(){
    //show user
    if (User) {
        const showUser = $(".user");
        console.log(User.data?.username)
        showUser.innerHTML = `<i class="fa-solid fa-user"></i> ${User.data?.username}
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

window.addEventListener("load",function(){
    header();
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
    navPage.innerHTML = `<li class="col prev"><i class="fa-solid fa-angles-left"></i></li>
            <li class="col  next"><i class="fa-solid fa-angles-right"></i></li>`;
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
            <li class="col prev"><i class="fa-solid fa-angles-left"></i></li>
            ${pageOneTwo}
            
            <li class="col page" data-page="4"><a href="#">4</a></li>
            <li class="col page" data-page="5"><a href="#">5</a></li>
            <li class="col page last-page" data-page="${countPage}"><a href="#">${countPage}</a></li>
            <li class="col  next"><i class="fa-solid fa-angles-right"></i></li>
            `;
    } else if (countPage >= 6 && pageNow > 3 && pageNow < countPage - 2) {
        navPage.innerHTML = `
            <li class="col prev"><i class="fa-solid fa-angles-left"></i></li>
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
            <li class="col  next"><i class="fa-solid fa-angles-right"></i></li>
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

    product: async function (page = 1, search, limit = 8) {
        const checkSearch = search ? search : "";
        await fetch(`${http}products?page=${page}&limit=${limit}`, {
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            search: checkSearch,
          },
        })
          .then((data) => data.json())
          .then((data) => {
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
    // product: async function (page = 1, search, limit = 8) {
    //     this.render(data)
    //     this.page(page, limit, data.length);
    // },


        render: function (data) {
        // if (data.success) {
            const productHtml = data.data.map((val, index) => { 
        //    const checkState = val.state
        //       ? `<li class="content">${val.state}</li>`
        //       : "";
        console.log(val.img)
            return `
            <div class="product col-lg-4 col-md-6 col-xl-3">
                <div class="item">
                <a data-id=${val._id} href="#">
                    <img src="${val.img}" alt="imagesProduct">
                </a>
                <button data-id=${val._id} class="add-cart">Add to cart</button>
                </div>
                <div class="content">
                <p class="price">${val.price}</p>
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
        start: function () {
            // spinner(false);
            this.product(this.pageInto, this.searching);
            // this.handlerEvent();
            // this.render(this.data);
          },
    };
    products.start();
});