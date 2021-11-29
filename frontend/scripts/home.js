const modalAddCamera = document.querySelector('#modalAddCamera');
const modalExclusion = document.querySelector('#confirmExclusion');
const popFillAll = document.querySelector('#fillAll');
const addedCamera = document.querySelector('#addedCamera');
const deletedCamera = document.querySelector('#deletedCamera');
const errorDelete = document.querySelector('#errorDelete');
const alreadyExists = document.querySelector('#alreadyExists');
const faultIP = document.querySelector('#faultIP');
const errorConection = document.querySelector('#errorConection');
const successConnect = document.querySelector('#successConnect');
const successDisconnect = document.querySelector('#successDisconnect');
const successTurnOn = document.querySelector('#successTurnOn');
const successTurnOff = document.querySelector('#successTurnOff');
const errorConnectToServer = document.querySelector('#errorConnectToServer');

const exit = document.querySelector('#sign-out');
const power = document.querySelector('#power');

const progressBar = document.querySelector('div[role="progressbar"]');
const entered = document.querySelector('#entered');
const left = document.querySelector('#left');

var cameras = document.querySelectorAll('.camera');
const camera_list = document.querySelector('.camera-list');
const addCamera = document.querySelector('#add-camera');

const token = window.localStorage.getItem('token');
var maxCapacity = 0;
var currentAmount = 0;
var location_id = "";
var location_name;

