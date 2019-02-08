 var fs = require('fs');
var load = require('json-pretty');
var WebSocket = require('ws');
var proxySocks = fs.readFileSync('proxyS.txt').toString().split("\n");
var proxyHttps = fs.readFileSync('proxyH.txt').toString().split("\n");
var Socks = require('socks');
var request = require('request');
var http = require("https-proxy-agent");

var use_http = false;

function createAgent(id) {
    var proxyS = proxySocks[~~(Math.random() * proxySocks.length)].split(':');
    var proxyH = proxyHttps[~~(Math.random() * proxyHttps.length)].split(':');
    if(id < proxyS.length) {
        return new Socks.Agent  ({
            proxy: {
                ipaddress: proxyS[0],
                port: parseInt(proxyS[1]),
                type: parseInt(proxyS[2]) || 5
            }
        });
    } else if(id > proxyS.length) {
        return new http("http://" + proxyH[0] + ":" + parseInt(proxyH[1]));
    }
}

var bots_pos = [];

var names = [
    "Slxsher",
    "SlxsherYT"
]

var skins = ["{2ch.hk}", "{4chan}", "{8}", "{8ch}", "{9gag}", "{acorn}", "{aer}", "{air-bag}", "{alabama}", "{alaska}", "{alien-kid}", "{alien-kid2}", "{alien-tree}", "{alien-x}", "{alone}", "{alpaca}", "{alpaca2}", "{amazed}", "{amber}", "{angel}", "{angry}", "{ankh}", "{anubis}", "{apocalypse-rider}", "{apple}", "{april-fool}", "{aqua}", "{arachno-kid}", "{archer}", "{ares}", "{argentina}", "{army}", "{astronaut}", "{athletic}", "{australia}", "{austria}", "{ayy-lmao}", "{baby-octopus}", "{bad-boy}", "{bad-clover}", "{bad-santa}", "{badger}", "{baghdadi}", "{bait}", "{banana}", "{bangladesh}", "{banshee}", "{baratheon}", "{barbarian}", "{barbarian2}", "{bart}", "{baseball}", "{basilisk}", "{basketball}", "{bat-ball}", "{bat}", "{bear}", "{beavis}", "{behemoth}", "{belgium}", "{berlusconi}", "{berserker}", "{best-friends}", "{biker}", "{bird-mask}", "{birdie}", "{birthday-cia}", "{birthday-doge}", "{birthday-lol}", "{birthday-sanik}", "{birthday-sir}", "{birthday-troll}", "{birthday-wojak}", "{bite}", "{bitter}", "{black-cat}", "{blatter}", "{blue-swirl}", "{blue}", "{boar}", "{bolt-samurai}", "{bomb}", "{boot}", "{boris}", "{bosnia}", "{botswana}", "{bowling}", "{boxing-glub}", "{brave-heart-lion}", "{brazil}", "{bread}", "{breakfast}", "{brian}", "{bright-heart-racoon}", "{brofist}", "{bruiser-goat}", "{bubble-fish2}", "{bubblesaurus}", "{bug}", "{bulgaria}", "{bull-king}", "{bullet-man}", "{bunny}", "{burly-man}", "{bush}", "{butthead}", "{byzantium}", "{cactus}", "{calaca}", "{calavera}", "{cambodia}", "{cameron}", "{can-man}", "{canada}", "{cancer}", "{candy}", "{cannon-ball}", "{capricorn}", "{captain}", "{carp}", "{carrot}", "{cartman}", "{cat-cauldron}", "{cat}", "{celebration-hat}", "{champion}", "{chavez}", "{chicken-leg}", "{chicken}", "{chihuahua}", "{chile}", "{chilli-pepper}", "{china-dragon}", "{china}", "{choco-heart}", "{choco_egg}", "{chrono-ranger}", "{chupa-cabra}", "{cia}", "{cleopatra}", "{clinton}", "{cloud-prism}", "{cloud}", "{coca-cola}", "{coco-nuts}", "{coffee}", "{cogs}", "{coil}", "{colossus}", "{comet}", "{confederate}", "{cookie}", "{cool-agent}", "{cool-bunny}", "{cool-duck}", "{cool-duck2}", "{cool}", "{cosmo-pirate}", "{cougar}", "{coyote}", "{cozy-heart-penguin}", "{crazy-brain}", "{crazy-dog}", "{crazy-dog2}", "{crazy-sombrero}", "{crazy}", "{creeper}", "{croatia}", "{croc}", "{crocodile}", "{crow}", "{cuba}", "{cup-cake}", "{cupid}", "{cursed-blade}", "{cyber-agent}", "{cyber-guard}", "{czech}", "{dark-matter}", "{dark-wings}", "{dazzled}", "{death-star}", "{delighted}", "{denmark}", "{desert-fox}", "{destroyer}", "{detective}", "{devil}", "{devourer}", "{dilma}", "{dire-wolf}", "{dirt-block}", "{diva}", "{diver}", "{dog}", "{doge}", "{dollar}", "{donut}", "{donuts}", "{dr-cosmos}", "{dr-static}", "{dragon-griffin}", "{dragon-haze}", "{dragon-hydra}", "{dragon-razor}", "{dragon-twin}", "{dragon-viper}", "{droid}", "{dry-face}", "{duck-target}", "{dumpling}", "{dust-brain}", "{dynamite-guy}", "{ea}", "{eagle}", "{earth-day}", "{earth}", "{easter-chick}", "{eclipse-hunter}", "{egyptian-cat}", "{elder-master}", "{elephant-ball}", "{elf-helper}", "{enderman}", "{estonia}", "{euro}", "{european-union}", "{evil-master}", "{evil}", "{excalibur}", "{eye-five}", "{eye-five2}", "{eye-of-sauron}", "{eye}", "{eyeball}", "{eyepatch}", "{facebook}", "{facepunch}", "{fallen}", "{faun}", "{feminism}", "{fencing}", "{fidel}", "{finland}", "{finn}", "{fire-face}", "{fire-giant}", "{fire-giant2}", "{fire-rooster}", "{firebird}", "{firespitter}", "{fly}", "{flying-cork}", "{forever-alone}", "{fox}", "{france}", "{frankenstein}", "{french-fries}", "{french-kingdom}", "{frog-kid}", "{frog-kid2}", "{frog-thai}", "{frog}", "{frost-giant}", "{full}", "{fun-shine-bear}", "{funky}", "{funny-face}", "{fury-cat}", "{galaxy}", "{gamma}", "{geisha}", "{gemini}", "{general}", "{genie}", "{german-empire}", "{germany}", "{giant-human}", "{giant-skull}", "{giraffe}", "{girl}", "{gladiatrix}", "{glub}", "{godzilla}", "{gold-coin}", "{gold-pot}", "{gold-rush}", "{golden-mask}", "{goldfish}", "{golf}", "{goofy-yeti}", "{google-chrome}", "{great-zilla}", "{greece}", "{green-man}", "{grizzly}", "{gryphon}", "{gymnastic}", "{hades}", "{halloween}", "{hamburguer}", "{happy-hat}", "{happy-soda}", "{happy}", "{haste}", "{hat}", "{hazmat}", "{healing-potion}", "{heart}", "{heartbreaker}", "{heisenberg}", "{hello-kitty}", "{helm}", "{hercules}", "{herobrine}", "{hillary}", "{hitler}", "{hobgoblin}", "{hockey}", "{hole}", "{hollande}", "{homer}", "{hong-kong}", "{hornhead}", "{horse-boot}", "{horse-shoe}", "{hot-taco}", "{hungary}", "{hungry}", "{hunter}", "{huntsman}", "{husky-brawl}", "{husky}", "{ice-crystal}", "{ice-king}", "{ice-lord}", "{icecream-face}", "{icon}", "{icy-braid}", "{idol}", "{ignis}", "{illuminati}", "{imp}", "{imp2}", "{imperial-japan}", "{india}", "{indiana}", "{indonesia}", "{infernando}", "{insectoid}", "{iran}", "{iraq}", "{ireland}", "{iron-knight}", "{irs}", "{isis}", "{israel}", "{italy}", "{jackal}", "{jade-dragon}", "{jade}", "{jake}", "{jamaica}", "{japan}", "{jelly-blob}", "{jelly-face}", "{jellyfish-ball}", "{jew}", "{jotun}", "{judo}", "{juice-can}", "{jumper}", "{jupiter}", "{karate-parrot}", "{kc}", "{kempo-tiger}", "{kennedy}", "{kim-jong-un}", "{king-lion}", "{king}", "{kirchner}", "{kiss-boy}", "{kiss-girl}", "{kong}", "{kraken}", "{lannister}", "{latvia}", "{leaf-clover}", "{lenny-face}", "{leo}", "{leopard}", "{leprechaun}", "{lgbt}", "{liberty}", "{libra}", "{lion}", "{lisa}", "{lithuania}", "{little-zilla}", "{little-zilla2}", "{lizard}", "{lotsa-heart-elephant}", "{love-arrow}", "{lovesick}", "{luchador}", "{luxembourg}", "{mad-cap}", "{mage}", "{magic-gerbil}", "{magic-hat}", "{major-eagle}", "{maldivas}", "{mammoth}", "{maple}", "{maracas}", "{marauder}", "{marceline}", "{marge}", "{mars}", "{mask}", "{masked}", "{master-chief}", "{matriarchy}", "{mechatron}", "{medusa}", "{mega-mecha}", "{mega-power}", "{mercury}", "{merkel}", "{merry-outlaw}", "{metal-face}", "{metal-ghoul}", "{mexico}", "{mico}", "{mighty}", "{mischievous}", "{monk}", "{monkey}", "{monster}", "{montgomery}", "{moon-ship}", "{moon}", "{mountain}", "{mouse}", "{mr-boss}", "{mr-pumpkin}", "{mummy-king}", "{mummy}", "{mushroom}", "{mutant}", "{mystic-bird}", "{nasa}", "{nazi}", "{neila}", "{neon-bug}", "{neptune}", "{nerdy}", "{netherlands}", "{nigeria}", "{night-hunter}", "{north-korea}", "{norway}", "{nose}", "{nuclear}", "{nuke}", "{obama}", "{octopus}", "{oculus-orbus}", "{odd}", "{ogre}", "{old-one}", "{old-one2}", "{omega-blast}", "{omicron}", "{ooze}", "{orc-grunt}", "{orc-warrior}", "{origin}", "{owl}", "{pakistan}", "{paladin}", "{palin}", "{palm-tree}", "{panda}", "{panther}", "{patriarchy}", "{penguin}", "{pepsi}", "{performer}", "{peru}", "{peter}", "{pewdiepie}", "{phantom}", "{pharaoh}", "{phoenix}", "{phoenix2}", "{piccolo}", "{pie-slice}", "{pig-ball}", "{pilgrim}", "{pine-head}", "{ping-pong}", "{pinhata}", "{pirate-girl}", "{pirate}", "{pixel-kong}", "{pixie}", "{pizza}", "{player-1}", "{player-2}", "{pluto}", "{poet}", "{poison-rose}", "{pokemon}", "{pokerface}", "{poland}", "{polar-bear}", "{portugal}", "{poseidon}", "{power-badger}", "{power-fighter}", "{power-girl}", "{power-ninja}", "{prey}", "{primal}", "{princess-bubblegum}", "{prodota}", "{prussia}", "{psycho-driller}", "{psycho}", "{pug}", "{pumpkin}", "{purple-dragon}", "{putin}", "{qing-dynasty}", "{queasy}", "{quebec}", "{queen}", "{rabbit}", "{rabid}", "{raccoon-jutsu}", "{radar}", "{rage}", "{raid-boss}", "{raider}", "{rainbow}", "{ranger}", "{raptor}", "{rascal}", "{raspy-elf}", "{realshark}", "{reaper}", "{reaper2}", "{receita-federal}", "{red-beard}", "{red-dragon}", "{red-dragon2}", "{red-fiend}", "{red}", "{reddit}", "{reindeer}", "{reptilian}", "{rhino-boxer}", "{ringmaster}", "{robo-kid}", "{rocker}", "{rocket-deer}", "{rocket}", "{rockstar}", "{rogue-bunny}", "{rogue-samurai}", "{rogue}", "{romania}", "{rooster}", "{root-gnome}", "{russia}", "{sabertooth}", "{sad}", "{saggitarius}", "{salamander}", "{samba}", "{sanik}", "{santa-claus}", "{satanist}", "{saturn}", "{sausage}", "{sausage2}", "{scarab}", "{scarecrow}", "{scavenger}", "{scorpio}", "{scotland}", "{screaming-meemie}", "{scroll}", "{scythe}", "{sea-explorer}", "{sea-wizard}", "{sea-wizard2}", "{seal-knight}", "{seal}", "{sealand}", "{seer}", "{shadow}", "{shark}", "{shark2}", "{sheep-ball}", "{sheep}", "{sheriff}", "{shogun}", "{shrek}", "{shuriken}", "{shuttle}", "{silent-fox}", "{silver-tusk}", "{sir}", "{skeleton}", "{skull-bow}", "{skull-cactus}", "{skull-face}", "{skull-pirate}", "{skull-ribbon}", "{skull-samurai}", "{sky-rocket}", "{slaughter}", "{slime-face}", "{slingblade}", "{slovakia}", "{slovenia}", "{sly}", "{smelly}", "{smyg}", "{snack-shark}", "{snack-shark2}", "{snake}", "{snoop-dogg}", "{snow-biker}", "{snowboarder}", "{snowman}", "{soccer-ball}", "{soccer-shoe}", "{soloist}", "{somalia}", "{sombrero}", "{songsmith}", "{sonic-boom}", "{soul-hunter}", "{south-korea}", "{space-hunter}", "{space-warden}", "{spain}", "{spark}", "{spider}", "{spiderman}", "{spinner-kid}", "{spooky}", "{spooky2}", "{spy}", "{squiggly}", "{squirrel}", "{stalin}", "{star-eagle}", "{star-fish}", "{star-girl}", "{star-pilot}", "{starfighter}", "{stars-and-stripes}", "{statue}", "{steam-freak}", "{steam}", "{steel-ram}", "{steve}", "{stewie}", "{stone-tool}", "{storm-fist}", "{strawberry}", "{street-bull}", "{stussy}", "{sumo}", "{sun}", "{sunbath}", "{super-car}", "{superstar}", "{supremus}", "{surfer}", "{sweaty}", "{sweden}", "{swimmer}", "{switzerland}", "{t-rex}", "{taiwan}", "{tajikistan}", "{targaryen}", "{target}", "{taurus}", "{techno-kid}", "{tender-heart-bear}", "{tennis}", "{terminita}", "{terra}", "{terrible}", "{texas}", "{thailand}", "{thanksgiving-turkey}", "{the-gaunt}", "{the-maw}", "{the-miasma}", "{the-oracle}", "{the-professional}", "{the-reaper}", "{the-scorcher}", "{the-tinker}", "{thief}", "{think-tank}", "{thirteen}", "{tiger-man}", "{tiger}", "{time-doctor}", "{time-dude}", "{tiny-jack}", "{toco}", "{tortilha}", "{tough}", "{toxic-eater}", "{toxic}", "{triceratops}", "{triceratops2}", "{trickster}", "{trump}", "{tsarist-russia}", "{tsipras}", "{tumblr}", "{turkey}", "{turtle}", "{ufo}", "{ukraine}", "{uncle-sam}", "{undead}", "{unicorn}", "{united-kingdom}", "{universal-ranger}", "{uranus}", "{usa}", "{ussr}", "{vampire}", "{vega}", "{venezuela}", "{venus}", "{vicious}", "{viking}", "{vinesauce}", "{viper}", "{virginia}", "{virgo}", "{virtuoso}", "{virus}", "{volcano}", "{volleyball}", "{wacky-egg}", "{wacky-hero}", "{walking-hand}", "{walrus-ball}", "{war-hero}", "{war-mask}", "{war-paint}", "{war-tank}", "{war-wings}", "{warhorse}", "{warlock}", "{warrior}", "{wasp}", "{water-spirit}", "{watermelon}", "{wendigo}", "{werewolf}", "{white-horse}", "{white-owl}", "{wicked-cat}", "{wicked-clown}", "{wicked}", "{winter-wolf}", "{witch}", "{wojak}", "{wolf}", "{wood-elf}", "{worm-skull}", "{worm-skull2}", "{x-ray}", "{yaranaika}", "{yellow-streak}", "{yellow}", "{yeti}", "{yeti2}", "{yugoslavia}", "{yuno}", "{zany-tree}", "{zap}", "{zebra}", "{zeus}", "{zodiac-aries}", "{zombie-dog}", "{zombie-party}", "{zombie}"];

