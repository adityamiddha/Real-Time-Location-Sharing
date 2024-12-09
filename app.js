const express = require('express');
const cors = require('cors');
const app =  express();
const http = require("http");
const path = require("path");

const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(cors());

io.on("connection",function(socket){
    socket.on("send-location",function(data){
        io.emit("receive-location",{id:socket.id, ...data });

    });
    socket.on("disconnect",function(){
        console.log("disconected")
        io.emit("user-disconnected",socket.id);
    });
    console.log("connected");
});

app.get("/",function(req,res){
    res.render("index");
});

server.listen(3000);
//to start server cmd = npx nodemon app.js
//to emd sever cmd = ctrl+c