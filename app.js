//Importando elementos HTML que serão alterados
const localElem = document.querySelector('.local');
const diaElem = document.querySelector('.dia');
const horaElem = document.querySelector('.hora');
const imgElem = document.querySelector('.img');
const descElem = document.querySelector('.desc');

//Chave API
const apiKey = '26c9976598df06e8f3d65e870d2b4a54';



//Função para conseguir a hora em tempo real
function horaAtual(){
    const agora = new Date();
    const hora = agora.toLocaleTimeString("pt-BR", {hour: '2-digit', minute: '2-digit'});
    horaElem.textContent = `🕒 ${hora}h`
};
horaAtual();
setInterval(horaAtual, 60000)

//Função para obter o dia atual
function diaHoje(){
    const hoje = new Date();
    const diaFormatado = hoje.toLocaleDateString("pt-BR", {
        weekday: 'long',
        day:'2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    diaElem.textContent = diaFormatado.charAt(0).toUpperCase() + diaFormatado.slice(1);
}
diaHoje()

//Função para obter o clima de acordo com a região
function obterClima(lat, lon){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=pt_br&units=metric`;
    fetch(apiUrl)
    .then(response => {
        if (!response.ok){
            throw new Error('Could not fetch resource')
        }
        return response.json();
    })
        
    .then(data => {
        const weather = data.weather[0].description
        const temp = data.main.temp;
        const feelsLike = data.main.feels_like;
        const cidade = data.name;
        const pais = data.sys.country;

        descElem.textContent = `${weather}, temperatuda: ${temp}°C, sensação térmica: ${feelsLike}°C`;
        localElem.textContent = `${cidade}, ${pais}`

        const descricao = data.weather[0].description.toLowerCase();

        if (descricao.includes('céu limpo')) {
            imgElem.src = "./imagens/ensolarado.png";
        } else if (descricao.includes('nublado')) {
            imgElem.src = "./imagens/nublado.png";
        } else if (descricao.includes('chuva')) {
            imgElem.src = "./imagens/chuva.png";
        } else if (descricao.includes('trovoada')) {
            imgElem.src = "./imagens/tempestade.png";
        } else {
            imgElem.src = "./imagens/fallback.png";
        }
    })
    .catch(error => console.error(error))
}



//Obter a localidade do usuário pelo navegador e chmara a função obeter clima
if ("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            obterClima(lat, lon)
        },
        (erro) => {
            console.log("Erro ao obter localização:", erro.message)
        }
    );
} else {
    console.error("Geolocalização não suportada pelo navegador")
}