user = function(username) {
    this.username = username;
    this.botName = "IO-H|SizRex YT";
    this.time = 0;
    this.botsC = 0;
    this.maxbots = 0;
    this.origin = null;
    this.server = null;
    this.user_x = 0;
    this.user_y = 0;
    this.timeLoopInt = 30;
    this.cInterval = 30;
    this.bots = [];
    this.buyingpackage = null;
    this.timeLoad();
}
user.prototype.timeLoad = function() {
    var loadFile = fs.readFileSync("./users.js", "utf-8");
    var users = JSON.parse(loadFile);
    for (var i in users) {
        if (users[i].username == this.username) {
            this.time = users[i].time;
            this.maxbots = users[i].maxbots;
        }
    }
    this.timeLoop();
};
user.prototype.timeLoop = function() {
    if (this.timeLoopInt === null) {
        this.timeLoopInt = setInterval(function() {
            if (this.botsC > 0) {
                if (this.time > 0) {
                    this.time -= 1;
                } else if (this.time == 0) {
                    this.bClose = true;
                    this.receiveDataBotsClose();
                }
            }
        }.bind(this), 1000);
    }
};
user.prototype.timeSave = function() {
    var loadFile = fs.readFileSync("./users.js", "utf-8");
    var users = JSON.parse(loadFile);
    for (var i in users) {
        if (users[i].username == this.username) {
            users[i].time = this.time;
            fs.writeFileSync("./users.js", load(users));
        }
    }
};
user.prototype.getStatus = function() {
    this.botsC = 0;
    for (var i in this.bots) {
        if (this.bots[i].open == true && this.bots[i].close == false) {
            this.botsC++;
        }
    }
    this.status = {
        bots: this.botsC,
        time: this.time,
        maxbots: this.maxbots
    }
    return this.status;
};

