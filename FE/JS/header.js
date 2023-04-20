const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));

export default function head(){

    if (User) {
        const showUser = $(".user");
        console.log(User.data?.name)
        showUser.innerHTML = `<i class="fa-solid fa-user"></i> ${User.data?.name}
        <ul class="dropdown-user">
            <li class="profile">Your profile</li>
            <li class="purchase"><a href="./puchase.html">Purchase</a></li>
            <li class="logout">Logout</li>
        </ul>
        `;
    }
}