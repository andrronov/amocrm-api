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
  try {
    const data = await getTaskInfo(rowElement.id)
  
    // Логика с датами и определением, просрочена ли задача
    const taskDate = new Date(data.closest_task_at * 1000);
    const dayToday = new Date().getDate();
    const isTaskLate = (data.closest_task_at - (Date.now() / 1000).toFixed()) > 0 ? (dayToday === taskDate.getDate() ? 'today' : 'later') : 'late'
        
    // Отображение карточки задачи
    const nextRow = document.createElement('tr');
    nextRow.classList.add('tab-content')
    nextRow.id = rowElement.id
    nextRow.innerHTML = `
    <th colspan="3">Название задачи: ${data.name} Дата: ${taskDate.getDate()}.${taskDate.getMonth() + 1}.${taskDate.getFullYear()} ID статуса задачи: ${data.status_id} Статус выполнения:
    <svg width="30" height="25" viewBox="0 0 30 30">
      <circle cx="10" cy="20" r="10" fill="#fff"></circle>
      <circle cx="10" cy="20" r="10" fill="${ isTaskLate === 'late' ? '#FF0000' : isTaskLate === 'today' ? '#008000' : '#FFFF00' }"></circle>
    </svg>
    `
    document.querySelector('tbody').insertBefore(nextRow, rowElement.nextElementSibling)
    
  } catch (err) {
    showError(err)
    console.error('ошибка при получении таски: ', err);
  } finally {
    setLoading('hide')
  }
}
function showLeadInfo(rowElement, selectedRowId){
  // Переключение между карточками задач
  const tabContent = document.querySelector('.tab-content')
  
  if(!tabContent){
    setLoading('show')
    addRowInfo(rowElement)
  } else if (selectedRowId != tabContent?.id){
    setLoading('show')
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
    const leads = data._embedded.leads
    leads.forEach(el => {
      // Добавление строк в таблицу
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