user.prototype.requestBuyingPackage = function() {
    return this.buyingpackage;
}

user.prototype.buyfree = function(socket) {
    var loadFile = fs.readFileSync("./users.js", "utf-8");
    var users = JSON.parse(loadFile);
    for (var i in users) {
        if (users[i].username == this.username) {
            if (users[i].time === 0) {
                users[i].maxbots = 15;
                users[i].time = 3600;
                this.time = 3600;
                this.maxbots = 15;
                fs.writeFileSync("./users.js", load(users));
                console.log("user:", this.username, "buy free plan");
                this.buyingpackage = "free";
            }
        }
    }
};


user.prototype.buypremium = function(socket) {
    var loadFile = fs.readFileSync("./users.js", "utf-8");
    var users = JSON.parse(loadFile);
    for (var i in users) {
        if (users[i].username == this.username) {
            if (users[i].time === 0) {
                if (users[i].coins > 300 || users[i].coins == 300) {
                    users[i].coins = users[i].coins - 300;
                    users[i].maxbots = 100;
                    users[i].time = 21600;
                    this.time = 21600;
                    this.maxbots = 100;
                    fs.writeFileSync("./users.js", load(users));
                    console.log("user:", this.username, "buy premium plan")
                    this.buyingpackage = "premium";
                }
            }
        }
    }
};


