const username = document.querySelector('#username');
const password = document.querySelector('#password');
const login = document.querySelector('#login');
const fillAll = document.querySelector('#fillAll');
const faultLogin = document.querySelector('#faultLogin');
const successLogin = document.querySelector('#successLogin');
var storage = window.localStorage;

window.onload = function () {
    if (!window.navigator.onLine) {
        console.error("No internet connection available!");
    } else {
        console.log('Internet connection available!');
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

login.addEventListener('click', async function (e) {
    if (username.value == '' || password.value == '') {
        fillAll.style.display = 'block';
        return;
    } else {
        axios({
            method: 'post',
            url: 'http://localhost:8000/login',
            data: {
                "email": username.value,
                "password": password.value
            }
        }).then(async function (response) { //checa se os dados estao corretos com o back
            //permite o login
            successLogin.style.display = 'block';
            console.log(response);

            //Atualiza o header com o token recebido
            storage.setItem('token', 'Bearer ' + response.data.token);

            //muda de pagina
            await sleep(1000);
            window.location = 'pages/home.html';
        }).catch(function (err) {
            console.log(err)
            faultLogin.style.display = 'block';
            return;
        });
    }
});

fillAll.querySelector('.close').addEventListener('click', function (e) {
    fillAll.style.display = 'none';
});

faultLogin.querySelector('.close').addEventListener('click', function (e) {
    faultLogin.style.display = 'none';
});