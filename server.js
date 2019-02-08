process.on('uncaughtException', error => {
	console.log(`Error stack!: ${error.stack}`.red);
});


var express = require("express");
var app = express();
var path = require("path");
var http = require('http').Server(app);
var io = require('socket.io')(http);

var colors = require('colors');
var fs = require('fs');
var load = require('json-pretty');

var userList = [];

var user = require("./user.js");

io.on('connection', function(socket) {
    var ip = socket.request.connection.remoteAddress.split("ffff:")[1];
    var userNotRegister = false;
    var loginAccept = false;
    var username = null;
    console.log("New connection", ip);
    socket.on("login", function(data) {
        if(loginAccept == true) return;
        var lUsers = fs.readFileSync("./users.js", "utf-8");
        var users = JSON.parse(lUsers);
        for(var i in users) {
            if(data.username && data.password && data.username == users[i].username && users[i].password == data.password) {
                socket.room = data.username;
                socket.join(socket.room);
                userList.push(new user(socket.room));
                loginAccept = true;
                username = data.username;
                socket.emit("loginAccept", {
                    datr: {
                        maxbots: users[i].maxbots,
                        username: users[i].username,
                        coins: users[i].coins,
                        time: users[i].time
                    },
                    text: "Bots: " + users[i].maxbots + " Time: " + (users[i].time / 86400 >> 0) +":"+ (users[i].time / 3600 % 24 >> 0) +":"+ (users[i].time / 60 % 60 >> 0)+":"+(users[i].time % 60 >> 0)
                });
                console.log("[Login user]", users[i].username, users[i].time, users[i].maxbots, "users:", userList.length);
            } else {
                if(loginAccept == false) {
                    socket.emit("loginfailed");
                }
            }
        }
    });
    closeCheck = false;
    socket.on("register", function(data) {
        var lUsers = fs.readFileSync("./users.js", "utf-8");
        var users = JSON.parse(lUsers);
        for(var i in users) {
            if(closeCheck == true) return;
            if(data.username && data.password && data.two_password && data.mail && data.username !== users[i].username && data.password == data.two_password && users[i].ip !== ip) {
                users.push({
                    ip: ip,
                    username: data.username,
                    password: data.password,
                    maxbots: 0,
                    time: 0,
                    coins: 0,
                    unlimited: false
                });
                fs.writeFileSync("./users.js", load(users));
                socket.emit("registerdone");
                return closeCheck = true;
            }
        }
    });

    socket.on("receiveChangeMode", function(data) {
        if(loginAccept == true) {
            for(var i in userList) {
                if(userList[i].username == username) {
                    userList[i].swithMode(data);
                }   
            }
        }
    });

    socket.on("buyfree", function() {
        if(loginAccept == true) {
            for(var i in userList) {
                if(userList[i].username == username) {
                    userList[i].buyfree();
                    if(userList[i].requestBuyingPackage() == "free") {
                        socket.emit("acceptbuyfreeplan");
                    }
                }   
            }
        }
    });
    socket.on("buypremium", function() {
        if(loginAccept == true) {
            for(var i in userList) {
                if(userList[i].username == username) {
                    userList[i].buypremium();
                    if(userList[i].requestBuyingPackage() == "premium") {
                        socket.emit("acceptbuypremiumplan");
                    }
                }   
            }
        }
    });
    socket.on("buygold", function() {
        if(loginAccept == true) {
            for(var i in userList) {
                if(userList[i].username == username) {
                    userList[i].buygold();
                    if(userList[i].requestBuyingPackage() == "gold") {
                        socket.emit("acceptbuygoldplan");
                    }
                }   
            }
        }
    });
    socket.on("buymedium", function() {
        if(loginAccept == true) {
            for(var i in userList) {
                if(userList[i].username == username) {
                    userList[i].buymedium();
                    if(userList[i].requestBuyingPackage() == "medium") {
                        socket.emit("acceptbuymediumplan");
                    }
                }   
            }
        }
    });
    socket.on("DataServer", function(data) {
        if(loginAccept == true) {
            for(var i in userList) {
                if(userList[i].username == username) {
                    userList[i].receiveData(data);
                }   
            }
        }
    });
    socket.on("DataPosition", function(data) {
        if(loginAccept == true) {
            for(var i in userList) {
                if(userList[i].username == username) {
                    userList[i].receivePosition(data);
                }
            }
        }
    });
    socket.on("DataClose", function() {
        if(loginAccept == true) {
            for(var i in userList) {
                if(userList[i].username == username) {
                    userList[i].receiveDataBotsClose();
                }
            }
        }
    });
    socket.on("getUserInfo", function() {
        for(var i in userList) {
            if(userList[i].username == username) {
                socket.emit("receiveUserStatus", {
                    status: userList[i].getStatus()
                });
            }
        }
    });
    socket.on("splitbots", function() {
        if(loginAccept == true) {
            for(var i in userList) {
                if(userList[i].username == username) {
                    userList[i].bSplit();
                }
            }
        }
    });
    socket.on("ejectbots", function() {
        if(loginAccept == true) {
            for(var i in userList) {
                if(userList[i].username == username) {
                    userList[i].bEject();
                }
            }
        }
    });
    socket.on("disconnect", function() {
        console.log("user disconnect", ip);


        if(userList.length > 0) {
            for(var i in userList) {
                if(userList[i].username == username) {
                    userList[i].receiveDataBotsClose();
                    userList.splice(i, 1);
                }
            }
        }
    });
});
http.listen("5000");