const url = (window.location.hostname.includes('localhost')) ? 
    'http://localhost:8081/api/auth/' : 
    'https://cn-restserver.herokuapp.com/api/auth/'


let usuario = null;
let socket = null;

const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuario = document.querySelector('#ulUsuario');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir')


const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if(token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    await fetch( url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-token': token
            }
            })
            .then(resp => resp.json())
            .then(data => {
                const  { uid: uidDB, token: tokenDB } = data;
                localStorage.setItem('token',tokenDB);
                uid = uidDB;

                document.title = uid.name;

                
            })
            .catch(err => {
                console.log(err);
            }); 

            await conectarSocket();
            
}

const conectarSocket = async() =>{

    socket = io({
        'extraHeaders': {
            'x-token' : localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Sockets Online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets Offline');
    });

    socket.on('recibir-mensajes',dibujarMensajes);

    socket.on('usuarios-activos',dibujarUsuario);

    socket.on('mensaje-privado',( payload )=>{
        console.log('Privado: ', payload);
    });

    
}

const dibujarUsuario = (usuarios = []) => {
    
    let userHtml = '';
    usuarios.forEach( ({name, uid}) => {
        userHtml += `
            <li>
                <p>
                    <h5 class="text-success">${name}</h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    });

    ulUsuario.innerHTML = userHtml;
}

const dibujarMensajes = (mensajes = []) => {
    
    let mensajesHtml = '';
    mensajes.forEach( ({ name, mensaje }) => {
        mensajesHtml += `
            <li>
                <p>
                    <span class="text-primary">${name}: </span>
                    <span">${mensaje}</span>
                </p>
            </li>
        `;
    });

    ulMensajes.innerHTML = mensajesHtml;
}

txtMensaje.addEventListener('keyup', ({keyCode}) => {

    const mensaje = txtMensaje.value;
    const  uid = txtUid.value;

    if(keyCode !== 13){ return; }
    if(mensaje.length === 0) {return; };

    socket.emit('enviar-mensaje', { mensaje, uid });
    txtMensaje.value = '';

});

const main = async() => {
    await validarJWT();

}


main(); 