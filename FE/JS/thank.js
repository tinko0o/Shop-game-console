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
function getSearchParameters() {
    var prmstr = window.location.search.substring(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
  }
  function transformToAssocArray(prmstr) {
    var params = {};
    var prmarr = prmstr.split("&");
    for (var i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split("=");
      params[tmparr[0]] = tmparr[1];
    }
    return params;
  }
  const messageUrl =getSearchParameters().message? getSearchParameters().message.split("+").join(""):""
  const decodeMessage = decodeURIComponent(messageUrl)
  if(decodeMessage.includes("Giaodịchbịtừchốibởingườidùng")){
    const html =`
            <img disabled src="./img/pngegg_62_Fe7.png" alt="">
            <h1>Bạn chưa thanh toán, giỏ hàng vẫn còn nguyên vẹn</h1>
            <hr>
            <p>Sẽ quay lại trang chủ trong vài giây</p>
            <button class="btn-back">Quay lại trang chủ ngay</button>
    `
    $(".container").innerHTML = html
  }else{
    if(momo?.isMomo){
        oder(momo.data)
        localStorage.removeItem("Momo")
    }
  }
// if(momo?.isMomo){
//     console.log(momo.data);
//     oder(momo.data)
//     localStorage.removeItem("Momo")
// }
window.addEventListener("load",function(){
    this.setTimeout(()=>{
        this.window.location.replace("./index.html")
    },4000)
    $(".btn-back").addEventListener("click",function(){
        window.location.replace("./index.html")
    })
})