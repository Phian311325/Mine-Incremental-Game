//區域一/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//更新//////////////////////
function UpdateOreDsp() {
    //礦物
    document.getElementById('a1-messyStone-value').textContent = USER_DATA.messyStone.toFixed(2);
    document.getElementById('a1-ironOre-value').textContent = USER_DATA.ironOre.toFixed(2);
    document.getElementById('a1-goldOre-value').textContent = USER_DATA.goldOre.toFixed(2);
    document.getElementById('a1-diamondOre-value').textContent = USER_DATA.diamondOre.toFixed(2);
    document.getElementById('a1-coal-value').textContent = USER_DATA.coal.toFixed(2);
    document.getElementById('a1-stone-value').textContent = USER_DATA.stone.toFixed(2);
    document.getElementById('a1-ironIngot-value').textContent = USER_DATA.ironIngot.toFixed(2);
    document.getElementById('a1-goldIngot-value').textContent = USER_DATA.goldIngot.toFixed(2);
    document.getElementById('a1-diamond-value').textContent = USER_DATA.diamond.toFixed(2);
    document.getElementById('a1-goldCoin-value').textContent = USER_DATA.goldCoin.toFixed(2);
    //基本
    USER_DATA.a1ShortT = 3000 * USER_DATA.a1PickaxeEffect;
    USER_DATA.a1AccyNormalT = 3000 * USER_DATA.a1PickaxeEffect;
    USER_DATA.a1NormalT = 3000 * USER_DATA.a1PickaxeEffect;
    //有短採集
    if (USER_DATA.a1ShortE) {
        USER_DATA.a1ShortT = 300 * USER_DATA.a1PickaxeEffect;
    }
    //有蓄力採集
    if (USER_DATA.a1LongE) {
        USER_DATA.a1AccyLongT = 6000 * USER_DATA.a1PickaxeEffect;
        USER_DATA.a1LongT = 6000 * USER_DATA.a1PickaxeEffect;
    }
    //有精準採集
    if (USER_DATA.a1AccyNormalE) {
        USER_DATA.a1ShortT = 3000 * USER_DATA.a1PickaxeEffect - USER_DATA.a1AccyEffect;
        USER_DATA.a1AccyNormalT = 3000 * USER_DATA.a1PickaxeEffect - USER_DATA.a1AccyEffect;
        USER_DATA.a1NormalT = 3000 * USER_DATA.a1PickaxeEffect + USER_DATA.a1AccyEffect;
    }
    //有蓄力精準採集
    if (USER_DATA.a1AccyLongE) {
        USER_DATA.a1AccyLongT = 6000 * USER_DATA.a1PickaxeEffect - USER_DATA.a1AccyEffect;
        USER_DATA.a1LongT = 6000 * USER_DATA.a1PickaxeEffect + USER_DATA.a1AccyEffect;
    }
};
//繪製進度條///////////////////
const minerCtx = SetupBar('.A1-Miner-Bar');
const workerCtx = SetupBar('.A1-Worker-Bar');
// 繪製礦主進度
function A1DrawMinerProgress(T) {
    if (!minerCtx) return;
    const canvas = document.querySelector('.A1-Miner-Bar');
    const w = canvas.width; const h = canvas.height;
    const { a1ShortT: s, a1AccyNormalT: an, a1NormalT: n, a1AccyLongT: al, a1LongT: l } = USER_DATA;
    const max = 4000;
    minerCtx.clearRect(0, 0, w, h);
    [
        [0, s, '#00000033'], [s, an, '#00ff0033'], [an, n, '#ffff0033'],
        [n, al, '#0080ff33'], [al, l, '#ff8d0033'], [l, max, '#ff000033']
    ].forEach(([st, ed, cl]) => { minerCtx.fillStyle = cl; minerCtx.fillRect(w*(st/max), 0, w*((ed-st)/max), h) });
    minerCtx.fillStyle = '#33333366'; minerCtx.fillRect(0, 0, w*(T/max), h);
    minerCtx.fillStyle = '#333333ff'; minerCtx.fillRect(w*(T/max)-1, 0, 2, h);    
}
// 繪製礦工進度
function A1DrawWorkerProgress(percent) {
    if (!workerCtx) return;
    const canvas = document.querySelector('.A1-Worker-Bar');
    const w = canvas.width; const h = canvas.height;   
    workerCtx.clearRect(0, 0, w, h);
    workerCtx.fillStyle = '#00000033'; workerCtx.fillRect(0, 0, w, h);
    workerCtx.fillStyle = '#33333366'; workerCtx.fillRect(0, 0, w*(percent), h);
    workerCtx.fillStyle = '#333333ff'; workerCtx.fillRect(w*(percent)-1, 0, 2, h);
}
//初始化進度///////////
A1DrawMinerProgress(0);
A1DrawWorkerProgress(0);
//手動挖礦////////////////////
// 獲取礦主按鈕
const minerBtn = document.getElementById('a1-miner-btn');
let pressStartTime = null;
let pressTimer = null;
let isPressing = false;
// 更新按壓時長（每 10ms 輸出一次）
function A1UpdatePressDuration() {
    if (!isPressing) return;
    const currentDuration = Date.now() - pressStartTime;
    A1DrawMinerProgress(currentDuration);
    if (currentDuration >= 5000) {A1EndPress(); return};
    pressTimer = setTimeout(() => A1UpdatePressDuration(), 10);
}
// 開始按壓
function A1StartPress(e) {
    e.preventDefault();  // 防止移動端預設行為   
    if (isPressing) return;
    isPressing = true;
    pressStartTime = Date.now();
    A1DrawMinerProgress(0);
    // 啟動定時輸出
    pressTimer = setTimeout(() => A1UpdatePressDuration(), 10);
}
// 結束按壓
function A1EndPress() {
    if (!isPressing) return;   
    // 清除定時器
    if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
    }
    const duration = Date.now() - pressStartTime;
    isPressing = false;
    A1DrawMinerProgress(0);
    //判定
    A1GetOres(duration);
}
// 綁定事件（支援滑鼠與觸控）
minerBtn.addEventListener('mousedown', A1StartPress);
window.addEventListener('mouseup', A1EndPress);
// 觸控裝置
minerBtn.addEventListener('touchstart', A1StartPress);
window.addEventListener('touchend', A1EndPress);
// 防止滑鼠離開按鈕時還算按壓（可選）
minerBtn.addEventListener('mouseleave', () => {
    if (isPressing) A1EndPress();
});
//手動挖礦判定//////////
function A1GetMineType(T) {
    const { a1ShortT: sT, a1AccyNormalT: anT, a1NormalT: nT, a1AccyLongT: alT, a1LongT: lT } = USER_DATA;
    const { a1ShortR: sR, a1AccyNormalR: anR, a1NormalR: nR, a1AccyLongR: alR, a1LongR: lR } = CONFIG_DATA;
    
    if (T < sT) return { rate: 0, desc: '採集失敗', color: '#888888ff' };
    if (T < anT) return { rate: sR, desc: '略微採集', color: '#00ff00ff' };
    if (T < nT) return { rate: anR, desc: '精準採集', color: '#ffff00ff' };
    if (T < alT) return { rate: nR, desc: '採集成功', color: '#0080ffff' };
    if (T < lT) return { rate: alR, desc: '精準蓄力採集', color: '#ff8d00ff' };
    return { rate: lR, desc: '蓄力採集', color: '#ff0000ff' };
}
function A1GetOres(T) {
    let { rate, desc, color } = A1GetMineType(T);
    const A1_MINE_ORE = [
        { key: 'messyStone', name: '碎石', rate: Math.min(1, CONFIG_DATA.a1StoneRate * USER_DATA.a1OreEffect) },
        { key: 'coal', name: '煤炭', rate: Math.min(1, CONFIG_DATA.a1CoalRate * USER_DATA.a1OreEffect) },
        { key: 'ironOre', name: '鐵礦', rate: Math.min(1, CONFIG_DATA.a1IronRate * USER_DATA.a1OreEffect) },
        { key: 'goldOre', name: '金礦', rate: Math.min(1, CONFIG_DATA.a1GoldRate * USER_DATA.a1OreEffect) },
        { key: 'diamondOre', name: '鑽礦', rate: Math.min(1, CONFIG_DATA.a1DiamondRate * USER_DATA.a1OreEffect) }
    ];
    rate *= USER_DATA.a1MinerEffect;
    const result = PickReward(A1_MINE_ORE, rate);
    PopTime('a1-miner-btn', `${desc} ${result.name}+${rate}`, color);
    UpdateOreDsp();
}
// 開始自動挖礦
let workerTimer = null;
let workerProgress = 0;
let workerMax = 1;
function startWorkerAutoLoop() {
    if (workerTimer) return;
    workerProgress = 0;
    A1DrawWorkerProgress(0);
    workerTimer = setInterval(() => {
        workerMax = USER_DATA.a1AccyNormalT / USER_DATA.a1WorkerEffect;
        workerProgress += 10;
        if (workerProgress >= workerMax) {
            // 進度滿，重置
            workerProgress = 0;
            // 調用彈出提示
            const A1_MINE_ORE = [
                { key: 'messyStone', name: '碎石', rate: Math.min(1, CONFIG_DATA.a1StoneRate * USER_DATA.a1OreEffect) },
                { key: 'coal', name: '煤炭', rate: Math.min(1, CONFIG_DATA.a1CoalRate * USER_DATA.a1OreEffect) },
                { key: 'ironOre', name: '鐵礦', rate: Math.min(1, CONFIG_DATA.a1IronRate * USER_DATA.a1OreEffect) },
                { key: 'goldOre', name: '金礦', rate: Math.min(1, CONFIG_DATA.a1GoldRate * USER_DATA.a1OreEffect) },
                { key: 'diamondOre', name: '鑽礦', rate: Math.min(1, CONFIG_DATA.a1DiamondRate * USER_DATA.a1OreEffect) }
            ];
            const result = PickReward(A1_MINE_ORE, CONFIG_DATA.a1NormalR * USER_DATA.a1MinerEffect);
            PopTime('a1-worker-btn', `自動 ${result.name}+${CONFIG_DATA.a1NormalR * USER_DATA.a1MinerEffect}`, '#ffffffff');
            UpdateOreDsp();
            // 更新進度條為滿再重置（可選視覺效果）
            A1DrawWorkerProgress(1);
            // 短暫延遲後重置進度條
            setTimeout(() => {
                A1DrawWorkerProgress(0);
            }, 50);
        } else {
            A1DrawWorkerProgress(workerProgress / workerMax);
            document.getElementById('a1-worker-prog').textContent = `${Math.round(workerProgress / workerMax * 100)}%`
        }
    }, 10);
};
function A1CreateSell() {
    // 礦物出售配置
    const SELL_CONFIG = [
        { key: 'messyStone', price: 2 },
        { key: 'coal', price: 6 },
        { key: 'ironOre', price: 18 },
        { key: 'goldOre', price: 54 },
        { key: 'diamondOre', price: 162 }
    ];
    // 通用出售函數
    function Burn(key, price, value) {
        if (USER_DATA[key] >= value) {
            USER_DATA[key] -= value;
            USER_DATA.goldCoin += price * value;
            PopTime(`a1-${key}-sold${value}`, `出售成功 金幣+${price * value}`, '#0080ffff');
            UpdateOreDsp();
        } else {
            PopTime(`a1-${key}-sold${value}`, '貨物不足', '#ff0000ff');
        };
    };
    const content = document.getElementById('a1-sell-grid');
    // 自動綁定所有按鈕
    SELL_CONFIG.forEach(({ key, price }) => {
        content.innerHTML += `
        <div class="Craft-Block">
            <div class="Block-Dsp-Row"><div class="${key}-value">1</div><img src="./image/${key}.png">→
                                    <div class="goldOre-value">${price}</div><img src="./image/goldCoin.png"></div>
            <div class="Block-Dsp-Row Right"><button id="a1-${key}-sold1">出售 1 個</button><button id="a1-${key}-sold10">出售 10 個</button></div>
        </div>
        `
    });
    SELL_CONFIG.forEach(({ key, price }) => {
        document.getElementById(`a1-${key}-sold1`).addEventListener('click', () => Burn(key, price, 1));
        document.getElementById(`a1-${key}-sold10`).addEventListener('click', () => Burn(key, price, 10));
    });
};
function A1CreateBurn() {
    // 礦物出售配置
    const SELL_CONFIG = [
        { input: 'messyStone', output: 'stone', coal: 0.25, opName: '石頭' },
        { input: 'ironOre', output: 'ironIngot', coal: 0.5, opName: '石頭' },
        { input: 'goldOre', output: 'goldIngot', coal: 1, opName: '石頭' },
        { input: 'diamondOre', output: 'diamond', coal: 2, opName: '石頭' }
    ];
    // 通用出售函數
    function Sell(input, output, coal, value, opName) {
        if (USER_DATA[input] >= value && USER_DATA['coal'] >= coal*value) {
            USER_DATA[input] -= value; USER_DATA['coal'] -= coal*value;
            USER_DATA[output] += value;
            PopTime(`a1-${output}-burn${value}`, `燒煉成功 ${opName}+${value}`, '#0080ffff');
            UpdateOreDsp();
        } else {
            PopTime(`a1-${output}-burn${value}`, '材料不足', '#ff0000ff');
        };
    };
    const content = document.getElementById('a1-burn-grid');
    // 自動綁定所有按鈕
    SELL_CONFIG.forEach(({ input, output, coal }) => {
        content.innerHTML += `
        <div class="Craft-Block">
            <div class="Block-Dsp-Row"><div class="${input}-value">1</div><img src="./image/${input}.png">、<div class="coal-value">${coal}</div>
                                        <img src="./image/coal.png">→<div class="${input}-value">1</div><img src="./image/${output}.png"></div>
            <div class="Block-Dsp-Row Right"><button id="a1-${output}-burn1">燒煉 1 個</button><button id="a1-${output}-burn10">燒煉 10 個</button></div>
        </div>
        `
    });
    SELL_CONFIG.forEach(({ input, output, count, coal, opName }) => {
        document.getElementById(`a1-${output}-burn1`).addEventListener('click', () => Sell(input, output, coal, 1, opName));
        document.getElementById(`a1-${output}-burn10`).addEventListener('click', () => Sell(input, output, coal, 10, opName));
    });
};
//升級（石！山！代！碼！）/////////////////
document.getElementById('a1-miner-cost').addEventListener('click', () => {
    if (!(USER_DATA.a1MinerLvl < USER_DATA.a1MinerMax)) { PopTime('a1-miner-cost', '等級已達上限', '#00cc00ff'); return; };
    if (!(USER_DATA.messyStone >= USER_DATA.a1MinerCost)) { PopTime('a1-miner-cost', '材料不足', '#ff0000ff'); return; };
    USER_DATA.messyStone -= USER_DATA.a1MinerCost;
    USER_DATA.a1MinerEffect += 0.25;
    USER_DATA.a1MinerLvl += 1;
    USER_DATA.a1MinerCost *= 1.35;
    document.getElementById('a1-miner-lvl').textContent = `Lvl.${USER_DATA.a1MinerLvl}`;
    document.getElementById('a1-miner-effect').textContent = `${USER_DATA.a1MinerEffect.toFixed(2)}`;
    document.getElementById('a1-miner-cost').innerHTML = `升級: 消耗 ${USER_DATA.a1MinerCost.toFixed(2)} <img src="./image/messyStone.png">`;
    UpdateOreDsp();
});
document.getElementById('a1-worker-cost').addEventListener('click', () => {
    if (!(USER_DATA.a1WorkerLvl < USER_DATA.a1WorkerMax)) { PopTime('a1-worker-cost', '等級已達上限', '#00cc00ff'); return; };
    if (!(USER_DATA.ironOre >= USER_DATA.a1WorkerCost)) { PopTime('a1-worker-cost', '材料不足', '#ff0000ff'); return; };
    USER_DATA.ironOre -= USER_DATA.a1WorkerCost;
    USER_DATA.a1WorkerEffect += 0.05;
    USER_DATA.a1WorkerLvl += 1;
    USER_DATA.a1WorkerCost *= 1.4;
    document.getElementById('a1-worker-lvl').textContent = `Lvl.${USER_DATA.a1WorkerLvl}`;
    document.getElementById('a1-worker-effect').textContent = `${USER_DATA.a1WorkerEffect.toFixed(2)}`;
    document.getElementById('a1-worker-cost').innerHTML = `升級: 消耗 ${USER_DATA.a1WorkerCost.toFixed(2)} <img src="./image/ironOre.png">`;
    if (USER_DATA.a1WorkerLvl == 1) { startWorkerAutoLoop(); };
    UpdateOreDsp();
});
document.getElementById('a1-ore-cost').addEventListener('click', () => {
    if (!(USER_DATA.a1OreLvl < USER_DATA.a1OreMax)) { PopTime('a1-ore-cost', '等級已達上限', '#00cc00ff'); return; };
    if (!(USER_DATA.goldCoin >= USER_DATA.a1OreCost)) { PopTime('a1-ore-cost', '材料不足', '#ff0000ff'); return; };
    USER_DATA.goldCoin -= USER_DATA.a1OreCost;
    USER_DATA.a1OreEffect *= 1.3;
    USER_DATA.a1OreLvl += 1;
    USER_DATA.a1OreCost *= 1.5;
    document.getElementById('a1-ore-lvl').textContent = `Lvl.${USER_DATA.a1OreLvl}`;
    document.getElementById('a1-ore-effect').textContent = `${USER_DATA.a1OreEffect.toFixed(2)}`;
    document.getElementById('a1-ore-cost').innerHTML = `升級: 消耗 ${USER_DATA.a1OreCost.toFixed(2)} <img src="./image/goldCoin.png">`;
    UpdateOreDsp();
});
document.getElementById('a1-accy-cost').addEventListener('click', () => {
    if (! USER_DATA.a1AccyNormalE) { PopTime('a1-accy-cost', '需要【精準採集】', '#8000ffff'); return; };
    if (!(USER_DATA.a1AccyLvl < USER_DATA.a1AccyMax)) { PopTime('a1-accy-cost', '等級已達上限', '#00cc00ff'); return; };
    if (!(USER_DATA.goldOre >= USER_DATA.a1AccyCost)) { PopTime('a1-accy-cost', '材料不足', '#ff0000ff'); return; };
    USER_DATA.goldOre -= USER_DATA.a1AccyCost;
    USER_DATA.a1AccyEffect += 1.5;
    USER_DATA.a1AccyLvl += 1;
    USER_DATA.a1AccyCost *= 1.6;
    document.getElementById('a1-accy-lvl').textContent = `Lvl.${USER_DATA.a1AccyLvl}`;
    document.getElementById('a1-accy-effect').textContent = `${USER_DATA.a1AccyEffect.toFixed(2)}`;
    document.getElementById('a1-accy-cost').innerHTML = `升級: 消耗 ${USER_DATA.a1AccyCost.toFixed(2)} <img src="./image/goldOre.png">`;
    UpdateOreDsp();
});
document.getElementById('a1-pickaxe-cost').addEventListener('click', () => {
    if (USER_DATA.a1MinerLvl < 8) { PopTime('a1-pickaxe-cost', '需要【礦主 Lvl.8】', '#8000ffff'); return; };
    switch (USER_DATA.a1PickaxeLvl) {
        case 0:
            if (!(USER_DATA.stone >= 50)) { PopTime('a1-pickaxe-cost', '材料不足', '#ff0000ff'); return; };
            USER_DATA.stone -= 50;
            document.getElementById('a1-pickaxe-effect').textContent = USER_DATA.a1PickaxeEffect = 0.8;
            document.getElementById('a1-pickaxe-lvl').textContent = USER_DATA.a1PickaxeLvl = 1;
            document.getElementById('a1-pickaxe-cost').innerHTML = `升級: 消耗 75<img src="./image/ironIngot.png">`;
            break;
        case 1:
            if (!(USER_DATA.ironIngot >= 75)) { PopTime('a1-pickaxe-cost', '材料不足', '#ff0000ff'); return; };
            USER_DATA.ironIngot -= 75;
            document.getElementById('a1-pickaxe-effect').textContent = USER_DATA.a1PickaxeEffect = 0.6;
            document.getElementById('a1-pickaxe-lvl').textContent = USER_DATA.a1PickaxeLvl = 2;
            document.getElementById('a1-pickaxe-cost').innerHTML = `升級: 消耗 100<img src="./image/goldIngot.png">`;
            break;
        case 2:
            if (!(USER_DATA.goldIngot >= 100)) { PopTime('a1-pickaxe-cost', '材料不足', '#ff0000ff'); return; };
            USER_DATA.goldIngot -= 100;
            document.getElementById('a1-pickaxe-effect').textContent = USER_DATA.a1PickaxeEffect = 0.4;
            document.getElementById('a1-pickaxe-lvl').textContent = USER_DATA.a1PickaxeLvl = 3;
            document.getElementById('a1-pickaxe-cost').innerHTML = `升級: 消耗 125<img src="./image/Diamond.png">`;
            break;
        case 3:
            if (!(USER_DATA.diamond >= 125)) { PopTime('a1-pickaxe-cost', '材料不足', '#ff0000ff'); return; };
            USER_DATA.diamond -= 125;
            document.getElementById('a1-pickaxe-effect').textContent = USER_DATA.a1PickaxeEffect = 0.2;
            document.getElementById('a1-pickaxe-lvl').textContent = USER_DATA.a1PickaxeLvl = 4;
            document.getElementById('a1-pickaxe-cost').innerHTML = `升級: 消耗未知材料`;
            break;
        default:
            PopTime('a1-pickaxe-cost', '等級已達上限', '#00cc00ff');
            return;
    };
    UpdateOreDsp();
});
//技能（一！樣！是！石！山！代！碼！😡）/////////////////
document.getElementById('a1-long-cost').addEventListener('click', () => {
    if (USER_DATA.a1PickaxeLvl < 2) { PopTime('a1-long-cost', '需要【礦鎬 Lvl.2】', '#8000ffff'); return; };
    if (USER_DATA.a1LongE) { PopTime('a1-long-cost', '已習得', '#00cc00ff'); return; };
    if (!(USER_DATA.diamondOre >= 5)) { PopTime('a1-long-cost', '材料不足', '#ff0000ff'); return; };
    USER_DATA.diamondOre -= 5;
    USER_DATA.a1LongE = true;
    document.getElementById('a1-long').textContent = `已習得`;
    document.getElementById('a1-long-cost').textContent = `已習得`;
    UpdateOreDsp();
});
document.getElementById('a1-accyNormal-cost').addEventListener('click', () => {
    if (USER_DATA.a1PickaxeLvl < 2) { PopTime('a1-accyNormal-cost', '需要【礦鎬 Lvl.2】', '#8000ffff'); return; };
    if (USER_DATA.a1AccyNormalE) { PopTime('a1-accyNormal-cost', '已習得', '#00cc00ff'); return; };
    if (!(USER_DATA.goldOre >= 15)) { PopTime('a1-accyNormal-cost', '材料不足', '#ff0000ff'); return; };
    USER_DATA.goldOre -= 15;
    USER_DATA.a1AccyNormalE = true;
    document.getElementById('a1-accyNormal').textContent = `已習得`;
    document.getElementById('a1-accyNormal-cost').textContent = `已習得`;
    UpdateOreDsp();
});
document.getElementById('a1-short-cost').addEventListener('click', () => {
    if (!USER_DATA.a1LongE) { PopTime('a1-short-cost', '需要【蓄力採集】', '#8000ffff'); return; };
    if (USER_DATA.a1ShortE) { PopTime('a1-short-cost', '已習得', '#00cc00ff'); return; };
    if (!(USER_DATA.diamondOre >= 20)) { PopTime('a1-short-cost', '材料不足', '#ff0000ff'); return; };
    USER_DATA.diamondOre -= 20;
    USER_DATA.a1ShortE = true;
    document.getElementById('a1-short').textContent = `已習得`;
    document.getElementById('a1-short-cost').innerHTML = `已習得`;
    UpdateOreDsp();
});
document.getElementById('a1-accyLong-cost').addEventListener('click', () => {
    if (!USER_DATA.a1LongE || !USER_DATA.a1AccyNormalE) { PopTime('a1-accyLong-cost', '需要【蓄力採集】、【精準採集】', '#8000ffff'); return; };
    if (USER_DATA.a1AccyLongE) { PopTime('a1-accyLong-cost', '已習得', '#00cc00ff'); return; };
    if (!(USER_DATA.goldOre >= 50)) { PopTime('a1-accyLong-cost', '材料不足', '#ff0000ff'); return; };
    USER_DATA.goldOre -= 50;
    USER_DATA.a1AccyLongE = true;
    document.getElementById('a1-accyLong').textContent = `已習得`;
    document.getElementById('a1-accyLong-cost').innerHTML = `已習得`;
    UpdateOreDsp();
});

A1CreateSell();
A1CreateBurn();