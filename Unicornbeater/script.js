"use strict"

const OP = {
coins: 0,
rainbowHair:0,
horns:0,
heroes:[0,0,0,0,0],
hairUpgrades:[0,0,0],
upgrades:{click:0,dps:0},
unlocks:{
    coins: false,
    rainbowHair: false,
    horns: false,
    heroes: false,
},
maxBuy: false
}

const OG = {
levels: 0,
damageDealt: 0,
rainbowHairGainCost:4,
}

let copyObject = function(x){
if(typeof x!=="object") return x
let object = new x.constructor()
for(let i in x){
    object[i] = copyObject(x[i])
}
return object
}

let player = copyObject(OP)
let game = copyObject(OG)


const factorials = [1, 1, 2, 6, 24, 120, 720, 5040]
const healthMults = [1, 2, 5, 10, 20, 40, 80]
const godHealthMults = [100,200]

let unicornLVL = 1;
let unicornType = 0;
let unicornCounters = [0, 1, 1, 1, 1, 1, 1]
let godType = 0
let HPmult = 1;
let dpc = 1;
let dps = 0;
let dpcLvl = 0;
let dpsLvl = 0;
let autoBuy = false;
let autoBuyType = "Smart"

let coins = 0;
let horns = 0;
let coinGain = 1;
let rainbowHairGain = 1;
let hornsGain = 1;
let luck = 5;

let lootBoxCost = 5;
let lootBoxes = 0;
let heroNames = ["Hero of Wealth", "Hero of Strength", "Hero of Sales", "Hero of Weakness", "Hero of Luck"];
let heroGolden = [false, false, false, false, false]
let increaseDPCcost = Math.round(Math.pow((dpcLvl + 1), salesEffect(player.heroes[2])));
let increaseDPScost = Math.round(Math.pow((dpsLvl + 1), salesEffect(player.heroes[2])));

let health = document.getElementById("Health");

let factorial = function(x){
let num = 1
while(x){
    num*=x
    x--    
}
return num
}

let type = function(){
    return ["Common","Uncommon","Rare","Epic","Legendary","Mythic","Exotic"][unicornType]
}

let unicornHP = function(){
    let scaling = weaknessEffect(player.heroes[3]);
    if(godType==0){
        if (game.levels <= 100) {
            return healthMults[unicornType] * Math.round(20 * Math.pow(scaling, game.levels));
        }
        else if (game.levels <= 250) {
            return healthMults[unicornType] * Math.round(20 * Math.pow(scaling, game.levels + (game.levels-100)*(game.levels-99)/200));
        }
        else {
            return healthMults[unicornType] * Math.round(20 * Math.pow(scaling, game.levels + (game.levels-100)*(game.levels-99)/100));
        }
    }
    else return godHealthMults[godType] * Math.round(20 * Math.pow(scaling, unicornLVL + (unicornLVL-100)*(unicornLVL-99)/100));
}

function update() {

    updateCoinGain();
	dpc = Math.round((dpcLvl+1) * (1 + strengthEffect(player.heroes[1]) / 100));
    if (player.heroes[1] > 0) {
        document.querySelector("#Strength").innerHTML = "(" + displayN(dps) + " + " + displayN(Math.round(dps * strengthEffect(player.heroes[1]) / 100)) + ")";
    }
 
}

function calculateChance(type) {
	let bonus = Math.max(1, unicornCounters[type] * Math.power(1 / luck, type));
	return bonus * Math.power(1 / luck, type);
}

function determineUnicornType() {
	let highest = 0;
	if (Math.random() < calculateChance(1)) {highest = 1};
	if (Math.random() < calculateChance(2)) {highest = 2};
	if (Math.random() < calculateChance(3)) {highest = 3};
	if (Math.random() < calculateChance(4)) {highest = 4};
	if (heroGolden[4]) {
		if (Math.random() < calculateChance(5)) {highest = 5};
		if (Math.random() < calculateChance(6)) {highest = 6};
	}
	// this should be in a for loop
	unicornsCounters[1]++;
	unicornsCounters[2]++;
	unicornsCounters[3]++;
	unicornsCounters[4]++;
	unicornsCounters[5]++;
	unicornsCounters[6]++;
	unicornsCounters[highest] = 1;
	return highest
}

