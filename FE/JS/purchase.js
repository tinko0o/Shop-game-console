const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));
const http = "http://localhost:8080/api/";
const userID = User?.data.idUser;
import { header, formatCurrency, alertFullil, alertFail } from "./header.js";
//console.log
function log(value) {
  console.log(`${value}: `, value)
}
// format daytime
function formatDate(date) {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

function formattedDate(date) {
  const dated = new Date(`${date}`)
  return formatDate(dated)
};
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
async function cancelOder(id) {
  await fetch(`${http}oders/cancel/${id}`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User?.token,
    },
    method: "put",
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.success) {
        alertFullil(data.message)
        getPurchased()
      }
      else {
        alertFail(data.message)
      }
    })
    .catch((err) => {
      console.log(err);
    })
}
function rateStar(productId, orderId, rating) {
  return fetch(`${http}ratings/add`, {
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authentication: User?.token,
    },
    method: "post",
    body: JSON.stringify({ productId, orderId, rating }),
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.success) {
        return Promise.resolve(data); // Trả về Promise với giá trị data thành công
      } else {
        return Promise.reject(data); // Trả về Promise với giá trị data thất bại
      }
    })
    .catch(() => {
      return Promise.reject(); // Trả về Promise với giá trị thất bại
    });
}
function renderPuchase(data) {
  const html = data.data.map((val, index) => {
    let count = 0;
    let status = val.status
    const cancelBtn = status == "Đang chờ" ? `<button data-id="${val._id}" class="btn btn-secondary btn-cancel">Hủy Đơn</button>`:""  
    const producthtml = val.products.map((v, i) => {
      count = count + v.quantity;
      const ratingClass = v.rating > 0 ? "disabled" : "";
      const ratingButton = status == "Đã giao" ? v.rating > 0 ? " " : `<button class="btn btn-rate">Rating</button>` :"";
      return `
        <div data-id="${v.id}" class="product">
          <img src="${v.img}" alt="">
          <div class="p-name">
            <h4 class="name-product">${v.name}</h4>
            <span class="quantity">${v.quantity}</span>
          </div>
          <p class="p-total">${v.price}</p>
          <div data-id="${v.id}" data-rating="${v.rating}" class="stars-rating ${ratingClass}">
            <i class="fa-sharp fa-solid fa-star"></i>
            <i class="fa-sharp fa-solid fa-star"></i>
            <i class="fa-sharp fa-solid fa-star"></i>
            <i class="fa-sharp fa-solid fa-star"></i>
            <i class="fa-sharp fa-solid fa-star"></i>
          </div>
          ${ratingButton}
        </div>
      `;
    });
    return `
      <div class="block">
        <div class="address d-flex justify-content-between">
          <div class="address-content d-block">
          <p class="p-createdAt"><strong>Đặt vào:</strong>${formattedDate(val.createdAt)}</p>
            <p class="p-address"><strong>Địa chỉ:</strong>${val.address}</p>
            
          </div>
          <div class="total d-block">
            <p class="t-quantity"><strong>Số sản phẩm:</strong>${count}</p>
            <p class="t-price"><strong>Tổng tiền:</strong>${formatCurrency(val.total)}</p>
          </div>
          <div class="status d-block">
            <p class="s-status"><strong>Trang thái:</strong>${val.status}</p>
            <hr style="margin-bottom: 0; color: white;">
            ${cancelBtn}
          </div>
        </div>
        <hr>
        <div data-id="${val._id}" class="products">
          ${producthtml.join("")}
        </div>
      </div>
    `;
  });
  $(".purchased").innerHTML = html.join("");

}
function handleRatingClick(event) {
  const starElement = event.target.closest(".stars-rating .fa-star");
  if (starElement) {
    // const rating = starsContainer.dataset.rating;
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
function refeshRate() {
  const starsRatingElements = document.querySelectorAll('.stars-rating');
  starsRatingElements.forEach(starsRatingElement => {
    const rating = parseInt(starsRatingElement.dataset.rating);
    // console.log(starsRatingElements)
    // Xóa tất cả lớp 'filled' của các sao trước khi đặt lại
    starsRatingElement.querySelectorAll('i').forEach(starElement => {
      starElement.classList.remove('filled');
    });

    // Đặt lớp 'filled' cho số sao tương ứng với giá trị rating
    for (let i = 0; i < rating; i++) {
      const starElement = starsRatingElement.querySelector(`i:nth-child(${i + 1})`);
      if (starElement) {
        starElement.classList.add('filled');
      }
    }
  });
}
window.addEventListener("load", function (e) {

  getPurchased();
  header();
  setTimeout(() => {
    refeshRate();
  }, 1000);

  const purchased = $(".purchased");
  purchased.addEventListener('click', function (e) {
    const products = e.target.closest('.products')
    const product = e.target.closest('.product')
    const stars = e.target.closest(".stars-rating .fa-star")
    const rate = e.target.closest(".btn-rate")
    const img = e.target.closest("img")
    const name = e.target.closest(".name-product")
    const btnCancel = e.target.closest(".btn-cancel")
    if (stars) {
      handleRatingClick(e);
    }
    if (rate) {
      const id = product.dataset.id;
      const idoder = products.dataset.id;
      const rateNumber = +product.querySelector(".stars-rating").dataset.rating + 1;

      rateStar(id, idoder, rateNumber)
        .then((data) => {
          if (data.success) {
            alertFullil(data.message);
            rate.remove();
          } else {
            alertFail(data.message);
          }
        })
        .catch((err) => {
          alertFail(err);
        });
    }
    if (img || name) {
      const id = product.dataset.id;
      window.location.href = `./detail.html?idpd=${id}`
    }
    if (btnCancel) {
      const id = btnCancel.dataset.id;
      // log(id)
      cancelOder(id)
    }

  });

})