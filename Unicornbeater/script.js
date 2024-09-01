"use strict"

const player = {
coins: 0,
rainbowHair:0,
horns:0,
Damage:{click:0,second:0},
heroes:[0,0,0,0,0],
HairUpgrades:[0,0,0],
}

const game = {
Levels: 0,

}

let unicornLVL = 1;
let unicornHP = 20;
let currentHP = 20;
let unicornType = "Common Unicorn";
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
let heroLvls = [0, 0, 0, 0, 0];
let heroNames = ["Hero of Wealth", "Hero of Strength", "Hero of Sales", "Hero of Weakness", "Hero of Luck"];
let increaseDPCcost = Math.round(Math.pow((dpcLvl + 1), salesEffect(heroLvls[2])));
let increaseDPScost = Math.round(Math.pow((dpsLvl + 1), salesEffect(heroLvls[2])));

let health = document.getElementById("Health");

let factorial = function(x){
let num = 1
while(x){
    num*=x
    x--    
}
return num
}

const factorials=[1,1,2,6,24,120]

function update() {

    checkForUnlock();
    updateCoinGain();
	health.value = currentHP/unicornHP*100;
	dpc = Math.round((dpcLvl+1) * (1 + strengthEffect(heroLvls[1]) / 100));

    document.querySelector("#UnicornLVL").innerHTML = unicornLVL;
    document.querySelector("#UnicornHP").innerHTML = displayN(unicornHP);
    document.querySelector("#CurrentHP").innerHTML = displayN(currentHP);
    document.querySelector("#DPC").innerHTML = displayN(dpc);
    document.querySelector("#DPS").innerHTML = displayN(Math.round(dps * (1 + strengthEffect(heroLvls[1]) / 100)));
    document.querySelector("#Strength").innerHTML = "";
    if (heroLvls[1] > 0) {
        document.querySelector("#Strength").innerHTML = "(" + displayN(dps) + " + " + displayN(Math.round(dps * strengthEffect(heroLvls[1]) / 100)) + ")";
    }
    document.querySelector("#BonusCoins").innerHTML = "";
    if (heroLvls[0] > 0) {
        document.querySelector("#BonusCoins").innerHTML = "(" + displayN((coinGainCost / 2)) + " + " + displayN(Math.round(coinGainCost * wealthEffect(heroLvls[0]) / 200)) + ")";
    }
    document.querySelector("#Coins").innerHTML = displayN(coins);
    document.querySelector("#RainbowHair").innerHTML = displayN(rainbowHair);
    document.querySelector("#Horns").innerHTML = displayN(horns);
    document.querySelector("#UnicornType").innerHTML = unicornType;
	document.querySelector("#MaxBuyText").innerHTML = "Max Buy: "+(maxBuy ? "ON" : "OFF");
    document.querySelector("#IncreaseDPCcost").innerHTML = displayN(Math.round(Math.pow((dpcLvl + 1), salesEffect(heroLvls[2]))));
    document.querySelector("#IncreaseDPScost").innerHTML = displayN(Math.round(Math.pow((dpsLvl + 1), salesEffect(heroLvls[2]))));
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
    document.querySelector("#WealthLvl").innerHTML = heroLvls[0];
    document.querySelector("#StrengthLvl").innerHTML = heroLvls[1];
    document.querySelector("#SalesLvl").innerHTML = heroLvls[2];
    document.querySelector("#WeaknessLvl").innerHTML = heroLvls[3];
    document.querySelector("#LuckLvl").innerHTML = heroLvls[4];
    document.querySelector("#WealthEffect").innerHTML = displayN(wealthEffect(heroLvls[0]));
    document.querySelector("#StrengthEffect").innerHTML = displayN(strengthEffect(heroLvls[1]));
    document.querySelector("#SalesEffect").innerHTML = salesEffect(heroLvls[2]);
    document.querySelector("#WeaknessEffect").innerHTML = weaknessEffect(heroLvls[3]);
    document.querySelector("#LuckEffect").innerHTML = luckEffect(heroLvls[4]);

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


function dealDamage(x) {
    currentHP -= x;
    if (currentHP <= 0) {
		if (unicornType == "Godly Unicorn: the master of Cheese") {
			godlyPrestige();
			return;
		}
        if (unicornType == "Common Unicorn") {
            coins += coinGain;
        }
        else if (unicornType == "Uncommon Unicorn") {
            coins += coinGain * 2;
            rainbowHair += rainbowHairGain;
        }
        else if (unicornType == "Rare Unicorn") {
            coins += coinGain * 6;
            rainbowHair += rainbowHairGain * 2;
            horns += hornsGain;
        }
        else if (unicornType == "Epic Unicorn") {
            coins += coinGain * 24;
            rainbowHair += rainbowHairGain * 6;
            horns += hornsGain * 2;
        }
        else if (unicornType == "Legendary Unicorn") {
            coins += coinGain * 120;
            rainbowHair += rainbowHairGain * 24;
            horns += hornsGain * 6;
        }
        unicornLVL++;
        let scaling = weaknessEffect(heroLvls[3]);
        let HPmult = 1;
        unicornType = "Common Unicorn";
        luck = luckEffect(heroLvls[4]);
        if (unicornLVL % 25 == 0) {
            HPmult = 5;
            unicornType = "Rare Unicorn";
        }
        if (unicornLVL % 100 == 0) {
            HPmult = 10;
            unicornType = "Epic Unicorn";
        }
        if (Math.random() < 1 / luck && (unicornLVL % 25 !== 0)) {
            HPmult = 2;
            unicornType = "Uncommon Unicorn";
            if (Math.random() < 1 / luck) {
                HPmult = 5;
                unicornType = "Rare Unicorn";
                if (Math.random() < 1 / luck) {
                    HPmult = 10;
                    unicornType = "Epic Unicorn";
                    if (Math.random() < 1 / luck) {
                        HPmult = 20;
                        unicornType = "Legendary Unicorn";
                    }
                }
            }
        }
		if (unicornLVL == 250) {
			HPmult = 50;
			unicornType = "Godly Unicorn: the master of Cheese";
		}
		else if (unicornLVL == 500) {
			HPmult = 100;
			unicornType = "Godly Unicorn: D I E G O"; 
        
		}
		if (unicornLVL <= 100) {
			unicornHP = HPmult * Math.round(20 * Math.pow(scaling, unicornLVL));
		}
		else if (unicornLVL <= 250) {
			unicornHP = HPmult * Math.round(20 * Math.pow(scaling, unicornLVL + (unicornLVL-100)*(unicornLVL-99)/200));
		}
		else {
			unicornHP = HPmult * Math.round(20 * Math.pow(scaling, unicornLVL + (unicornLVL-100)*(unicornLVL-99)/100));
		}
		
		
        currentHP = unicornHP;
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
        	increaseDPCcost = Math.round(Math.pow((dpcLvl + 1), salesEffect(heroLvls[2])));
		}
	}
    if (coins >= increaseDPCcost) {
        coins -= increaseDPCcost;
        dpcLvl++;
        increaseDPCcost = Math.round(Math.pow((dpcLvl + 1), salesEffect(heroLvls[2])));
    }
}

