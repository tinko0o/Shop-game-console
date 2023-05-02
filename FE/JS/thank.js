const $ = document.querySelector.bind(document);

window.addEventListener("load",function(){
    this.setTimeout(()=>{
        this.window.location.replace("./index.html")
    },4000)
    $(".btn-back").addEventListener("click",function(){
        window.location.replace("./index.html")
    })
})