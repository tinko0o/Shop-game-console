const { json } = require("body-parser");
const { join } = require("path");

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));
const http = "http://localhost:8080/api/";
const userID = User?.data.idUser;

async function checkAdmin(){
    await fetch(`${http}users/check`,{
        headers:{
            "Content-Type": "application/json",
            authentication: User.token,
        },
    })
    .then((data)=>data.json())
    .then((data)=>{
        if(data.success && data.data ){
            console.log("isadmin")
            window.location.replace("./admin.html");
        }
    })
}
checkAdmin();