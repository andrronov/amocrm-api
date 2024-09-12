import { tokens } from "./answer.js";

const get_b = document.querySelector('.get-btn');
let page = 1; let limit = 3

async function getLeads(page, limit = 3){
  try {
    const data = await fetch(`https://hivoco7680.amocrm.ru/api/v4/leads?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json'
      }
    })
    return await data.json()
  } catch (err) {
    const errorText = document.createTextNode(`Ошибка при получении данных: ${err}`);
    document.body.appendChild(errorText);
    console.error('ошибка в получении данных: ', err);
  }
}

function addTable(){
  const table = document.createElement('table');
  table.classList.add('amo-table');
  table.innerHTML = `
    <thead class="amo-table-head">
      <tr class="amo-table-row">
        <th class="amo-table-header">ID</th>
        <th class="amo-table-header">Название</th>
        <th class="amo-table-header">Бюджет сделки</th>
      </tr>
    </thead>
    <tbody class="amo-table-body">
    </tbody>
  `;
  document.body.appendChild(table);
}

get_b.addEventListener('click', async () => {
  let isGetData = true
  addTable()
  
  while(isGetData){
    console.log('getting...');
    const data = await getLeads(page++)
    const leads = data._embedded.leads
    leads.forEach(el => {
      const row = document.createElement('tr');
      row.classList.add('amo-table-row');
      row.innerHTML = `
        <th class="amo-table-data">${el.id}</th>
        <th class="amo-table-data">${el.name}</th>
        <th class="amo-table-data">${el.price}</th>
      `;
      document.querySelector('.amo-table-body').appendChild(row);
    })
    console.log(leads);

    if(leads.length < limit) isGetData = false
  }
})