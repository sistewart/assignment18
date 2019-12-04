const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nbaPlayers', {useUnifiedTopology:true, useNewUrlParser:true})
.then(() => console.log("Connected to mongodb..."))
.catch((err => console.error("Could not connect to mongodb", err)));

const playerSchema = new mongoose.Schema({
    name: String,
    age: Number,
    hometown: String,
    former:[String],
    current: String,
    years: Number
});

const Player = mongoose.model('Player', playerSchema);

async function makePlayer(player){
    const result = await player.save();
    console.log(result);
}

function validatePlayer(player){
    const schema = {
        name: Joi.string().min(6).required(),
        age: Joi.number(),
        hometown: Joi.string().min(5).required(),
        former: Joi.allow(),
        current: Joi.string().min(3).required(),
        years: Joi.number()
    };
    return Joi.validate(player,schema);
}

app.post('/api/players', (req,res)=>{
    const result = validatePlayer(req.body);
    if(result.error){
        res.status(400).send(result.err.details[0].message);
        return;
    }

    const player = new Player({
        name: req.body.name,
        age: Number(req.body.age),
        hometown: req.body.hometown,
        former: req.body.former,
        current: req.body.current,
        years: Number(req.body.years)
    });

    makePlayer(player);
    res.send(player);
});

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/index.html');
});

async function getPlayers(res){
    const players = await Player.find();
    console.log(players);
    res.send(players);
}

app.get('/api/players', (req,res)=>{
    const players = getPlayers(res);
});

app.get('/api/players/:id', (req,res)=>{
    let player = getPlayer(req.params.id,res)
})

async function getPlayer(id,res){
    const player = await Player
    .findOne({_id:id});
    console.log(player);
    res.send(player);
}

app.put('/api/players/:id',(req,res)=>{
    const result = validatePlayer(req.body);
    if(result.error){
        res.status(400).send(result.error.detail[0].message);
        return;
    }
    console.log("*******Years before" + req.body.name);
 
    updatePlayer(res,req.params.id, req.body.name, req.body.age, req.body.hometown, req.body.former, req.body.current, req.body.years);
});

async function updatePlayer(res,id,name,age,hometown,former,current,years){
    console.log("**********Years " + years);
    const result = await Player.updateOne({_id:id},{
        $set:{
            name: name,
            age: Number(age),
            hometown: hometown,
            former: former,
            current: current,
            years: Number(years)
        }
    })
    res.send(result);
}

app.delete('/api/players/:id', (req,res) => {
    removePlayer(res,req.params.id);
});

async function removePlayer(res,id){
    const player = await Player.findByIdAndRemove(id);
    res.send(player);
}

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`listening on port ${port}`);
});
