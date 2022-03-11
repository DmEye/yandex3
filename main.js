const express = require("express");
const fs = require("fs");



const app = express();
const jsonParser = express.json();
const port = 8080;

const promoPath = "C:\\Projects\\code-workspace\\Яндекс\\promo.json";
const prizePath = "C:\\Projects\\code-workspace\\Яндекс\\prize.json";
const resultPath = "C:\\Projects\\code-workspace\\Яндекс\\result.json";
const userPath = "C:\\Projects\\code-workspace\\Яндекс\\user.json";

app.use(express.static(__dirname + "/public"))


app.post('/promo', jsonParser, (req, res) => {
    console.log(req.body);
    if (!req.body) return res.sendStatus(400);
    const namePromo = req.body.name;
    const decrPromo = req.body.description;

    let promo = {name: namePromo, description: decrPromo};
    let data = fs.readFileSync(promoPath, "utf8");
    let promos = JSON.parse(data);
    const id = Math.max.apply(Math, promos.map(function(o){return o.id}));
    promo.id = id + 1;
    promos.push(promo);
    data = JSON.stringify(promos);
    fs.writeFileSync(promoPath, data);
    res.send(String(promo.id));
    console.log(promo)
});
app.get("/promo", (req, res) => {
    let data = fs.readFileSync(promoPath, "utf8");
    let promos = JSON.parse(data);
    res.send(promos)
});

app.get("/promo/:id", (req, res) => {
    const id = req.params.id;
    let data = fs.readFileSync(promoPath, "utf8");
    let promos = JSON.parse(data);
    let promo = null;
    
    for (var i = 0; i < promos.length; ++i) {
        if (promos[i].id == id)
        {
            promo = promos[i];
            break;
        }
    }
    if (promo) {
        data_users = fs.readFileSync(userPath, "utf8");
        users = JSON.parse(data_users);
        data_pres = fs.readFileSync(prizePath, "utf8");
        prizes = JSON.parse(data_pres);
        prizes_arr = []
        users_arr = []
        for (let i = 0; i < promos.length; ++i) {
            for (let j = 0; j < users.length; ++j) {
                if (users[j].idPromo == promos[i]) {
                    users_arr.push(users[j]);
                }
            }
            for (let j = 0; j < prizes.length; ++j) {
                if (prizes[j].idPromo == promos[i]) {
                    prizes_arr.push(prizes[j]);
                }
            }
            promos[i].prizes = prizes;
            promos[i].participants = users;
        }
        res.send(promos);
    } else {
        res.status(404).send();
    }
});
app.put("/promo/:id", (req, res) => {
    if (!req.body) return res.status(400).send();
    else if (req.body.name == "") return res.status(401).send();
    else {
        const id = req.params.id;
        const name = req.body.name;
        const description = req.body.description;
        let data = fs.readFileSync(promoPath, "utf8");
        let promos = JSON.parse(data);
        let promo = null;
        
        for (var i = 0; i < promos.length; ++i) {
            if (promos[i].id == id)
            {
                promo = promos[i];
                break;
            }
        }
        if (promo) {
            promo.name = name;
            promo.description = description;
            data = JSON.stringify(promos);
            fs.writeFileSync(promoPath, data);
            console.log(promo)
        } else {
            return res.status(404).send();
        }
    }
});
app.delete("/promo/:id", (req, res) => {
    const id = req.params.id;
    let data = fs.readFileSync(promoPath, "utf8");
    let promos = JSON.parse(data);
    let index = -1;
    
    for (var i = 0; i < promos.length; ++i) {
        if (promos[i].id == id)
        {
            index = i;
            break;
        }
    }
    if (index > -1) {
        const promo = promos.splice(index, 1)[0];
        data = JSON.stringify(promos);
        fs.writeFileSync(promoPath, data);
        console.log(promo)
    } else {
        return res.status(404).send();
    }
});

// ------
app.post("/promo/:id/participant", jsonParser, (req, res) => {
    const id_promo = req.params.id;
    console.log(id_promo + " " + req.body.user_name)
    if (!req.body) return res.status(400).send();

    const name_user = req.body.user_name;
    let data = fs.readFileSync(promoPath, "utf8");
    let promos = JSON.parse(data);
    let has_promo = false;

    for (var i = 0; i < promos.length; ++i) {
        if (promos[i].id == id_promo)
        {
            has_promo = true;
            break;
        }
    }

    if (has_promo) {
        let user = {name:name_user, idPromo: id_promo};

        data_users = fs.readFileSync(userPath, "utf8");
        users = JSON.parse(data_users);
        const id = Math.max.apply(Math, users.map(function(o){return o.id}));
        user.id = id + 1;
        users.push(user);
        data_users = JSON.stringify(users);
        fs.writeFileSync(userPath, data_users);
        res.send(user.id);
    } else {
        res.status(404).send();
    }
});
app.delete("/promo/:id/participant/:id_user", (req, res) => {
    const id_promo = req.params.id;
    const id_user = req.params.id_user;

    let data = fs.readFileSync(userPath, "utf8");
    let users = JSON.parse(data);
    let index = -1;
    
    for (var i = 0; i < users.length; ++i) {
        if (users[i].id == id_user && users[i].idPromo == id_promo)
        {
            index = i;
            break;
        }
    }

    if (index > -1) {
        const user = promos.splice(index, 1)[0];
        data = JSON.stringify(promos);
        fs.writeFileSync(userPath, data);
        console.log(user)
    } else {
        return res.status(404).send();
    }
});

// ------
app.post("/promo/:id/prize", (req, res) => {
    const id_promo = req.params.id;
    if (!req.body) return res.status(400).send();

    const desc = req.body.description;
    let data = fs.readFileSync(promoPath, "utf8");
    let promos = JSON.parse(data);
    let has_promo = false;

    for (var i = 0; i < promos.length; ++i) {
        if (promos[i].id == id_promo)
        {
            has_promo = true;
            break;
        }
    }

    if (has_promo) {
        let prize = {description:desc, idPromo:id_promo};

        data_pr = fs.readFileSync(prizePath, "utf8");
        prizes = JSON.parse(data_pr);
        const id = Math.max.apply(Math, users.map(function(o){return o.id}));
        prize.id = id + 1;
        prizes.push(user);
        data_pr = JSON.stringify(prizes);
        fs.writeFileSync(userPath, data_pr);
        res.send(String(prize.id));
    } else {
        res.status(404).send();
    }
});

app.delete("/promo/:id/prize/:id_pr", (req, res) => {
    const id_promo = req.params.id;
    const id_prize = req.params.id_pr;

    let data = fs.readFileSync(prizePath, "utf8");
    let prizes = JSON.parse(data);
    let index = -1;
    
    for (var i = 0; i < prizes.length; ++i) {
        if (prizes[i].id == id_pr && prizes[i].idPromo == id)
        {
            index = i;
            break;
        }
    }

    if (index > -1) {
        data = JSON.stringify(prizes);
        fs.writeFileSync(prizePath, data);
    } else {
        return res.status(404).send();
    }
});

app.listen(port);