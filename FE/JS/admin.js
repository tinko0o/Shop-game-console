const $ = document.querySelector.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));

document.addEventListener("DOMContentLoaded", function(event) {
    const showNavbar = (toggleId, navId, bodyId, headerId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId)
    // Validate that all variables exist
    if(toggle && nav && bodypd && headerpd){
    toggle.addEventListener('click', ()=>{
        console.log("hehe")
    // show navbar
    nav.classList.toggle('show')
    // change icon
    toggle.classList.toggle('fa-xmark')
    // add padding to body
    bodypd.classList.toggle('body-pd')
    // add padding to header
    headerpd.classList.toggle('body-pd')
    })
    }
    }
    
    showNavbar('header-toggle','nav-bar','body-pd','header')
    
    /*===== LINK ACTIVE =====*/
    const linkColor = document.querySelectorAll('.nav_link')
    
    function colorLink(){
    if(linkColor){
    linkColor.forEach(l=> l.classList.remove('active'))
    this.classList.add('active')
    }
    }
    linkColor.forEach(l=> l.addEventListener('click', colorLink))
    
     // Your code to run since DOM is loaded and ready
     const nameUser= $(".nav_logo-name")
    if(User){
        nameUser.textContent = User.data?.name;
    }
    // phan trang dash vs user
    const nav_user = $(".nav-user");
    const nav_dash = $(".nav-dash");
    const mainUser = $(".main-user")
    const mainDash = $(".main-dashboard")
    nav_user.onclick = function(e){
        mainUser.classList.add("nav-active")
        mainDash.classList.remove("nav-active")
    }
    nav_dash.onclick = function(e){
        mainDash.classList.add("nav-active")
        mainUser.classList.remove("nav-active")
    }

    });

