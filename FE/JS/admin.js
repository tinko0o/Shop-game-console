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
    // Main User
    
    // document.addEventListener("DOMContentLoaded", function() {
    //     var tooltipElements = document.querySelectorAll('[data-toggle="tooltip"]');
    //     for (var i = 0; i < tooltipElements.length; i++) {
    //       tooltipElements[i].addEventListener("mouseover", function() {
    //         var tooltipText = this.getAttribute("title");
    //         var tooltip = document.createElement("div");
    //         tooltip.innerHTML = tooltipText;
    //         tooltip.classList.add("tooltip");
    //         this.appendChild(tooltip);
    //       });
    //       tooltipElements[i].addEventListener("mouseout", function() {
    //         var tooltip = this.querySelector(".tooltip");
    //         this.removeChild(tooltip);
    //       });
    //     }
      
    //     var actions = document.querySelector("table td:last-child").innerHTML;
      
    //     var addNewButton = document.querySelector(".add-new");
    //     addNewButton.addEventListener("click", function() {
    //       this.disabled = true;
    //       var index = document.querySelectorAll("table tbody tr").length - 1;
    //       var row = '<tr>' +
    //                 '<td><input type="text" class="form-control" name="name" id="name"></td>' +
    //                 '<td><input type="text" class="form-control" name="department" id="department"></td>' +
    //                 '<td><input type="text" class="form-control" name="phone" id="phone"></td>' +
    //                 '<td>' + actions + '</td>' +
    //                 '</tr>';
    //       var table = document.querySelector("table");
    //       table.insertAdjacentHTML("beforeend", row);
    //       var newAddButton = document.querySelectorAll(".add, .edit")[index + 1];
    //       newAddButton.classList.toggle("hidden");
    //       var newEditButton = document.querySelectorAll(".add, .edit")[index + 2];
    //       newEditButton.classList.toggle("hidden");
    //       var newInputs = document.querySelectorAll("table tbody tr")[index + 1].querySelectorAll('input[type="text"]');
    //       for (var i = 0; i < newInputs.length; i++) {
    //         newInputs[i].addEventListener("blur", function() {
    //           if (this.value.trim() === "") {
    //             this.classList.add("error");
    //           } else {
    //             this.classList.remove("error");
    //           }
    //         });
    //       }
    //     });
      
    //     document.addEventListener("click", function(event) {
    //       if (event.target.classList.contains("add")) {
    //         var empty = false;
    //         var inputs = event.target.parentNode.parentNode.querySelectorAll('input[type="text"]');
    //         for (var i = 0; i < inputs.length; i++) {
    //           if (inputs[i].value.trim() === "") {
    //             inputs[i].classList.add("error");
    //             empty = true;
    //           } else {
    //             inputs[i].parentNode.innerHTML = inputs[i].value;
    //           }
    //         }
    //         if (!empty) {
    //           var addButton = event.target;
    //           var editButton = addButton.parentNode.querySelector(".edit");
    //           addButton.classList.toggle("hidden");
    //           editButton.classList.toggle("hidden");
    //           var addButtonRow = addButton.parentNode.parentNode;
    //           var addNewButton = document.querySelector(".add-new");
    //           addNewButton.disabled = false;
    //         }
    //       } else if (event.target.classList.contains("edit")) {
    //         var row = event.target.parentNode.parentNode;
    //         var cells = row.querySelectorAll("td:not(:last-child)");
    //         for (var i = 0; i < cells.length; i++) {
    //           var cellText = cells[i].innerHTML;
    //           cells[i].innerHTML = '<input type="text" class="form-control" value="' + cellText + '">';
    //         }
    //         var addButton = event.target;
    //         var editButton = addButton.parentNode.querySelector(".edit");
    //         addButton.classList.toggle("hidden");
    //         editButton.classList.toggle("hidden");
    //         var addNewButton = document.querySelector(".add-new");}})
    //     })