user.prototype.buygold = function(socket) {
    var loadFile = fs.readFileSync("./users.js", "utf-8");
    var users = JSON.parse(loadFile);
    for (var i in users) {
        if (users[i].username == this.username) {
            if (users[i].time == 0) {
                if (users[i].coins > 200 || users[i].coins == 200) {
                    users[i].coins = users[i].coins - 200;
                    users[i].maxbots = 75;
                    users[i].time = 21600;
                    this.maxbots = 75;
                    this.time = 21600;
                    fs.writeFileSync("./users.js", load(users));
                    console.log("user:", this.username, "buy gold plan");
                    this.buyingpackage = "gold";
                }
            }
        }
    }
};

user.prototype.buymedium = function(socket) {
    var loadFile = fs.readFileSync("./users.js", "utf-8");
    var users = JSON.parse(loadFile);
    for (var i in users) {
        if (users[i].username == this.username) {
            if (users[i].time == 0) {
                if (users[i].coins > 100 || users[i].coins == 100) {
                    users[i].coins = users[i].coins - 100;
                    users[i].maxbots = 50;
                    users[i].time = 21600;
                    this.maxbots = 75;
                    this.time = 21600;
                    fs.writeFileSync("./users.js", load(users));
                    console.log("user:", this.username, "buy medium plan");
                    this.buyingpackage = "medium";
                }
            }
        }
    }
};


user.prototype.swithMode = function(data) {
    if (data.mode == "Mouse") {
        if (this.bots.length > 0) {
            for (var i in this.bots) {
                this.bots[i].aiMode = false;
            }
        }
    } else if (data.mode == "Collect") {
        if (this.bots.length > 0) {
            for (var i in this.bots) {
                this.bots[i].aiMode = true;
            }
        }
    }
};


