const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));
const alertSuccess = $(".alert-primary");
const alertDanger = $(".alert-danger");
const http = "http://localhost:8080/api/";
export function header(){
    //show user
    if (User) {
        const showUser = $(".user");
        // console.log(User.data?.name)
        showUser.innerHTML = `<i class="fa-solid fa-user"></i> ${User.data?.name}
        <ul class="dropdown-user">
        <li class="profile">
          <div class="btn-group dropstart">
            <button type="button" class=" dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              Your profile
            </button>
            <ul class="dropdown-menu">

              <li>Name: ${User.data?.name}</li>
              <li>Email:${User.data?.email}</li>
              <li>phone:023234234</li>
              <li class="Change">Change Password
                <div class="dropdown-pass">
                  <form action="#">
                    <input type="text"placeholder="Old Password">
                    <input type="text"placeholder="New Password">
                    <input type="text"placeholder="Repeat new Password">
                    <button class="btn btn-dark btn-changePass" type="submit">Change</button>
                  </form> 
                </div>
              </li>
              <li>
                <div class="btn-group dropstart">
                  <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    Edit Profile
                  </button>
                  <ul class="dropdown-menu">

                    Edit
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </li>
        <li class="purchase"><a href="./purchase.html">Purchase</a></li>
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
export  function alertFullil(message="success") {
  alertSuccess.children[0].textContent = `${message}`;
  alertSuccess.classList.add("get-active");
  setTimeout(() => {
    alertSuccess.classList.remove("get-active");
  }, 1500);
}

export  function alertFail(message="Something fail!") {
  alertDanger.children[0].textContent = `${message}`;
  alertDanger.classList.add("get-active");
  setTimeout(() => {
    alertDanger.classList.remove("get-active");
  }, 1500);
}
//formatCurrency
export  function formatCurrency(price, symbol = "đ") {
  var DecimalSeparator = Number('1.2').toLocaleString().substr(1, 1);
  var priceWithCommas = price.toLocaleString();
  var arParts = String(priceWithCommas).split(DecimalSeparator);
  var intPart = arParts[0];
  var decPart = arParts.length > 1 ? arParts[1] : '';
  decPart = (decPart + '000').substr(0, 3);
  return intPart + symbol;
}
// UPdate Quantity Cart
// export function U_quantityCart(){
//   console.log(User?.token)
//   if(User){
//     fetch(`${http}carts/cart/amount`,{
//       headers:{
//         "Content-type": "application/json; charset=UTF-8",
//         authentication: User?.token,                         
//       },
//       // method:"post",
//       // body: JSON.stringify({_id,quantity:1})
//     })
//     .then((data)=>data.json())
//     .then((data)=>{
//       if(data.success)
//       {
//         cartQuantities.innerHTML = data?.data;
//       }
//       else{
//         header().logoff.click();
//       }
//     })
//     .catch(()=>{
//       alertFail();
//     })
//   }else{
//     cartQuantities.innerHTML = "";
//   }
// }