function increaseDPS() {
	if (maxBuy) {
		while (coins >= increaseDPScost) {
        	coins -= increaseDPScost;
        	dpsLvl++;
        	dps += dpsLvl;
        	increaseDPScost = Math.round(Math.pow((dpsLvl + 1), salesEffect(heroLvls[2])));
    	}
	}
    if (coins >= increaseDPScost) {
        coins -= increaseDPScost;
        dpsLvl++;
        dps += dpsLvl;
        increaseDPScost = Math.round(Math.pow((dpsLvl + 1), salesEffect(heroLvls[2])));
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
    coinGain = Math.round(coinGain * (1 + wealthEffect(heroLvls[0]) / 100));
}

function heal() {
	if (unicornLVL == 250) {
		currentHP += Math.round(unicornHP*0.02);
	}
	else if (unicornLVL == 500) {
		currentHP += Math.round(unicornHP*0.04);
	}
	if (unicornHP < currentHP) {
		currentHP = unicornHP;
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
            heroLvls[unicorn]++;

            unicornLVL = 1;
            unicornHP = 20;
            currentHP = 20;
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
            increaseDPCcost = Math.round(Math.pow((dpcLvl + 1), salesEffect(heroLvls[2])));
            increaseDPScost = Math.round(Math.pow((dpsLvl + 1), salesEffect(heroLvls[2])));
        }
    }
}

function godlyPrestige() {
	unlock = 5;
	
	unicornLVL = 1;
	unicornHP = 20;
	currentHP = 20;
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
	heroLvls = [0, 0, 0, 0, 0];
}

function save() {
    let game = [unicornLVL, unicornHP, currentHP, unicornType, dpc, dps, dpcLvl, dpsLvl, coins, rainbowHair, horns, coinGain, rainbowHairGain, hornsGain, luck, coinGainCost, rainbowHairGainCost, hornsGainCost, lootBoxCost, heroLvls, unlock, lootBoxes];
    localStorage.unicorn = btoa(JSON.stringify(game));
}

function load() {
    if (!localStorage.unicorn) return;
    let game = JSON.parse(atob(localStorage.unicorn));
    unicornLVL = game[0];
    unicornHP = game[1];
    currentHP = game[2];
    unicornType = game[3];
    dpc = game[4];
    dps = game[5];
    dpcLvl = game[6];
    dpsLvl = game[7];
    coins = game[8];
    rainbowHair = game[9];
    horns = game[10];
    coinGain = game[11];
    rainbowHairGain = game[12];
    hornsGain = game[13];
    luck = game[14];
    coinGainCost = game[15];
    rainbowHairGainCost = game[16];
    hornsGainCost = game[17];
    lootBoxCost = game[18];
    heroLvls = game[19];
    unlock = game[20];
    lootBoxes = game[21];

    let increaseDPCcost = Math.round(Math.pow((dpcLvl + 1), salesEffect(heroLvls[2])));
    let increaseDPScost = Math.round(Math.pow((dpsLvl + 1), salesEffect(heroLvls[2])));
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
setInterval( () => dealDamage(Math.round(dps * (1 + strengthEffect(heroLvls[1]) / 100))), 1000);
setInterval( () => heal(), 1000);
setInterval( () => buyAuto(), 100);