user.prototype.receiveData = function(data) {
    this.server = data.server;
    this.origin = data.origin;
    console.log("User receiveData:", this.server, this.origin);
    this.receiveDataBotsClose();
    this.connBots();
};
user.prototype.receivePosition = function(data) {
    if (this.bots.length > 0) {
        for (var i in this.bots) {
            this.bots[i].moveToPointer(data.x, data.y, data.mode);
        }
    }
};
user.prototype.receiveDataBotsClose = function() {
    this.bClose = true;
    if (this.bots.length > 0) {
        for (var i in this.bots) {
            if (this.bots[i].ws) {
                clearInterval(this.bots[i].sInterval);
                this.bots[i].bClose = true;
                this.bots[i].ws.close();
            }
        }
        this.bots = [];
    }
    this.timeSave();
    clearInterval(this.timeLoopInt);
    this.timeLoopInt = null;
    this.timeLoad();
}
user.prototype.bSplit = function() {
    if (this.bots.length > 1) {
        for (var i in this.bots) {
            this.bots[i].split();
        }
    }
}
user.prototype.bEject = function() {
    if (this.bots.length > 1) {
        for (var i in this.bots) {
            this.bots[i].eject();
        }
    }
}
user.prototype.connBots = function() {
    this.bClose = false;
    var i = 0;
    if(this.origin == "http://agar.bio" || this.origin == "http://play.agario0.com") {
        this.cInterval = setInterval(function() {
            if (this.bClose == true || i == this.maxbots) return clearInterval(this.cInterval), this.cInterval = null;
            this.bots[i] = new bot(i, this.origin, this.server, names[Math.floor(Math.random() * names.length)]);
            i++
        }.bind(this), 1);
    } else if(this.origin == "http://cellcraft.io"){
        this.cInterval = setInterval(function() {
            if (this.bClose == true || i == this.maxbots) return clearInterval(this.cInterval), this.cInterval = null;
            this.bots[i] = new bot(i, this.origin, this.server, names[Math.floor(Math.random() * names.length)]);
            i++
        }.bind(this), 50);
    } else {
        this.cInterval = setInterval(function() {
            if (this.bClose == true || i == this.maxbots) return clearInterval(this.cInterval), this.cInterval = null;
            this.bots[i] = new bot(i, this.origin, this.server, names[Math.floor(Math.random() * names.length)]);
            i++
        }.bind(this), 350);
    }
}

class Node {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.id = 0;
        this.color = null;
        this.flags = 0;
        this.name = null;
    }
}

function bot(i, origin, server, name) {
    this.i = i;
    this.ws = null;
    this.origin = origin;
    this.server = server;
    this.botName = name;
    this.sInterval = null;
    this.bClose = false;
    this.open = false;
    this.close = false;
    this.realIP = null;
    this.stCInterval = null;

    this.can_split = true;
    this.can_eject = true;

    this.offsetX = 0;
    this.offsetY = 0;

    this.playerNodes = [];
    this.playerNodeIds = [];
    this.allNodes = [];
    this.eatingEvents = [];

    this.connect();
}
bot.prototype.solverHeaders = function() {
    if (this.origin == "http://cellcraft.io") {
        this.result = {
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
            "Cache-Control": "no-cache",
            "Origin": "http://cellcraft.io",
            "Pragma": "no-cache",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36"
        }
    } else if (this.origin == "http://agar.red" || this.origin == "http://gaver.io" || this.origin == "http://agar.pro" || this.origin == "http://oldagar.pro" || this.origin == "http://germs.io") {
        this.result = {
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
            "Cache-Control": "no-cache",
            "Origin": this.origin,
            "Pragma": "no-cache",
            "Cookie": "__cfduid=df2db54a70c595c3c2b5a0d067d1650481506608598",
            "Sec-WebSocket-Extensions": "permessage-deflate; client_max_window_bits",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 YaBrowser/17.11.0.2191 Yowser/2.5 Safari/537.36",
        };
    } else if(this.origin == "http://qwoks.ga" || this.origin == "http://cowpits.ga" || this.origin == "http://agarix.ru") {
        this.result = {
            "Accept-Encoding": "gzip, deflate",
            "Accept-Language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
            "Cache-Control": "no-cache",
            "Origin": this.origin,
            "Pragma": "no-cache",
            "Cookie": "__cfduid=df2db54a70c595c3c2b5a0d067d1650481506608598",
            "Sec-WebSocket-Extensions": "permessage-deflate; client_max_window_bits",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 YaBrowser/17.11.0.2191 Yowser/2.5 Safari/537.36",
            "Referer": this.origin
        }
    } else {
        this.result = {
            "Origin": this.origin,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 YaBrowser/17.11.0.2191 Yowser/2.5 Safari/537.36",
        }
    }
    return this.result;
};
bot.prototype.getJWT = function() {
    this.jwt;
    request({
        url: "http://gaver.io/",
    }, (err, resp, body) => {
        if (!err) {
            this.jwt = body.split("[")[1].split(",")[0].replace("'", "").split("'")[0];
        }
    });
    return this.jwt;
};

