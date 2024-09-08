"use strict"

const OP = {
coins: 0,
rainbowHair:0,
horns:0,
heroes:{0:0,1:0,2:0,3:0,4:0},
hairUpgrades:[0,0,0],
upgrades:{click:0,dps:0},
unlocks:{
    coins: false,
    rainbowHair: false,
    horns: false,
    heroes: false,
},
maxBuy: false,
lootBoxes:0,
}

const OG = {
levels: 0,
damageDealt: 0,
rainbowHairGainCost:4,
boughtLootboxes: 0,
unicornCounter: [0.8,0.16,0.032,0.0064,0.00128,0.000256,0.000064],
unicornType:0
}

let player = copyObject(OP)
let game = copyObject(OG)






let unicornLVL = 1;
let godType = 0
let HPmult = 1;
let dpc = 1;
let dps = 0;
let dpcLvl = 0;
let dpsLvl = 0;
let autoBuy = false;
let autoBuyType = "Smart"

let horns = 0;

let lootBoxCost = 5;
let lootBoxes = 0;
let heroNames = ["Hero of Wealth", "Hero of Strength", "Hero of Sales", "Hero of Weakness", "Hero of Luck"];
let heroGolden = [false, false, false, false, false]


let unicornHP = function(){
    let scaling = weaknessEffect(player.heroes[3]);
    if(godType==0){
        if (game.levels <= 100) {
            return healthMults[game.unicornType] * Math.round(20 * Math.pow(scaling, game.levels));
        }
        else if (game.levels <= 250) {
            return healthMults[game.unicornType] * Math.round(20 * Math.pow(scaling, game.levels + (game.levels-100)*(game.levels-99)/200));
        }
        else {
            return healthMults[game.unicornType] * Math.round(20 * Math.pow(scaling, game.levels + (game.levels-100)*(game.levels-99)/100));
        }
    }
    else return godHealthMults[godType] * Math.round(20 * Math.pow(scaling, unicornLVL + (unicornLVL-100)*(unicornLVL-99)/100));
}

function update() {

	dpc = Math.round((dpcLvl+1) * (1 + strengthEffect(player.heroes[1]) / 100));
 
}

function determineUnicornType() {
    let trueChances = []
    for(let i=0;i<=6;i++){
    let normalChance = luckEffect()**i*(i==6?1:1-luckEffect())
    let expectedAmt = game.levels*normalChance
    let amtProportion = game.unicornCounter[i]/expectedAmt
    if(amtProportion>1) trueChances[i]=normalChance*(1/(Math.cbrt(amtProportion)))
    if(amtProportion<1) trueChances[i]=normalChance*(Math.log(amtProportion+Math.E)/Math.cbrt(amtProportion))
    if(amtProportion===1) trueChances[i]=normalChance
    // doubles the chance of it being rare when the level is a multiple of each of those: 5, 10, and 25
    if(game.levels%5==4&&i>0) trueChances[i]*=2
    if(game.levels%10==9&&i>1) trueChances[i]*=2
    if(game.levels%25==24&&i>2) trueChances[i]*=2
    }

    let uType = weightedRandom(...trueChances)
    game.unicornCounter[uType]++
	return uType
}

function dealDamage(type) {
    let damage = type?player.upgrades.dps*2:player.upgrades.click+1
    damage = Math.floor((1 + strengthEffect(player.heroes[1]) / 100)*damage)
    game.damageDealt += damage;
    if (game.damageDealt >= unicornHP()) {
        if ( game.unicornType>=0 ) player.unlocks.coins = true
        if ( game.unicornType>=1 ) player.unlocks.rainbowHair = true
        if ( game.unicornType>=2 ) player.unlocks.horns = true
		if (game.unicornType == -1) {
			godlyPrestige();
			return;
		}
        player.coins+=Math.round(baseRewards[game.unicornType]*coinGain())
        player.rainbowHair+=Math.round((game.unicornType>=1?baseRewards[game.unicornType-1]:0)*rainbowHairGain())
        player.horns+=Math.round((game.unicornType>=2?baseRewards[game.unicornType-2]:0)*hornsGain())
        game.levels++
        game.unicornCounter[game.unicornType]++
	    game.unicornType = determineUnicornType();
	    unicornHP();

		if (game.levels == 250) {
			HPmult = 50;
			game.unicornType = -1;
            godType = 1
		}
		else if (game.levels == 500) {
			HPmult = 100;
			game.unicornType = -1;
            godType = 2
		}
        else godType = 0
		
		
        game.damageDealt = 0;
    }
}

function wealthEffect(x = player.heroes[0]) {
    if (!x) {
        return 0;
	} else if (x <= 5) {
		return 100 * x;
	} else {
		return 100 * x + (x-5)*(x-4)/2 * 100;
	}
}

