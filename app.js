import express from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = 3000

import summary_router from './routes/summary.js';

app.use(bodyParser.json()); // 解析JSON格式的请求体
app.use(bodyParser.urlencoded({ extended: true })); // 解析URL编码的请求体


app.use('/summary',summary_router)


app.listen(port,()=>{
    console.log("express server running at http://127.0.0.1")
})