bot.prototype.connect = function() {
    this.solver = this.solverHeaders();
    this.buffers = this.setBuffer();
    if (this.origin == "http://gaver.io") {
        this.realIP = this.server.split("=")[0] + "=" + this.getJWT();
    } else if(this.origin == "http://agarix.ru"){
        //this.realIP = this.server.split("0")[0] + Math.random();
        this.realIP = this.server;
    } else {
        this.realIP = this.server;
    }
    this.ws = new WebSocket(this.realIP, null, {
        headers: this.solver,
        agent: createAgent(this.i)
    });
    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = function() {
        if (this.ws && this.ws.readyState == 1) {
            this.open = true;
            this.close = false;
            this.ws.send(this.buffers.Init.Init_1);
            this.ws.send(this.buffers.Init.Init_2);
            if (this.buffers.Init.Init_3 || this.buffers.Init.Init_4) {
                this.ws.send(this.buffers.Init.Init_3);
                this.ws.send(this.buffers.Init.Init_4);
            }
            this.ws.send(this.buffers.sInit);
            if (this.origin == "http://cellcraft.io") {
                this.stCInterval = setInterval(function() {
                    if (this.ws.readyState == 75) {
                        this.ws.send(this.buffers.Init.Init_5);
                        this.ws.send(this.buffers.Init.Init_6);
                    }
                }.bind(this), 15000);
            }
            this.sInterval = setInterval(function() {
                if (this.ws.readyState == 75) {
                    if (this.origin == "http://cellcraft.io") {
                        if (this.buffers.Init.Init_3 && this.buffers.Init.Init_4) {
                            this.ws.send(this.buffers.Init.Init_3);
                            this.ws.send(this.buffers.Init.Init_4);
                        }
                    }
                    this.ws.send(this.buffers.sInit);
                }
            }.bind(this), 2750);
        }
    }.bind(this);
    this.ws.onclose = function(e) {
        if (this.bClose == false) {
            this.connect();
        }
        clearInterval(this.stCInterval);
        clearInterval(this.sInterval);
        this.open = false;
        this.close = true;
    }.bind(this);
    this.ws.onerror = function() {
        
    }.bind(this);
    this.ws.onmessage = function(msg) {
        if(this.ws && this.ws.readyState == 1) {
            var message = new Buffer(msg.data);
            var offset = 0;
            var opcode = message.readUInt8(offset++);
            switch (opcode) {
                case 16:
                    {
                        try 
                        {
                            this.searchBestPellet(message);
                        } catch (e) 
                        {
                        }
                    }
                    break;
                case 32:
                    {
                        this.playerNodeIds.push(message.readUInt32LE(1));
                    }
                    break;
                case 64:
                    {
                        if(this.origin == "http://agar.pro" || this.origin == "http://qwoks.ga")
                        {
                            this.offsetX = (message.readDoubleLE(1) + message.readDoubleLE(17)) / 2;
                            this.offsetY = (message.readDoubleLE(9) + message.readDoubleLE(25)) / 2;
                        }
                    }
                    break;
                case 89:
                    {
                        /*this.botName = this.botName;
                        this.buffers.sInit = new Buffer(5 + 2 * this.botName.length);
                        var trans = message.readUInt32LE(1);
                        var r20 = Math.sqrt(trans - 347712);
                        this.buffers.sInit.writeUInt8(28, 0);
                        this.buffers.sInit.writeUInt32LE(r20, 1);
                        for (var n = 0; n < this.botName.length; n++) {
                            this.buffers.sInit.writeUInt16LE(this.botName.charCodeAt(n), 5 + 2 * n, true);
                        }
                        this.ws.send(this.buffers.Init.Init_3);
                        this.ws.send(this.buffers.Init.Init_4);
                        this.ws.send(this.buffers.sInit);
                        this.sendchat("I ROBOT I WORK!!!" + Math.random());
                        console.log("new spawn buffer detect", r20, trans, new Uint8Array(this.buffers.sInit));*/
                    }
                    break;
            }
        }
    }.bind(this);
};

bot.prototype.sendchat = function(msg) {
    if(this.ws && this.ws.readyState == 1) {
        var buffer = new Buffer(2 + 2 * msg.length);
        var off = 0;
        buffer.writeUInt8(99, off++);
        buffer.writeUInt8(0, off++);
        for(var i = 0; i < msg.length;i++) {
            buffer.writeUInt16LE(msg.charCodeAt(i), 2 + 2 * i, true);
            off+= 2;
        }
        this.ws.send(buffer);
    }
};

