"use strict"

let copyObject = function(x){
if(typeof x!=="object") return x
let object = new x.constructor()
for(let i in x){
    object[i] = copyObject(x[i])
}
return object
}

let pluralize = function(x,y="s",z=""){
if(x===1) return z
return y
}

function save() {
    localStorage.unicorn = btoa(JSON.stringify({player,game}));
}

function load() {
    if (localStorage.unicorn){
    let info = JSON.parse(atob(localStorage.unicorn));
    game = copyObject(info.game)
    player = copyObject(info.player)
    }
}

function hardReset() {
    if (prompt("Type RESET if you want to reset all progress") == "RESET") {
        player = copyObject(OP)
        game = copyObject(OG)
        localStorage.unicorn = btoa(JSON.stringify({game,player}));
        location.reload()
    }

}

function weightedRandom(...chances){
let total = 0
if(chances.includes(Infinity)){
let infArray = []
for(let i=0;i<chances.length;i++){
if(!isFinite(chances[i])) infArray.push(i)
}
return infArray[Math.floor(Math.random()*infArray.length)]
}
for(let chance of chances){
total += chance
}
let value = Math.random()*total
for(let i=0;i<chances.length;i++){
if(chances[i]>value) return i
else value-=chances[i]
}
}

let type = function(){
    return ["Common","Uncommon","Rare","Epic","Legendary","Mythical","Exotic"][game.unicornType]
}

function image(){
return "images/"+type().toLowerCase()+".png"
}

const baseRewards = [1, 2, 16/3, 2560/153, 204800000/3503547, 1662976000000000000/7530735651655851, 495607278571847680000000000000000000000/559310708577232744347594041330516361]
const healthMults = [1, 2, 5, 10, 20, 40, 80]
const godHealthMults = [100,200]