function dealDamage(type) {
    let damage = type?player.upgrades.dps*(player.upgrades.dps+1)/2:player.upgrades.click+1
    damage = Math.floor((1 + strengthEffect(player.heroes[1]) / 100)*damage)
    game.damageDealt += damage;
    if (game.damageDealt >= unicornHP()) {
        if ( unicornType>=0 ) player.unlocks.coins = true
        if ( unicornType>=1 ) player.unlocks.rainbowHair = true
        if ( unicornType>=2 ) player.unlocks.horns = true
		if (unicornType == -1) {
			godlyPrestige();
			return;
		}
        player.coins+=factorials[unicornType]*coinGain
        player.rainbowHair+=(unicornType>=1?factorials[unicornType-1]:0)*rainbowHairGain
        player.horns+=(unicornType>=2?factorials[unicornType-2]:0)*hornsGain
        game.levels++
        luck = luckEffect(player.heroes[4]);
	unicornType = determineUnicornType();
	unicornHP();

		if (game.levels == 250) {
			HPmult = 50;
			unicornType = -1;
            godType = 1
		}
		else if (game.levels == 500) {
			HPmult = 100;
			unicornType = -1;
            godType = 2
		}
        else godType = 0
		
		
        game.damageDealt = 0;
    }
}

function wealthEffect(x) {
    if (!x) {
        return 0;
	} else if (x <= 5) {
		return 100 * x;
	} else {
		return 100 * x + (x-5)*(x-4)/2 * 100;
	}
}

function strengthEffect(x) {
    if (!x) {
        return 0;
	} else if (x <= 5) {
		return 50 * x;
	} else {
		return 50 * x + (x-5)*(x-4)/2 * 50;
	}
}

function salesEffect(x) {
    let n = 1 + 1 / (1 + Math.pow(x, 2/3)*1.5 / 5);
    return Math.round(1000 * n) / 1000;
}

function weaknessEffect(x) {
    let n = Math.pow(1.07, (1 / (1 + Math.pow(x, 2/3)*2 / 10)));
    return Math.round(10000 * n) / 10000;
}

function luckEffect(x) {
    let n = 4.5 / (1 + Math.pow(Math.pow(x, 2/3)*2, 0.8) / 10);
    return Math.round(100 * n) / 100;
}

function getRandomhero() {
	return Math.floor(Math.random() * 5) + 1;
}

function buyCoinUpgrade(type){
if(type==0){
do{
let cost = Math.round(Math.pow((player.upgrades.click + 1), salesEffect(player.heroes[2])));
if(player.coins>=cost){
player.coins-=cost
player.upgrades.click++
}
}while(player.maxBuy&&player.coins>=Math.round(Math.pow((player.upgrades.click + 1), salesEffect(player.heroes[2]))))
}

if(type==1)
do{
let cost = Math.round(Math.pow((player.upgrades.dps + 1), salesEffect(player.heroes[2])));
if(player.coins>=cost){
player.coins-=cost
player.upgrades.dps++
}
}while(player.maxBuy&&player.coins>=Math.round(Math.pow((player.upgrades.dps + 1), salesEffect(player.heroes[2]))))

}

function toggleMaxBuy() {
	player.maxBuy = !player.maxBuy
}

function buyAuto() {
	if (autoBuy) {
		if (autoBuyType == "Rainbow Hair") {
			doubleplayer.rainbowHairGain();
		}
		else if (autoBuyType == "Horns") {
			doubleHornsGain();
		}
		else if (autoBuyType == "Smart") { 
			doubleHornsGain();
			doubleplayer.rainbowHairGain();
			if (player.rainbowHair >= 5 * coinGainCost) {
				doubleCoinGain();
			}
		}		
	}

}

function chooseAutoBuy() {
	if (autoBuyType == "Smart") {autoBuyType = "Rainbow hair"}
	else if (autoBuyType == "Rainbow hair") {autoBuyType = "Horns"}
	else if (autoBuyType == "Horns") {autoBuyType = "Smart"}
}