bot.prototype.split = function() {
    if (this.ws && this.ws.readyState == 1) {
        if (this.can_split == true) {
            var buf = new Buffer([17]);
            this.ws.send(buf);
        }
    }
}
bot.prototype.eject = function() {
    if (this.ws && this.ws.readyState == 1) {
        if (this.can_eject == true) {
            if (this.origin == "http://cellcraft.io") {
                var buf = new Buffer([22]);
                this.ws.send(buf);
            } else {
                var buf = new Buffer([21]);
                this.ws.send(buf);
            }
        }
    }
}
bot.prototype.setBuffer = function() {
    if (this.origin == "http://gaver.io") {
        var Init_1 = new Buffer([254, 5, 0, 0, 0]);
        var Init_2 = new Buffer([255, 35, 18, 56, 9]);

        var sInit = new Buffer(1 + 2 * this.botName.length);
        sInit.writeUInt8(0, 0);
        for (var n = 0; n < this.botName.length; n++) {
            sInit.writeUInt16LE(this.botName.charCodeAt(n), 1 + 2 * n, true);
        }
    } else if (this.origin == "http://cellcraft.io") {
        var Init_1 = new Buffer([254, 5, 0, 0, 0]);
        var Init_2 = new Buffer([255, 50, 137, 112, 79]);
        var Init_3 = new Buffer([42]);
        var Init_4 = new Buffer([90, 51, 24, 34, 131]);
        var Init_5 = new Buffer([33]);
        var Init_6 = new Buffer([39]);

        var sInit = new Buffer(3 + 2 * this.botName.length);
        sInit.writeUInt8(0, 0);
        sInit.writeUInt16LE(59, 1);
        for (let i = 0; i < this.botName.length; i++) sInit.writeUInt16LE(this.botName.charCodeAt(i), 3 + 2 * i);
    } else if (this.origin == "http://www.agario.info") {
        var Init_1 = new Buffer([254, 4, 0, 0, 0]);
        var Init_2 = new Buffer([255, 114, 97, 103, 79]);

        var sInit = new Buffer(1 + 2 * this.botName.length);
        sInit.writeUInt8(0, 0);
        for (var n = 0; n < this.botName.length; n++) {
            sInit.writeUInt16LE(this.botName.charCodeAt(n), 1 + 2 * n, true);
        }
    } else if (this.origin == "http://agar.red") {
        var Init_1 = new Buffer([254, 5, 0, 0, 0]);
        var Init_2 = new Buffer([255, 0, 0, 0, 0]);

        this.botName = skins[Math.floor(Math.random() * skins.length)] + names[Math.floor(Math.random() * names.length)];

        var sInit = new Buffer(1 + 2 * this.botName.length);
        sInit.writeUInt8(0, 0);
        for (var n = 0; n < this.botName.length; n++) {
            sInit.writeUInt16LE(this.botName.charCodeAt(n), 1 + 2 * n, true);
        }
    } else if(this.origin == "http://qwoks.ga" || this.origin == "http://cowpits.ga" || this.origin == "http://agarix.ru"){
        var Init_1 = new Buffer([254, 6, 0, 0, 0]);
        var Init_2 = new Buffer([255, 1, 0, 0, 0]);

        var sInit = [];
        sInit.push(0);
        var bytesStr = unescape(encodeURIComponent(this.botName));
        for (var i = 0, l = bytesStr.length; i < l; i++) sInit.push(bytesStr.charCodeAt(i));
    } else if(this.origin == "http://agarz.com") {
        var Init_1 = new Buffer([255,114,97,103,79]);

    } else if(this.origin == "http://oldagar.pro") {
        var Init_1 = new Buffer([254, 5, 0, 0, 0]);
        var Init_2 = new Buffer([255, 0, 0, 0, 0]);

        var sInit = new Buffer(1 + 2 * this.botName.length);
        sInit.writeUInt8(0, 0);
        for (var n = 0; n < this.botName.length; n++) {
            sInit.writeUInt16LE(this.botName.charCodeAt(n), 1 + 2 * n, true);
        }
    } else if(this.origin == "http://germs.io"){
        var Init_1 = new Buffer([123, 66, 235, 136, 245]);
        var Init_2 = new Buffer([255]);

        var sInit = new Buffer(1 + 2 * this.botName.length);
        sInit.writeUInt8(0, 0);
        for (var n = 0; n < this.botName.length; n++) {
            sInit.writeUInt16LE(this.botName.charCodeAt(n), 1 + 2 * n, true);
        }
    } else {
        var Init_1 = new Buffer(5);
        Init_1.writeUInt8(254, 0);
        Init_1.writeUInt32LE(5, 1);
        var Init_2 = new Buffer(5);
        Init_2.writeUInt8(255, 0);
        Init_2.writeUInt32LE(154669603, 1);

        var sInit = new Buffer(1 + 2 * this.botName.length);
        sInit.writeUInt8(0, 0);
        for (var n = 0; n < this.botName.length; n++) {
            sInit.writeUInt16LE(this.botName.charCodeAt(n), 1 + 2 * n, true);
        }
    }
    if (this.origin == "http://cellcraft.io") {
        this.res = {
            Init: {
                Init_1: Init_1,
                Init_2: Init_2,
                Init_3: Init_3,
                Init_4: Init_4,
                Init_5: Init_5,
                Init_6: Init_6
            },
            sInit: sInit
        };
    } else if(this.origin == "http://agarz.com") {
        this.res = {
            Init: {
                Init_1: Init_1,
                Init_2: Init_2,
                Init_3: Init_3,
                Init_4: Init_4
            },
            sInit: sInit
        };
    } else {
        this.res = {
            Init: {
                Init_1: Init_1,
                Init_2: Init_2
            },
            sInit: sInit
        };
    }
    return this.res
};
bot.prototype.searchBestPellet = function(buf) {
    let off = 0;
    if (buf.readUInt8(off++) != 16) return false;

    let eatRecordLength = buf.readUInt16LE(off);
    off += 2;

    this.eatingEvents = [];
    for (let i = 0; i < eatRecordLength; i++) {
        this.eatingEvents.push({
            eater: buf.readUInt32LE(off),
            victim: buf.readUInt32LE(off + 4)
        });

        off += 8;
    }

    while (true) {
        let n = new Node();

        n.id = buf.readUInt32LE(off);
        off += 4;
        if (!n.id) break;
        if (this.origin == "http://agar.red" || this.origin == "http://cellcraft.io" || this.origin == "http://gaver.io" || this.origin == "http://agar.pro" || this.origin == "http://qwoks.ga" || this.origin == "http://oldagar.pro") {
            n.x = buf.readInt32LE(off);
            off += 4;
            n.y = buf.readInt32LE(off);
            off += 4;
        } else {
            n.x = buf.readInt16LE(off);
            off += 2;
            n.y = buf.readInt16LE(off);
            off += 2;
        }
        n.size = buf.readInt16LE(off);
        off += 2;
        n.color = {
            r: buf.readUInt8(off++),
            g: buf.readUInt8(off++),
            b: buf.readUInt8(off++)
        };

        n.flags = buf.readUInt8(off++);

        if (n.flags & 2) off += 4;
        if (n.flags & 4) off += 8;
        if (n.flags & 8) off += 16;

        let ch = 0;
        n.name = '';
        do {
            n.name += String.fromCharCode((ch = buf.readUInt16LE(off)));
            off += 2;
        } while (ch != 0);

        if (this.allNodes.hasOwnProperty(n.id)) {
            this.allNodes[n.id] = n;
        } else {
            this.allNodes[n.id] = n;
        }
    }

    let removeQueueLength = buf.readUInt32LE(off);
    off += 4;
    for (let i = 0; i < removeQueueLength; i++) {
        let id = buf.readUInt32LE(off);
        off += 4;

        if (this.allNodes.hasOwnProperty(id)) {
            delete this.allNodes[id];
        }
    }
}

