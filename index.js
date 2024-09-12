import { integration_id, redirect_uri, client_secret, code } from "./env.js";
import { tokens } from "./answer.js";

const main_b = document.querySelector('.main-btn');
const get_b = document.querySelector('.get-btn');

main_b.addEventListener('click', () => {
  console.log('пошла родимая');
   const authUrl = 'https://hivoco7680.amocrm.ru/oauth2/access_token';
   fetch(authUrl, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "client_id": integration_id,
      "client_secret": client_secret,
      "grant_type": "authorization_code",
      "code": code,
      "redirect_uri": redirect_uri
    })
   }).then(data => console.log(data)).catch(err => console.log('pizda', err))
});

async function getLeads(page, limit = 3){
  try {
    const data = await fetch('https://hivoco7680.amocrm.ru/api/v4/leads?page=2&limit=3', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json'
      }
    })
    return await data.json()
  } catch (err) {
    console.error('ошибка в получении данных: ', err);
    const errorText = document.createTextNode(`Ошибка при получении данных: ${err}`);
    document.body.appendChild(errorText);
  }
}

get_b.addEventListener('click', () => {
  getLeads()
})