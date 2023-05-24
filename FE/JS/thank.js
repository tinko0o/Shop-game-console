const $ = document.querySelector.bind(document);
const momo = JSON.parse(localStorage.getItem("Momo"))||null;
const http = "http://localhost:8080/api/";
const User = JSON.parse(localStorage.getItem("loginUser"));
async function oder(data){
    await fetch(`${http}oders/create`,{
        headers: {                     
        "Content-type": "application/json; charset=UTF-8",
        authentication: User.token,},
        method:"post",
        body:JSON.stringify(data) 
    })
    .then((data) => data.json())
    .then((data) => {
      if(!data.success){
        // alertFail(data?.message);
      }else{
        // alertFullil(data?.message);
        window.location.replace("./thank.html");
      }
    })
}
if(momo?.isMomo){
    console.log(momo.data);
    oder(momo.data)
    localStorage.removeItem("Momo")
}
window.addEventListener("load",function(){
    this.setTimeout(()=>{
        this.window.location.replace("./index.html")
    },4000)
    $(".btn-back").addEventListener("click",function(){
        window.location.replace("./index.html")
    })
})