"use strict"

const player = {
coins: 0,
rainbowHair:0,
horns:0,
Damage:{click:0,second:0},
heroes:[0,0,0,0,0],
HairUpgrades:[0,0,0],
upgrades:{click:0,dps:0}
}

const game = {
levels: 0,
damageDealt: 0,
}

const factorials = [1, 1, 2, 6, 24, 120, 720, 5040]
const healthMults = [1, 2, 5, 10, 20, 40, 80]
const godHealthMults = [50,100]

let unicornLVL = 1;
let unicornType = 0;
let godType = 0
let HPmult = 1;
let dpc = 1;
let dps = 0;
let dpcLvl = 0;
let dpsLvl = 0;
let maxBuy = false;
let autoBuy = false;
let autoBuyType = "Smart"

let coins = 0;
let rainbowHair = 0;
let horns = 0;
let coinGain = 1;
let rainbowHairGain = 1;
let hornsGain = 1;
let luck = 4.5;
let coinGainCost = 2;
let rainbowHairGainCost = 4;
let hornsGainCost = 8;

let lootBoxCost = 5;
let lootBoxes = 0;
let unlock = 0;
let heroNames = ["Hero of Wealth", "Hero of Strength", "Hero of Sales", "Hero of Weakness", "Hero of Luck"];
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

    checkForUnlock();
    updateCoinGain();
	dpc = Math.round((dpcLvl+1) * (1 + strengthEffect(player.heroes[1]) / 100));

    document.querySelector("#UnicornHP").innerHTML = displayN(unicornHP());
    document.querySelector("#CurrentHP").innerHTML = displayN(unicornHP()-game.damageDealt);
    document.querySelector("#DPS").innerHTML = displayN(Math.round(dps * (1 + strengthEffect(player.heroes[1]) / 100)));
    document.querySelector("#Strength").innerHTML = "";
    if (player.heroes[1] > 0) {
        document.querySelector("#Strength").innerHTML = "(" + displayN(dps) + " + " + displayN(Math.round(dps * strengthEffect(player.heroes[1]) / 100)) + ")";
    }
    document.querySelector("#BonusCoins").innerHTML = "";
    if (player.heroes[0] > 0) {
        document.querySelector("#BonusCoins").innerHTML = "(" + displayN((coinGainCost / 2)) + " + " + displayN(Math.round(coinGainCost * wealthEffect(player.heroes[0]) / 200)) + ")";
    }
    document.querySelector("#Coins").innerHTML = displayN(coins);
    document.querySelector("#RainbowHair").innerHTML = displayN(rainbowHair);
    document.querySelector("#Horns").innerHTML = displayN(horns);
	document.querySelector("#MaxBuyText").innerHTML = "Max Buy: "+(maxBuy ? "ON" : "OFF");
    document.querySelector("#IncreaseDPCcost").innerHTML = displayN(Math.round(Math.pow((dpcLvl + 1), salesEffect(player.heroes[2]))));
    document.querySelector("#IncreaseDPScost").innerHTML = displayN(Math.round(Math.pow((dpsLvl + 1), salesEffect(player.heroes[2]))));
    document.querySelector("#IncreaseDPSeffect").innerHTML = displayN(dpsLvl + 1);
	document.querySelector("#AutoBuyText").innerHTML = "Auto Buy: " + (autoBuy ? "ON" : "OFF");
	document.querySelector("#AutoBuyText2").innerHTML = "Type: " + autoBuyType;
    document.querySelector("#DoubleCoinGainCost").innerHTML = displayN(coinGainCost);
    document.querySelector("#DoubleRainbowHairGainCost").innerHTML = displayN(rainbowHairGainCost);
    document.querySelector("#DoubleHornsGainCost").innerHTML = displayN(hornsGainCost);
    document.querySelector("#CoinGain").innerHTML = displayN(coinGain);
    document.querySelector("#RainbowHairGain").innerHTML = displayN(rainbowHairGain);
    document.querySelector("#HornsGain").innerHTML = displayN(hornsGain);
    document.querySelector("#LootBoxCost").innerHTML = displayN(lootBoxCost);
    if (lootBoxes > 0) {
        document.querySelector("#PrestigeText").innerHTML = "Reset your progress to open " + lootBoxes.toString() + " lootbox(es)!";
    } else {
        document.querySelector("#PrestigeText").innerHTML = "Buy at least one lootbox to prestige...";
    }
    document.querySelector("#WealthLvl").innerHTML = player.heroes[0];
    document.querySelector("#StrengthLvl").innerHTML = player.heroes[1];
    document.querySelector("#SalesLvl").innerHTML = player.heroes[2];
    document.querySelector("#WeaknessLvl").innerHTML = player.heroes[3];
    document.querySelector("#LuckLvl").innerHTML = player.heroes[4];
    document.querySelector("#WealthEffect").innerHTML = displayN(wealthEffect(player.heroes[0]));
    document.querySelector("#StrengthEffect").innerHTML = displayN(strengthEffect(player.heroes[1]));
    document.querySelector("#SalesEffect").innerHTML = salesEffect(player.heroes[2]);
    document.querySelector("#WeaknessEffect").innerHTML = weaknessEffect(player.heroes[3]);
    document.querySelector("#LuckEffect").innerHTML = luckEffect(player.heroes[4]);

    document.getElementById('damage').style.display = "none";
    document.getElementById('upgrades').style.display = "none";
    document.getElementById('lootbox').style.display = "none";
    document.getElementById('heroes').style.display = "none";
	document.getElementById('buymax').style.display = "none";
	document.getElementById('autobuy').style.display = "none";
    
    if (unlock >= 1) {
        document.getElementById('damage').style.display = "block";
    }
    if (unlock >= 2) {
        document.getElementById('upgrades').style.display = "block";
    }
    if (unlock >= 3) {
        document.getElementById('lootbox').style.display = "block";
    }
    if (unlock >= 4) {
        document.getElementById('buymax').style.display = "block";
		document.getElementById('heroes').style.display = "block";
    }
    if (unlock >= 5) {
        document.getElementById('autobuy').style.display = "block";
    }
 
}