function toggleAutoBuy() {
	autoBuy = autoBuy ? false : true;
}

function buyDoubler(type){
if(type==0){
    if (player.rainbowHair >= 2*2**player.hairUpgrades[0]) {
        player.rainbowHair -= 2*2**player.hairUpgrades[0];
        player.hairUpgrades[0]++
    }
}
if(type==1){
    if (player.rainbowHair >= game.rainbowHairGainCost) {
        player.rainbowHair -= game.rainbowHairGainCost;
        game.rainbowHairGainCost *= 3;
		if (game.rainbowHairGainCost > 100) {game.rainbowHairGainCost *= 1 + Math.floor(Math.log10(game.rainbowHairGainCost))/10};
		game.rainbowHairGainCost = Math.round(game.rainbowHairGainCost);
        player.rainbowHairGain *= 2;
        player.hairUpgrades[1]++
    }    
}
if(type==2){
    if (player.rainbowHair >= 8*3**player.hairUpgrades[2]) {
        player.rainbowHair -= 8*3**player.hairUpgrades[2];
        player.hairUpgrades[2]++
    }
}
}

function buyLootBox() {
    if (horns >= lootBoxCost) {
        horns -= lootBoxCost;
        lootBoxes++;
        lootBoxCost++;
    }
}

function updateCoinGain() {
    coinGain = 2**player.hairUpgrades[0];
    coinGain = Math.round(coinGain * (1 + wealthEffect(player.heroes[0]) / 100));
}

function heal() {
	if (game.levels == 250) {
		game.damageDealt -= Math.round(unicornHP()*0.02);
	}
	else if (game.levels == 500) {
		game.damageDealt -= Math.round(unicornHP()*0.04);
	}
	if (game.damageDealt < 0) {
		game.damageDealt = 0;
	}
} 

function prestige() {
    if (lootBoxes > 0) {
        player.unlocks.heroes = true
        while (lootBoxes > 0) {
            lootBoxes--;
            let rng = Math.random();
            unicorn = 0;
            if (rng < 0.20) {
                unicorn = 0;
            } else if (rng < 0.40) {
                unicorn = 1;
            } else if (rng < 0.60) {
                unicorn = 2;
            } else if (rng < 0.80) {
                unicorn = 3;
            } else if (rng < 1.00) {
                unicorn = 4;
            }
			if (lootBoxCost < 20) {
				alert("You found a " + heroNames[unicorn] + "!");
			} 
            player.heroes[unicorn]++;

            game.levels = 0;
            game.damageDealt = 0;
            unicornType = "Common";
            dpc = 1;
            dps = 0;
            dpcLvl = 0;
            dpsLvl = 0;
            coins = 0;
            player.rainbowHair = 0;
            player.rainbowHairGain = 1;
            hornsGain = 1;
            game.rainbowHairGainCost = 4;
            increaseDPCcost = Math.round(Math.pow((dpcLvl + 1), salesEffect(player.heroes[2])));
            increaseDPScost = Math.round(Math.pow((dpsLvl + 1), salesEffect(player.heroes[2])));
        }
    }
}

function godlyPrestige() {
	
	game.levels = 0;
	game.damageDealt = 0;
	unicornType = "Common Unicorn";
	HPmult = 1;
	dpc = 1;
	dps = 0;
	dpcLvl = 0;
	dpsLvl = 0;
	player.maxBuy = false;
	coins = 0;
	player.rainbowHair = 0;
	horns = 0;
	coinGain = 1;
	player.rainbowHairGain = 1;
	hornsGain = 1;
	luck = 4.5;
	game.rainbowHairGainCost = 4;
	lootBoxCost = 5;
	lootBoxes = 0;
	player.heroes = [0, 0, 0, 0, 0];
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

function displayN(n) {
    n = Math.round(n);
    let c = n.toLocaleString("en-US");
    return c;
}

load()
setInterval( () => save(), 33);
setInterval( () => update(), 33);
setInterval( () => dealDamage(1), 1000);
setInterval( () => heal(), 1000);
setInterval( () => buyAuto(), 100);
