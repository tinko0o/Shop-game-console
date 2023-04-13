const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const User = JSON.parse(localStorage.getItem("loginUser"));

export default function header(){

    if (User) {
        const showUser = $(".user");
        console.log(User.data?.username)
        showUser.innerHTML = `<i class="fa-solid fa-user"></i> ${User.data?.username}
        <ul class="dropdown-user">
            <li class="profile">Your profile</li>
            <li class="purchase"><a href="./puchase.html">Purchase</a></li>
            <li class="logout">Logout</li>
        </ul>
        `;
    }
}