import express from 'express'
import axios from 'axios'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const PORT = 1234

app.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   
   // Если preflight-запрос, отправляем 204 No Content
   if (req.method === 'OPTIONS') {
      console.log('options method (yea baby)');
     return res.sendStatus(204);
   } else {
      console.log('no nigga');
   }
 
   next();
 });
 
 // Middleware для обработки JSON-запросов
 app.use(bodyParser.json());
 
 // Прокси-маршрут для отправки запросов на amoCRM
 app.post('/proxy/amocrm', async (req, res) => {
   try {
     const { url, method, headers, data } = req.body;
     
     // Отправка запроса на amoCRM API через axios
     const response = await axios({
       url: url,
       method: method,
       headers: headers,
       data: data
     });
 
     // Отправка ответа обратно на клиент
     res.status(response.status).json(response.data);
   } catch (error) {
     console.error('Error making request to amoCRM:', error.message);
     res.status(500).json({ error: 'Failed to fetch data from amoCRM' });
   }
 });
 
 
 // Запуск сервера
 app.listen(PORT, () => {
   console.log(`Proxy server is running on http://localhost:${PORT}`);
 });