function dealDamage(type) {
    let damage = type?player.upgrades.dps*(player.upgrades.dps+1)/2:player.upgrades.click+1
    damage = Math.floor((1 + strengthEffect(player.heroes[1]) / 100)*damage)
    game.damageDealt += damage;
    if (game.damageDealt >= unicornHP()) {
		if (unicornType == -1) {
			godlyPrestige();
			return;
		}
        player.coins+=factorials[unicornType]*coinGain
        coins+=factorials[unicornType]*coinGain
        player.rainbowHair+=(unicornType>=1?factorials[unicornType-1]:0)*rainbowHairGain
        rainbowHair+=(unicornType>=1?factorials[unicornType-1]:0)*rainbowHairGain
        player.horns+=(unicornType>=2?factorials[unicornType-2]:0)*hornsGain
        horns+=(unicornType>=2?factorials[unicornType-2]:0)*hornsGain
        game.levels++
        let HPmult = 1;
        unicornType = 0;
        luck = luckEffect(player.heroes[4]);
        if (game.levels % 25 == 0) {
            HPmult = 5;
            unicornType = 2;
        }
        if (game.levels % 100 == 0) {
            HPmult = 10;
            unicornType = 3;
        }
        if (Math.random() < 1 / luck && (game.levels % 25 !== 0)) {
            HPmult = 2;
            unicornType = 1;
            if (Math.random() < 1 / luck) {
                HPmult = 5;
                unicornType = 2;
                if (Math.random() < 1 / luck) {
                    HPmult = 10;
                    unicornType = 3;
                    if (Math.random() < 1 / luck) {
                        HPmult = 20;
                        unicornType = 4;
                    }
                }
            }
        }
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

function increaseDPC() {
	if (maxBuy) {
 		while (coins >= increaseDPCcost) {
        	coins -= increaseDPCcost;
        	dpcLvl++;
        	increaseDPCcost = Math.round(Math.pow((dpcLvl + 1), salesEffect(player.heroes[2])));
		}
	}
    if (coins >= increaseDPCcost) {
        coins -= increaseDPCcost;
        dpcLvl++;
        increaseDPCcost = Math.round(Math.pow((dpcLvl + 1), salesEffect(player.heroes[2])));
    }
}

function increaseDPS() {
	if (maxBuy) {
		while (coins >= increaseDPScost) {
        	coins -= increaseDPScost;
        	dpsLvl++;
        	dps += dpsLvl;
        	increaseDPScost = Math.round(Math.pow((dpsLvl + 1), salesEffect(player.heroes[2])));
    	}
	}
    if (coins >= increaseDPScost) {
        coins -= increaseDPScost;
        dpsLvl++;
        dps += dpsLvl;
        increaseDPScost = Math.round(Math.pow((dpsLvl + 1), salesEffect(player.heroes[2])));
    }
}

function toggleMaxBuy() {
	maxBuy = maxBuy ? false : true;
}

function buyAuto() {
	if (autoBuy) {
		if (autoBuyType == "Rainbow Hair") {
			doubleRainbowHairGain();
		}
		else if (autoBuyType == "Horns") {
			doubleHornsGain();
		}
		else if (autoBuyType == "Smart") { 
			doubleHornsGain();
			doubleRainbowHairGain();
			if (rainbowHair >= 5 * coinGainCost) {
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

function doubleCoinGain() {
    if (rainbowHair >= coinGainCost) {
        rainbowHair -= coinGainCost;
        coinGainCost *= 2;
    }
}

function doubleRainbowHairGain() {
    if (rainbowHair >= rainbowHairGainCost) {
        rainbowHair -= rainbowHairGainCost;
        rainbowHairGainCost *= 3;
		if (rainbowHairGainCost > 100) {rainbowHairGainCost *= 1 + Math.floor(Math.log10(rainbowHairGainCost))/10};
		rainbowHairGainCost = Math.round(rainbowHairGainCost);
        rainbowHairGain *= 2;
    }
}

function doubleHornsGain() {
    if (rainbowHair >= hornsGainCost) {
        rainbowHair -= hornsGainCost;
        hornsGainCost = hornsGainCost*3;
        hornsGain *= 2;
    }
}

function buyLootBox() {
    if (horns >= lootBoxCost) {
        horns -= lootBoxCost;
        lootBoxes++;
        lootBoxCost++;
    }
}

function checkForUnlock() {
    if (unlock == 0 && coins >= 6) {
        unlock = 1;
    }
    if (unlock == 1 && rainbowHair >= 4) {
        unlock = 2;
    }
    if (unlock == 2 && horns >= 3) {
        unlock = 3;
    }
}

function updateCoinGain() {
    coinGain = coinGainCost / 2;
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
        unlock = 4;
        while (lootBoxes > 0) {
            lootBoxes--;
            rng = Math.random();
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
            rainbowHair = 0;
            rainbowHairGain = 1;
            hornsGain = 1;
            coinGainCost = 2;
            rainbowHairGainCost = 4;
            hornsGainCost = 8;
            increaseDPCcost = Math.round(Math.pow((dpcLvl + 1), salesEffect(player.heroes[2])));
            increaseDPScost = Math.round(Math.pow((dpsLvl + 1), salesEffect(player.heroes[2])));
        }
    }
}

function godlyPrestige() {
	unlock = 5;
	
	game.levels = 0;
	game.damageDealt = 0;
	unicornType = "Common Unicorn";
	HPmult = 1;
	dpc = 1;
	dps = 0;
	dpcLvl = 0;
	dpsLvl = 0;
	maxBuy = false;
	coins = 0;
	rainbowHair = 0;
	horns = 0;
	coinGain = 1;
	rainbowHairGain = 1;
	hornsGain = 1;
	luck = 4.5;
	coinGainCost = 2;
	rainbowHairGainCost = 4;
	hornsGainCost = 8;
	lootBoxCost = 5;
	lootBoxes = 0;
	unlock = 0;
	player.heroes = [0, 0, 0, 0, 0];
}

function save() {
    localStorage.unicorn = btoa(JSON.stringify({player,game}));
}

function load() {
    if (!localStorage.unicorn) return;
    let info = JSON.parse(atob(localStorage.unicorn));
    for(let item in info.game)
    game[item] = info.game[item]
    for(let item in info.player)
    game[item] = info.player[item]

    let increaseDPCcost = Math.round(Math.pow((dpcLvl + 1), salesEffect(player.heroes[2])));
    let increaseDPScost = Math.round(Math.pow((dpsLvl + 1), salesEffect(player.heroes[2])));
}

function hardReset() {
    if (prompt("Type RESET if you want to reset all progress") == "RESET") {
        let game = [1, 20, 20, "Common", 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 4.5, 2, 4, 8, 5, [0, 0, 0, 0, 0], 0, 0];
        localStorage.unicorn = btoa(JSON.stringify(game));
        load();
    }

}

function displayN(n) {
    n = Math.round(n);
    let c = n.toLocaleString("en-US");
    return c;
}

load();
setInterval( () => save(), 33);
setInterval( () => update(), 33);
setInterval( () => dealDamage(1), 1000);
setInterval( () => heal(), 1000);
setInterval( () => buyAuto(), 100);