bot.prototype.moveToPointer = function(x, y, mode) {
    if (this.ws && this.ws.readyState == 1) {
        if (mode == "Collect") {
            var clientX = 0,
                clientY = 0,
                count = 0,
                smallestSize = 10000;

            for (var i = 0; i < this.playerNodeIds.length; i++) {
                if (this.allNodes.hasOwnProperty(this.playerNodeIds[i])) {
                    let node = this.allNodes[this.playerNodeIds[i]];
                    clientX += node.x;
                    clientY += node.y;
                    if (node.size < smallestSize) smallestSize = node.size;
                    count++;
                }
            }

            clientX /= count;
            clientY /= count;

            var followNode = null;

            var bestDistance = 10000.0;

            Object.keys(this.allNodes).forEach(key => {
                var node = this.allNodes[key];
                if (node.size < smallestSize * 0.85) {
                    var dist = Math.abs(node.x - clientX) + Math.abs(node.y - clientY);
                    if (dist < bestDistance) {
                        bestDistance = dist;
                        followNode = node;
                    }
                }
            });
            if (followNode) {
                if (this.origin == "http://agar.bio" || this.origin == "http://play.agario0.com" || this.origin == "http://agar.pro" || this.origin == "http://bomb.agar.bio") {
                    var buf = new Buffer(21);
                    buf.writeUInt8(16, 0);
                    buf.writeDoubleLE(followNode.x, 1);
                    buf.writeDoubleLE(followNode.y, 9);
                    buf.writeUInt32LE(0, 17);
                    this.ws.send(buf);
                } else {
                    var buf = new Buffer(13);
                    buf.writeUInt8(16, 0);
                    buf.writeInt32LE(followNode.x, 1);
                    buf.writeInt32LE(followNode.y, 5);
                    buf.writeUInt32LE(0, 9);
                    this.ws.send(buf);
                }
                this.can_split = false;
                this.can_eject = false;
            } else if (!followNode) {
                var searched_botX = 0,
                    searched_botY = 0,
                    counter = 0,
                    searched_botSmalledMass = 10000;
                for (var i = 0; i < this.playerNodeIds.length; i++) {
                    if (this.allNodes.hasOwnProperty(this.playerNodeIds[i])) {
                        let noder = this.allNodes[this.playerNodeIds[i]];
                        searched_botX += noder.x;
                        searched_botY += noder.y;
                        if (noder.size < searched_botSmalledMass) searched_botSmalledMass = noder.size;
                        counter++;
                    }
                }

                searched_botX /= counter;
                searched_botY /= counter;

                var bestBotDistance = 10000.0;

                var Follow_bot = null;

                Object.keys(this.allNodes).forEach(key => {
                    var nodePlayer = this.allNodes[key];
                    if(nodePlayer.name == "ĬỢ ĤĚĹҎĚŔ\u0000" || nodePlayer.name == "ṦĬẐŔĚẌ ẎṪ\u0000") {
                        if(nodePlayer.size > searched_botSmalledMass) {
                            var distancion = Math.abs(nodePlayer.x - searched_botX) + Math.abs(nodePlayer.y - searched_botY);
                            if (distancion < bestBotDistance) {
                                bestBotDistance = distancion;
                                Follow_bot = nodePlayer;
                            }
                        }
                    }
                });
                if(Follow_bot) {
                    if (this.origin == "http://agar.bio" || this.origin == "http://play.agario0.com" || this.origin == "http://agar.pro" || this.origin == "http://bomb.agar.bio") {
                        var buf = new Buffer(21);
                        buf.writeUInt8(16, 0);
                        buf.writeDoubleLE(Follow_bot.x + this.offsetX, 1);
                        buf.writeDoubleLE(Follow_bot.y + this.offsetY, 9);
                        buf.writeUInt32LE(0, 17);
                        this.ws.send(buf);
                    } else {
                        var buf = new Buffer(13);
                        buf.writeUInt8(16, 0);
                        buf.writeInt32LE(Follow_bot.x + this.offsetX, 1);
                        buf.writeInt32LE(Follow_bot.y + this.offsetY, 5);
                        buf.writeUInt32LE(0, 9);
                        this.ws.send(buf);
                    }
                    this.can_split = false;
                    this.can_eject = false;
                }
            }
        } else {
            if (this.origin == "http://agar.bio" || this.origin == "http://play.agario0.com" || this.origin == "http://agar.pro" || this.origin == "http://bomb.agar.bio") {
                var buf = new Buffer(21);
                buf.writeUInt8(16, 0);
                buf.writeDoubleLE(x + this.offsetX, 1);
                buf.writeDoubleLE(y + this.offsetY, 9);
                buf.writeUInt32LE(0, 17);
                this.ws.send(buf);
            } else {
                var buf = new Buffer(13);
                buf.writeUInt8(16, 0);
                buf.writeInt32LE(x + this.offsetX, 1);
                buf.writeInt32LE(y + this.offsetY, 5);
                buf.writeUInt32LE(0, 9);
                this.ws.send(buf);
            }
            this.can_split = true;
            this.can_eject = true;
        }
    }
}


module.exports = user;