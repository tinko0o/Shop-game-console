// slide form
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () =>
    container.classList.add('right-panel-active'));

signInButton.addEventListener('click', () =>
    container.classList.remove('right-panel-active'));
// ------------------------

// const signinBtn = document.querySelector(".signin-btn");
// const signupBtn = document.querySelector(".signup-btn");
// const formBx = document.querySelector(".form-bx");
// const wrapperForm = document.querySelector(".wrapper-form");
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const alertSuccess = $(".alert-primary");
const alertDanger = $(".alert-danger");
const formSignin = $(".get-signin");
const formSignup = $(".get-signup");
const http = "http://localhost:8080/api/users/";
const checkRegister = JSON.parse(localStorage.getItem("register"));

//LOGIN----------
async function login(data){
  await fetch(`${http}login`,{
    method:"POST",
    headers:{
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((response)=> response.json())
  .then((data)=>{
    if(!data.success){
      alertDanger.children[0].textContent = `${data.message}`;
      alertDanger.classList.add("get-active");
      setTimeout(() => {
        alertDanger.classList.remove("get-active");
      }, 2000);
    }else{
      localStorage.setItem(
        "loginUser",
        JSON.stringify({data:data.data , token:data.token})
      );
      // window.location.replace("./index.html");
      alert("login Success")
    }
    // checkAdmin
    const User = JSON.parse(localStorage.getItem("loginUser"));
    console.log(User.data.admin)
    if(User.data.admin){
      window.location.replace("./admin.html");
    }
    else{
      window.location.replace("./index.html");
    }
  })
  .catch((error)=>{
    console.error("Error:", error);
    alertDanger.classList.add("get-active");
    setTimeout(() => {
      alertDanger.classList.remove("get-active");
    }, 2000);
  });
}
//REGISTER---------------
async function register(data){
  try {
    await fetch(`${http}register`, {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.success) {
          alertDanger.children[0].textContent = `${response.message}`;
          alertDanger.classList.add("get-active");
          setTimeout(() => {
            alertDanger.classList.remove("get-active");
          }, 3000);
        } else {
          alertSuccess.children[0].textContent = `Register successfuly`;
          alertSuccess.classList.add("get-active");
          setTimeout(() => {
            alertSuccess.classList.remove("get-active");
          }, 3000);
          signInButton.click();
          // formSignin.elements["email"].value = data.email;
          // formSignin.elements["password"].value = data.password;
          // Confirm SIGN_IN
          $(".l-email").value= data.email;
          $(".l-password").value= data.password;
          // clear SiGN_UP
          $(".r-email").value = "";
          $(".r-username").value ="";
          $(".r-password").value="";
          $(".confirm").value="";
          fetch(`${http}statistic`)
            .then((data) => data.json())
            .then((data) => {
              if (data.success) {
                const users = data.data[0].users + 1;
                fetch(`${http}statistic`, {
                  method: "PUT", // or 'PUT'
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ users }),
                });
              }
            });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.log(error);
    alertDanger.classList.add("get-active");
    setTimeout(() => {
      alertDanger.classList.remove("get-active");
    }, 2000);
  }
}




window.addEventListener("load",function(e){
  formSignin.addEventListener("submit", function (e) {
    e.preventDefault();
    // const email = this.elements["email"].value;
    // const password = this.elements["password"].value;
    const email = $(".l-email").value;
    const password = $(".l-password").value;
    console.log(email,password)
    const data = {
      email,
      password,
    };
    login(data);
  });
  formSignup.addEventListener("submit", function (e) {
    e.preventDefault();
    // const email = this.elements["email"].value;
    // const username = this.elements["username"].value;
    // const password = this.elements["password"].value;
    // const confirm = this.elements["confirm"].value;
    const email = $(".r-email").value;
    const name = $(".r-username").value;
    const password = $(".r-password").value;
    const confirm = $(".confirm").value;
    if (password === confirm) {
      const data = {
        name ,
        email,
        password,
      };
      console.log(data)
      register(data);
    } else {
      alertDanger.children[0].textContent =
        "The password doesn't match the comfirm";
      alertDanger.classList.add("get-active");
      setTimeout(() => {
        alertDanger.classList.remove("get-active");
      }, 3000);
    }
  });
})

























// $(".btn-submit-register").click(function (e) {
//     e.preventDefault();
//     let checkPassword=true;
//     let checkUser=true;
//     let checkEmail=true;
//     fetch("http://localhost:8080/api/user/register")
//     .then((data)=>data.json())
//     .then((result)=>{
//         let dataUser = {
//             name: "",
//             email: "",
//             password: "",
//             carts: [],
//           };
//         dataUser.name=$(".r-username-input").val().trim();
//         dataUser.name=$(".r-username-input").val().trim();
//         dataUser.name=$(".r-username-input").val().trim();
//         if (
//             dataUser.email === "" ||
//             dataUser.name === "" ||
//             dataUser.password === "" ||
//             document.querySelector("#regis-check").checked === false
//           ) { 
//             alert("Invalid value");
//           }
//         else if(dataUser.password != $(".r-repeat-password-input").val().trim()){
//             alert("The Password is different from the Confirm !");
//             checkPassword=false;
//         }
//         else {
//             const findNameUser = result.findIndex(
//               (val) => val.name === dataUser.name
//             );
//             const findEmailUser = result.findIndex(
//               (val) => val.email === dataUser.email
//             );
//             if (findEmailUser !== -1) {
//               alert("Email already exists");
//               checkEmail=false;
//             }
//             if (findNameUser !== -1 && checkEmail === true) {
//               alert("Username already exists");
//               checkUser = false;
//             }
//           }
//         if(
//             checkPassword === true &&
//             checkUser === true &&
//             checkEmail === true
//         ){
//             let newUser = {...dataUser};
//             $.ajax({
//                 type: "POST",
//                 url: "https://getuser.vercel.app/api/register",
//                 data: JSON.stringify(newUser),
//                 contentType: "application/json",
//                 dataType: "json",
//                 success: function () {
//                   localStorage.setItem("loginUser", JSON.stringify(dataUser));
//                   window.location.replace("../login/login.html");
//                 },
//                 error: function () {
//                   alert("Something was wrong");
//                   $("body").find(".form-loading").remove();
//                 },
//             })
//         }

//     })
// })