function strengthEffect(x = player.heroes[1]) {
    if (!x) {
        return 0;
	} else if (x <= 5) {
		return 50 * x;
	} else {
		return 50 * x + (x-5)*(x-4)/2 * 50;
	}
}

function salesEffect(x = player.heroes[2]) {
    //let n = 1 + 1 / (1 + Math.pow(x, 2/3)*1.5 / 5);
    let n = 1.61803399
    return Math.round(1000 * n) / 1000;
}

function weaknessEffect(x = player.heroes[3]) {
    let n = Math.pow(1.07, (1 / (1 + Math.pow(x, 2/3)*2 / 10)));
    return Math.round(10000 * n) / 10000;
}

function luckEffect(x = player.heroes[4]) {
    let n = 0.2+Math.pow(x*Math.sqrt(1+Math.log(1+x)),1/(3+Math.log(1+Math.log(1+x))))/10
    return Math.round(100 * n) / 100;
}

function getRandomhero() {
	return Math.floor(Math.random() * 5) + 1;
}

function buyCoinUpgrade(type){
if(type==0){
do{
let cost = Math.round(Math.pow(salesEffect(player.heroes[2]), player.upgrades.click+2)/Math.sqrt(5));
if(player.coins>=cost){
player.coins-=cost
player.upgrades.click++
}
}while(player.maxBuy&&player.coins>=Math.round(Math.pow(salesEffect(player.heroes[2]), player.upgrades.click+2)/Math.sqrt(5)))
}

if(type==1)
do{
let cost = Math.round(Math.pow(salesEffect(player.heroes[2]), player.upgrades.dps+2)/Math.sqrt(5));
if(player.coins>=cost){
player.coins-=cost
player.upgrades.dps++
}
}while(player.maxBuy&&player.coins>=Math.round(Math.pow(salesEffect(player.heroes[2]), player.upgrades.dps+2)/Math.sqrt(5)))

}

function toggleMaxBuy() {
	player.maxBuy = !player.maxBuy
}

function buyAuto() {
	if (autoBuy) {
		if (autoBuyType == "Rainbow Hair") {
		}
		else if (autoBuyType == "Horns") {
			doubleHornsGain();
		}
		else if (autoBuyType == "Smart") { 
			doubleHornsGain();
			if (player.rainbowHair >= 5 * coinGainCost) {
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
    if (player.horns >= 5+game.boughtLootboxes) {
        player.horns -= 5+game.boughtLootboxes;
        player.lootBoxes++;
        game.boughtLootboxes++;
    }
}

function coinGain() {
    let gain = 2**player.hairUpgrades[0];
    gain *= (1 + wealthEffect(player.heroes[0]) / 100);
    return Math.round(gain)
}

function rainbowHairGain(){
    let gain = 2**player.hairUpgrades[1]
    return gain
}

function hornsGain(){
    let gain = 2**player.hairUpgrades[2]
    return gain
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
    if (player.lootBoxes > 0) {
        player.unlocks.heroes = true
        while (player.lootBoxes > 0) {
            player.lootBoxes--;
            let amt = 0
            for(let hero in player.heroes){
            amt += player.heroes[hero]
            }
            let chances = []
            for(let i=0;i<5;i++){
            chances[i] = 1/Math.sqrt(5*(player.heroes[i]+1)/(amt+5))
            }
            let unicorn = weightedRandom(...chances)
			if (game.lootBoxCost < 20) {
				alert("You found a " + heroNames[unicorn] + "!");
			} 
            player.heroes[unicorn]++;
            game.unicornCounter = Array(7).fill(0)
            for(let i=0;i<7;i++){
                game.unicornCounter[i] = (luckEffect())**i*(i==6?1:1-luckEffect())
            }
            game.levels = 0;
            game.damageDealt = 0;
            game.unicornType = 0;
            player.upgrades = {click:0,dps:0}
            player.rainbowHair = 0;
            player.coins = 0
            player.horns = 0
            player.hairUpgrades = [0,0,0]
            game.rainbowHairGainCost = 4;
        }
    }
}

function godlyPrestige() {
	
	game.levels = 0;
	game.damageDealt = 0;
	game.unicornType = 0;
	HPmult = 1;
	dpc = 1;
	dps = 0;
	dpcLvl = 0;
	dpsLvl = 0;
	player.maxBuy = false;
	player.rainbowHair = 0;
	horns = 0;
	game.rainbowHairGainCost = 4;
	lootBoxCost = 5;
	lootBoxes = 0;
	player.heroes = [0, 0, 0, 0, 0];
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
