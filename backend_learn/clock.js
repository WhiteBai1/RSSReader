const http = require('http')
const fs = require('fs')
const path = require('path')

const server = http.createServer()

server.on('request',function(req,res){
    const url = req.url
    res.end('Hello! Server is running!!!')
})

server.listen(8080,function(){
    console.log ('server listen at http://127.0.0.1')
})