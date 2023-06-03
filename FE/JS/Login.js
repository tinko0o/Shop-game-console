import {alertFullil,alertFail} from "./header.js";
// slide form
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const alertSuccess = $(".alert-primary");
const alertDanger = $(".alert-danger");
const formSignin = $(".get-signin");
const http = "http://localhost:8080/api/users/";
const checkRegister = JSON.parse(localStorage.getItem("register"));
signUpButton.addEventListener('click', () =>{
  $(".sign-up-container").innerHTML=htmlSignUp
  container.classList.add('right-panel-active')
  
  const formSignup = $(".get-signup");
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
        "Mật khẩu không khớp!";
      alertDanger.classList.add("get-active");
      setTimeout(() => {
        alertDanger.classList.remove("get-active");
      }, 3000);
    }
  });
});

signInButton.addEventListener('click', () =>
    container.classList.remove('right-panel-active'));
// ------------------------

// const signinBtn = document.querySelector(".signin-btn");
// const signupBtn = document.querySelector(".signup-btn");
// const formBx = document.querySelector(".form-bx");
// const wrapperForm = document.querySelector(".wrapper-form");

const forgot= $(".forgot")
const htmlForgot = `
        <label>
            <input type="text" class="f-token" placeholder="Nhập key xác nhận" pattern=".{4,}"
                title="Bốn ký tự trở lên" />
        </label>
        <label>
            <input type="password" class="f-password" placeholder="Mật khẩu"
                
                title="Phải chứa ít nhất một số và một chữ hoa và chữ thường, và ít nhất 8 ký tự trở lên" />
        </label>
        <label>
            <input type="password" class="f-confirm" placeholder="Xác nhận mật khẩu" />
        </label>
        <button class="btn-submit-register" style="margin-top: 9px">Lấy lại mật khẩu</button>

`
const htmlSignUp=`
      <form class="get-signup" autocomplete="on" action="#">
          <h1>Đăng ký</h1>
          <div class="social-container">
          </div>
          <span></span>
          <label>
              <input type="text" class="r-username" placeholder="Họ tên" pattern=".{4,}"
                  title="Bốn ký tự trở lên" required/>
          </label>
          <label>
              <input type="email" class="r-email" placeholder="Email" required/>
          </label>
          <label>
              <input type="password" class="r-password" placeholder="Mật khẩu"
                  
                  title="Phải chứa ít nhất một số và một chữ hoa và chữ thường, và ít nhất 8 ký tự trở lên" required/>
          </label>
          <label>
              <input type="password" class="confirm" placeholder="Xác nhận mật khẩu" required/>
          </label>
          <button class="btn-submit-register" style="margin-top: 9px">Đăng ký</button>
      </form>
`
const htmlSendEmail=`
    <form class="get-forgot" autocomplete="on" action="#">
        <h1>Quên mật khẩu</h1>
        <div class="social-container">
        </div>
        <span></span>
        <label>
            <input type="email" class="f-email" placeholder="Email" />
        </label>
        <button class="btn-send" style="margin-top: 9px">Gửi email xác nhận</button>  
    </form>
`
forgot.addEventListener('click',function(e){
  signUpButton.click()
  $(".sign-up-container").innerHTML=htmlSendEmail
  const fForgot = $(".get-forgot")
  fForgot.addEventListener('submit',async function(e){
    e.preventDefault();
    const btnSend = $(".btn-send")
    if(btnSend){
      const email = $(".f-email").value
      // console.log(email);
      // getForgotToken(email)
     await fetch(`${http}user/forgetPassword`,{
    method:"post",
    headers:{
      "Content-Type": "application/json",
    },
    body:JSON.stringify({email})
  })
    .then((data) => data.json())
    .then((data) => {
      if(!data.success){
        alertFail(data.message)
      }else{
        alertFullil(data.message,4000)
        btnSend.setAttribute("disabled", "disabled");
        btnSend.insertAdjacentHTML('afterend', htmlForgot);
        btnSend.remove()
        $(".f-email").setAttribute("disabled", "disabled");
      }
    })
    .catch((err) => {
      alertFail(err);
    });
    }
      const resetToken = $(".f-token").value
      const password = $(".f-password").value
      const confirmPassword = $(".f-confirm").value
      resetPassword(resetToken, password, confirmPassword);


  })
})
function resetPassword(resetToken, password, confirmPassword){
  fetch(`${http}user/resetPassword`,{
    headers:{
      "Content-type": "application/json; charset=UTF-8",                     
    },
    method:"put",
    body: JSON.stringify({resetToken, password, confirmPassword})
  })
  .then((data)=>data.json())
  .then((data)=>{
    if(data.success)
    {
      alertFullil(data.message)
      signInButton.click()
    }
    else{
      alertFail(data.message,2000)
    }
  })
  .catch(()=>{
    alertFail();
  })
}

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
      // alert("login Success")
    }
    // checkAdmin
    const User = JSON.parse(localStorage.getItem("loginUser"));
    // console.log(User.data.admin)
    if(User.data.isAdmin){
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
          alertSuccess.children[0].textContent = `Đăng ký thành công,bạn cần xác minh tài khoản trước khi đăng nhập nhé`;
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
  // formSignup.addEventListener("submit", function (e) {
  //   e.preventDefault();
  //   console.log("asdsad");
  //   // const email = this.elements["email"].value;
  //   // const username = this.elements["username"].value;
  //   // const password = this.elements["password"].value;
  //   // const confirm = this.elements["confirm"].value;
  //   const email = $(".r-email").value;
  //   const name = $(".r-username").value;
  //   const password = $(".r-password").value;
  //   const confirm = $(".confirm").value;
  //   if (password === confirm) {
  //     const data = {
  //       name ,
  //       email,
  //       password,
  //     };
  //     console.log(data)
  //     // register(data);
  //   } else {
  //     alertDanger.children[0].textContent =
  //       "Mật khẩu không khớp!";
  //     alertDanger.classList.add("get-active");
  //     setTimeout(() => {
  //       alertDanger.classList.remove("get-active");
  //     }, 3000);
  //   }
  // });
})





















