const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));
const alertSuccess = $(".alert-primary");
const alertDanger = $(".alert-danger");
const http = "http://localhost:8080/api/";

//console.log
function log(value) {
  console.log(`${value}: `,value)
}
//alert
function alertFullil(message="success") {
  alertSuccess.children[0].textContent = `${message}`;
  alertSuccess.classList.add("get-active");
  setTimeout(() => {
    alertSuccess.classList.remove("get-active");
  }, 1000);
}

function alertFail(message="Something fail!") {
  alertDanger.children[0].textContent = `${message}`;
  alertDanger.classList.add("get-active");
  setTimeout(() => {
    alertDanger.classList.remove("get-active");
  }, 1000);
}
async function getUser() {
    await fetch(`${http}users/user`, {
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        authentication: User?.token, 
      },
    })
      .then((data) => data.json())
      .then((data) => {
      log(data)
    //   renderPuchase(data);
    $("#name").value = data.data?.name
    $("#email").value = data.data?.email
    data.data?.phone?$("#phone").value = data.data?.phone:""
    data.data?.city?$("#city").value = data.data?.city:""
    data.data?.district?$("#district").value = data.data?.district:""
    data.data?.wards?$("#ward").value = data.data?.wards:""
    data.data?.streetAndHouseNumber?$("#street").value = data.data?.streetAndHouseNumber:""
      })
      .catch((err) => {
        console.log(err);
      })
}
function updateUser(phone, city, district, wards,  streetAndHouseNumber){

    fetch(`${http}users/user/update/`,{
      headers:{
        "Content-type": "application/json; charset=UTF-8",
        authentication: User?.token,                         
      },
      method:"put",
      body: JSON.stringify({phone, city, district, wards,  streetAndHouseNumber})
    })
    .then((data)=>data.json())
    .then((data)=>{
      if(data.success)
      {
        alertFullil(data.message)
        getUser()
      }
      else{
        alertFail(data.message)

      }
    })
    .catch(()=>{
      alertFail();
    })

}
getUser();
window.addEventListener("load", function(){
  const btnUpdate = document.querySelector(".update");
  btnUpdate.addEventListener("click", function(){
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const city = document.getElementById("city").value;
    const district = document.getElementById("district").value;
    const ward = document.getElementById("ward").value;
    const streetAndHouseNumber = document.getElementById("street").value;
    // console.log(phone, city, district, ward, streetAndHouseNumber);
    updateUser(phone, city, district, ward, streetAndHouseNumber)
  });
});