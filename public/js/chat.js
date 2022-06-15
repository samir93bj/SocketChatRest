const url = (window.location.hostname.includes('localhost')) ? 
    'http://localhost:8081/api/auth/' : 
    'https://cn-restserver.herokuapp.com/api/auth/'


let usuario = null;
let socket = null;

const validarJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if(token.length <= 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el servidor');
    }

    const resp = await fetch( url, {
        headers: { 'x-token': token }
    });
    
    const data = await resp.json();
    console.log(data);
}

const main = async() => {
    await validarJWT();

}

main();