window.onload = function () {
    //pega info do usuario 
    axios({
        method: 'get',
        url: 'http://localhost:8000/users/locations',
        data: {},
        headers: {
            authorization: token,
        }
    }).then(async function (response) {
        maxCapacity = response.data.at(-1).total_capacity;
        currentAmount = response.data.at(-1).total_people_inside + 12;
        location_id = response.data.at(-1).id;
        location_name = response.data.at(-1).name;
        //console.log(response);

        //atualiza a progressbar
        var percentage = (currentAmount / maxCapacity) * 100;
        percentage = Number(percentage.toFixed(0));
        progressBar.style.setProperty('--value', percentage);

        //atualiza o resumo
        entered.innerHTML = '+ ' + currentAmount.toString() + ' pessoas';
        left.innerHTML = '- 0 pessoas';

        var cameraList = [];
        //pega a relacao de cameras
        await axios({
            method: 'get',
            url: 'http://localhost:8000/users/' + location_id + '/cameras',
            data: {},
            headers: {
                authorization: token,
            }
        }).then(function (response) {
            cameraList = response.data;
            //console.log(cameraList);
        });

        //checa a existencia de cameras
        if (cameraList.length === 0) {
            html = '<div class="empty-cameraList">';
            html += '<div>';
            html += '<img src="../images/alerta.png" alt="alerta">';
            html += '</div>';
            html += '<h2>Nenhuma câmera cadastrada</h2>';
            html += '</div>';
            camera_list.innerHTML = html;
        } else {
            //atualiza a lista de cameras
            let i = 1;
            html = '';
            for (const camera of cameraList) {
                var status = camera.status == 0 ? 'off' : 'on';
                var check = camera.status == 0 ? '' : 'checked';
                html += '<details class="camera">';
                html += '<summary>'
                html += '<p>Câmera 0' + i.toString() + '</p>';
                html += '<div class="camera-status ' + status + '"></div>';
                html += '</summary>';
                html += '<div>';
                html += '<div>';
                html += '<p class="camera_id">ID: ' + camera.id + '</p>';
                html += '<p>Localização: ' + location_name + '</p>';
                html += '<p>IP: ' + camera.ip + '</p>';
                html += '</div>';
                html += '<div>';
                html += '<label class="switch">';
                html += '<input type="checkbox" onclick="switchCamera(this)" ' + check + '>';
                html += '<span class="slider"></span>';
                html += '</label>';
                html += '<button onclick="confirmChoice(this)">Delete</button>';
                html += '</div>';
                html += '</div>';
                html += '</details>';
                i += 1;
            }
            camera_list.innerHTML = html;
            cameras = document.querySelectorAll('.camera');
            countPeople();
        }
    }).catch(function (err) {
        console.log(err)
        return;
    });
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function switchCamera(obj) {
    var camera = obj.parentElement.parentElement.parentElement.parentElement;
    var status = camera.querySelector('.camera-status');
    if (status.classList.contains('on')) {
        //desliga no back-end 
        axios({
            method: 'post',
            url: 'http://localhost:8000/cameras/disconnect',
            data: {
                "camera_id": camera.querySelector('.camera_id').textContent.split(':').at(-1).replace(' ', '')
            },
            headers: {
                authorization: token,
            }
        }).then(function (response) {
            //atualiza no html
            status.classList.remove('on');
            status.classList.add('off');
            successDisconnect.style.display = "block";
        }).catch(async function (error) { //CHECA SE DEU TUDO CERTO
            errorConection.style.display = "block";
            await sleep(300);
            obj.checked = true;
        });
    } else {
        //liga no back-end 
        axios({
            method: 'post',
            url: 'http://localhost:8000/cameras/connect/' + camera.querySelector('.camera_id').textContent.split(':').at(-1).replace(' ', ''),
            data: {},
            headers: {
                authorization: token,
            }
        }).then(function (response) {
            //atualiza no html
            status.classList.remove('off');
            status.classList.add('on');
            successConnect.style.display = "block";
        }).catch(async function (error) { //CHECA SE DEU TUDO CERTO
            errorConection.style.display = "block";
            await sleep(300);
            obj.checked = false;
        });
    }
}

async function confirmChoice(obj) {
    modalExclusion.style.display = "block";

    modalExclusion.querySelector('.cancel').addEventListener('click', function (e) {
        modalExclusion.style.display = "none";
        return;
    });

    modalExclusion.querySelector('.confirm').addEventListener('click', function (e) {
        modalExclusion.style.display = "none";
        deleteCamera(obj);
        return;
    });
};

function deleteCamera(obj) {
    var cameraObj = obj.parentElement.parentElement.parentElement;

    //deletar a camera do banco de dados
    axios({
        method: 'delete',
        url: 'http://localhost:8000/cameras/' + cameraObj.querySelector('.camera_id').textContent.split(':').at(-1).replace(' ', ''),
        data: {},
        headers: {
            authorization: token,
        }
    }).then(function (response) {
        //remove do html
        cameraObj.remove();

        //renumera as cameras
        cameras = document.querySelectorAll('.camera');
        let i = 1;
        for (const camera of cameras) {
            camera.querySelector('summary>p').textContent = 'Câmera 0' + i.toString();
            i += 1;
        }
        deletedCamera.style.display = 'block';

        //atualiza a lista
        cameras = document.querySelectorAll('.camera');

        //checa se existe cameras
        if (cameras.length === 0) {
            html = '<div class="empty-cameraList">';
            html += '<div>';
            html += '<img src="../images/alerta.png" alt="alerta">';
            html += '</div>';
            html += '<h2>Nenhuma câmera cadastrada</h2>';
            html += '</div>';
            camera_list.innerHTML = html;
        }
    }).catch(function (error) { //CHECA SE DEU TUDO CERTO
        errorDelete.style.display = 'block';
    });
};

power.addEventListener('click', async function (e) {
    const status = document.querySelector('#power div');
    if (status.classList.contains('on')) {
        //desliga as cameras no back
        axios({
            method: 'post',
            url: 'http://localhost:8000/users/cameras/off',
            data: {},
            headers: {
                authorization: token,
            }
        }).then(function (response) {
            //atualiza o botao de power
            status.classList.remove('on');
            status.classList.add('off');

            //desliga todas as cameras
            for (const camera of cameras) {
                camera.querySelector('div').classList.remove('on');
                camera.querySelector('div').classList.add('off');
                camera.querySelector('.switch input').checked = false;
            }
            successTurnOff.style.display = "block";
        }).catch(async function (error) { //CHECA SE DEU TUDO CERTO
            errorConnectToServer.style.display = 'block';
            status.classList.remove('on');
            status.classList.add('off');
            await sleep(300);
            status.classList.remove('off');
            status.classList.add('on');
        });
    } else {
        //liga as cameras no back
        errorCamera = false;
        for (const camera of cameras) {
            axios({
                method: 'post',
                url: 'http://localhost:8000/cameras/connect/' + camera.querySelector('.camera_id').textContent.split(':').at(-1).replace(' ', ''),
                data: {},
                headers: {
                    authorization: token,
                }
            }).then(function (response) {
                camera.querySelector('div').classList.remove('off');
                camera.querySelector('div').classList.add('on');
                camera.querySelector('.switch input').checked = true;
            }).catch(function (error) { //CHECA SE DEU TUDO CERTO
                errorCamera = true;
            });
        }


        //CHECA SE DEU TUDO CERTO
        if (errorCamera) {
            errorConnectToServer.style.display = 'block';
            status.classList.remove('off');
            status.classList.add('on');
            await sleep(300);
            status.classList.remove('on');
            status.classList.add('off');
            return;
        }

        //atualiza o botao de power
        status.classList.remove('off');
        status.classList.add('on');

        successTurnOn.style.display = "block";
    }
});

async function countPeople(e) {
    while (true) {
        axios({
            method: 'get',
            url: 'http://localhost:8000/locations/' + location_id,
            data: {},
            headers: {
                authorization: token,
            }
        }).then(function (response) {
            maxCapacity = response.data.total_capacity;
            currentAmount = response.data.total_people_inside;

            //atualiza a progressbar
            var percentage = (currentAmount / maxCapacity) * 100;
            percentage = Number(percentage.toFixed(0));
            progressBar.style.setProperty('--value', percentage);

            //atualiza o resumo
            entered.innerHTML = '+ ' + currentAmount.toString() + ' pessoas';
        }).catch(function (error) { //CHECA SE DEU TUDO CERTO
            errorConnectToServer.style.display = 'block';
        });

        await sleep(13000);
    }
};

exit.addEventListener('click', function (e) {
    window.localStorage.setItem('token', '');
    window.location = '../index.html';
})

// -------------------------------- MODALS ------------------------------

addCamera.addEventListener('click', function (e) {
    modalAddCamera.style.display = "block";
});

modalAddCamera.querySelector('.close').addEventListener('click', function (e) {
    modalAddCamera.style.display = "none";
    modalAddCamera.querySelector('#name').value = '';
    modalAddCamera.querySelector('#ip').value = '';
});

modalAddCamera.querySelector('.cancel').addEventListener('click', function (e) {
    modalAddCamera.style.display = "none";
    modalAddCamera.querySelector('#name').value = '';
    modalAddCamera.querySelector('#ip').value = '';
});

modalAddCamera.querySelector('.save').addEventListener('click', function (e) {
    var name = modalAddCamera.querySelector('#name').value;
    var ip = modalAddCamera.querySelector('#ip').value;
    var location = location_id;

    //checa os campos
    if (name == '' || ip == '') {
        popFillAll.style.display = "block";
        return;
    }

    //checa se o IP esta formatado corretamente
    // if (!(/^\d\d\d\.\d\d\d\.\d\d\.\d/.test(ip))) {
    //     faultIP.style.display = "block";
    //     return;
    // }

    //salvar camera no banco de dados [POST]
    axios({
        method: 'post',
        url: 'http://localhost:8000/cameras',
        data: {
            "name": name,
            "location_id": location_id,
            "status": 0,
            "ip": ip
        },
        headers: {
            authorization: token,
        }
    }).then(function (response) {
        //adicionar camera a lista
        html = '<details class="camera">';
        html += '<summary>'
        html += '<p>Câmera 0' + (cameras.length + 1).toString() + '</p>';
        html += '<div class="camera-status off"></div>';
        html += '</summary>';
        html += '<div>';
        html += '<div>';
        html += '<p class="camera_id">ID: ' + response.data.id + '</p>';
        html += '<p>Localização: ' + location_name + '</p>';
        html += '<p>IP: ' + ip + '</p>';
        html += '</div>';
        html += '<div>';
        html += '<label class="switch">';
        html += '<input type="checkbox" onclick="switchCamera(this)">';
        html += '<span class="slider"></span>';
        html += '</label>';
        html += '<button onclick="confirmChoice(this)">Delete</button>';
        html += '</div>';
        html += '</div>';
        html += '</details>';

        if (cameras.length == 0) {
            camera_list.innerHTML = html;
        } else {
            camera_list.innerHTML += html;
        }
        cameras = document.querySelectorAll('.camera');

        modalAddCamera.style.display = "none";
        modalAddCamera.querySelector('#name').value = '';
        modalAddCamera.querySelector('#ip').value = '';
        popFillAll.style.display = "none";
        addedCamera.style.display = "block";
    }).catch(function (error) { //checa se a camera ja existe
        alreadyExists.style.display = "block";
    });
});

/*window.onclick = function (event) {
    if (event.target == modalAddCamera) {
        modalAddCamera.style.display = "none";
        modalAddCamera.querySelector('#name').value = '';
        modalAddCamera.querySelector('#ip').value = '';
        modalAddCamera.querySelector('#location').value = '';
    }
};
*/

//-------------------------------- POPUPS ------------------------------

popFillAll.querySelector('.close').addEventListener('click', function (e) {
    popFillAll.style.display = "none";
});

addedCamera.querySelector('.close').addEventListener('click', function (e) {
    addedCamera.style.display = "none";
});

alreadyExists.querySelector('.close').addEventListener('click', function (e) {
    alreadyExists.style.display = "none";
});

faultIP.querySelector('.close').addEventListener('click', function (e) {
    faultIP.style.display = "none";
});

deletedCamera.querySelector('.close').addEventListener('click', function (e) {
    deletedCamera.style.display = "none";
});

errorDelete.querySelector('.close').addEventListener('click', function (e) {
    errorDelete.style.display = "none";
});

errorConection.querySelector('.close').addEventListener('click', function (e) {
    errorConection.style.display = "none";
});

successConnect.querySelector('.close').addEventListener('click', function (e) {
    successConnect.style.display = "none";
});

successDisconnect.querySelector('.close').addEventListener('click', function (e) {
    successDisconnect.style.display = "none";
});

successTurnOn.querySelector('.close').addEventListener('click', function (e) {
    successTurnOn.style.display = "none";
});

successTurnOff.querySelector('.close').addEventListener('click', function (e) {
    successTurnOff.style.display = "none";
});

errorConnectToServer.querySelector('.close').addEventListener('click', function (e) {
    errorConnectToServer.style.display = "none";
});