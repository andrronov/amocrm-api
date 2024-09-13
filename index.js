import { tokens } from "./answer.js";

const get_b = document.querySelector('.get-btn');
let page = 1; let limit = 3

// API
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
    showError(err)
    console.error('ошибка в получении данных: ', err);
  }
}
async function getTaskInfo(id){
  try {
    const data = await fetch(`https://hivoco7680.amocrm.ru/api/v4/leads/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json'
      }
    })
    return await data.json()
  } catch (err) {
    showError(err)
    console.error('ошибка при получении таски: ', err);
  }
}

// UI
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
async function addRowInfo(rowElement){
  const data = await getTaskInfo(rowElement.id)

  console.log(data.closest_task_at, Date.now());

  setLoading('hide')
  const nextRow = document.createElement('tr');
  nextRow.classList.add('tab-content')
  nextRow.id = rowElement.id
  nextRow.innerHTML = `
    <th colspan="3">Название задачи: ${data.name}</th> `
  document.querySelector('tbody').insertBefore(nextRow, rowElement.nextElementSibling)
}
function showLeadInfo(rowElement, selectedRowId){
  setLoading('show')
  const tabContent = document.querySelector('.tab-content')

  if(!tabContent){
    addRowInfo(rowElement)
  } else if (selectedRowId != tabContent?.id){
    tabContent.remove()
    addRowInfo(rowElement)
  } else {
    tabContent.remove()
  }
}
function showError(err){
  const errorText = document.createTextNode(`Возникла ошибка: ${err}`);
  document.body.appendChild(errorText);
}
function setLoading(state){
  if(state === 'show'){
    const loading = document.createElement('div')
    loading.className = 'loading'
    loading.textContent = 'Загрузка...'
    document.body.appendChild(loading)
  } else {
    document.querySelector('.loading').remove()
  }
}

// Загрузка таблицы (основная логика)
get_b.addEventListener('click', async () => {
  setLoading('show')
  get_b.disabled = true
  
  addTable()
  
  let isGetData = true
  while(isGetData){
    const data = await getLeads(page++)
    console.log(data);
    const leads = data._embedded.leads
    leads.forEach(el => {
      const row = document.createElement('tr');
      row.addEventListener('click', () => showLeadInfo(row, el.id))
      row.classList.add('amo-table-row')
      row.id = el.id
      row.innerHTML = `
        <th class="amo-table-data">${el.id}</th>
        <th class="amo-table-data">${el.name}</th>
        <th class="amo-table-data">${el.price}</th>
      `;
      document.querySelector('.amo-table-body').appendChild(row);
    })

    if(leads.length < limit){
      isGetData = false
      setLoading('hide')
    }
  }
})