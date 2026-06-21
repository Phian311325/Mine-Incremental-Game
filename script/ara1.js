//區域一/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//更新//////////////////////
function A1UpdateDsp() {
    // ==================== 礦物 ====================
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
    // ==================== 採集條 ====================
    USER_DATA.a1ShortT = 3000 * USER_DATA.a1PickaxeEffect;
    USER_DATA.a1AccyNormalT = 3000 * USER_DATA.a1PickaxeEffect;
    USER_DATA.a1NormalT = 3000 * USER_DATA.a1PickaxeEffect;
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
    //有短採集
    if (USER_DATA.a1ShortE) {
        USER_DATA.a1ShortT = 300 * USER_DATA.a1PickaxeEffect;
    }
    //有蓄力精準採集
    if (USER_DATA.a1AccyLongE) {
        USER_DATA.a1AccyLongT = 6000 * USER_DATA.a1PickaxeEffect - USER_DATA.a1AccyEffect;
        USER_DATA.a1LongT = 6000 * USER_DATA.a1PickaxeEffect + USER_DATA.a1AccyEffect;
    }
    //更新採集條
    A1DrawMinerProgress(0);
    A1DrawWorkerProgress(0);
    //恢復自動化
    if (USER_DATA.a1WorkerLvl >= 1) startWorkerAutoLoop();

    // ==================== 技能 UI 配置 ====================
    const SKILL_UI_CONFIG = [
        { id: 'miner',  lvlKey: 'a1MinerLvl',  effectKey: 'a1MinerEffect',  costKey: 'a1MinerCost',  img: 'messyStone.png' },
        { id: 'worker', lvlKey: 'a1WorkerLvl', effectKey: 'a1WorkerEffect', costKey: 'a1WorkerCost', img: 'ironOre.png' },
        { id: 'ore',    lvlKey: 'a1OreLvl',    effectKey: 'a1OreEffect',    costKey: 'a1OreCost',    img: 'goldCoin.png' },
        { id: 'accy',   lvlKey: 'a1AccyLvl',   effectKey: 'a1AccyEffect',   costKey: 'a1AccyCost',   img: 'goldOre.png' }
    ];

    // ==================== 解鎖技能 UI 配置 ====================
    const UNLOCK_UI_CONFIG = [
        { id: 'long',        key: 'a1LongE' },
        { id: 'accyNormal',  key: 'a1AccyNormalE' },
        { id: 'short',       key: 'a1ShortE' },
        { id: 'accyLong',    key: 'a1AccyLongE' }
    ];

    // ==================== 更新所有技能面板 ====================
    function A1UpdateSkills() {
        // 1. 主要技能（礦主、礦工、礦脈、判定）
        SKILL_UI_CONFIG.forEach(({ id, lvlKey, effectKey, costKey, img }) => {
            document.getElementById(`a1-${id}-lvl`).textContent = `Lvl.${USER_DATA[lvlKey]}`;
            document.getElementById(`a1-${id}-effect`).textContent = USER_DATA[effectKey].toFixed(2);
            document.getElementById(`a1-${id}-cost`).innerHTML =
                `升級: 消耗 ${USER_DATA[costKey].toFixed(2)} <img src="./image/${img}">`;
        });
        // 2. 礦鎬（特殊處理，分段成本）
        const lvl = USER_DATA.a1PickaxeLvl;
        document.getElementById('a1-pickaxe-lvl').textContent = lvl;
        document.getElementById('a1-pickaxe-effect').textContent = USER_DATA.a1PickaxeEffect.toFixed(2);
        if (lvl >= 4) {
            document.getElementById('a1-pickaxe-cost').innerHTML = '已滿級';
        } else {
            const costs = [50, 75, 100, 125];
            const types = ['stone', 'ironIngot', 'goldIngot', 'diamond'];
            document.getElementById('a1-pickaxe-cost').innerHTML =
                `升級: 消耗 ${costs[lvl]} <img src="./image/${types[lvl]}.png">`;
        }
        // 3. 解鎖技能（蓄力、精準、短採、蓄力精準）
        UNLOCK_UI_CONFIG.forEach(({ id, key }) => {
            const status = USER_DATA[key] ? '已習得' : '未習得';
            document.getElementById(`a1-${id}`).textContent = status;
            document.getElementById(`a1-${id}-cost`).innerHTML = USER_DATA[key] ? '已習得' : document.getElementById(`a1-${id}-cost`).innerHTML;
        });
    };
    A1UpdateSkills();
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
    minerCtx.fillStyle = '#66666666'; minerCtx.fillRect(0, 0, w*(T/max), h);
    minerCtx.fillStyle = '#666666ff'; minerCtx.fillRect(w*(T/max)-1, 0, 2, h);    
}
// 繪製礦工進度
function A1DrawWorkerProgress(percent) {
    if (!workerCtx) return;
    const canvas = document.querySelector('.A1-Worker-Bar');
    const w = canvas.width; const h = canvas.height;   
    workerCtx.clearRect(0, 0, w, h);
    workerCtx.fillStyle = '#00000033'; workerCtx.fillRect(0, 0, w, h);
    workerCtx.fillStyle = '#66666666'; workerCtx.fillRect(0, 0, w*(percent), h);
    workerCtx.fillStyle = '#666666ff'; workerCtx.fillRect(w*(percent)-1, 0, 2, h);
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
    PopTime('a1-miner-btn', `${desc} ${result.name}+${rate.toFixed(2)}`, color);
    A1UpdateDsp();
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
                { key: 'messyStone', name: '碎石', rate: cbrtSoftCap(CONFIG_DATA.a1StoneRate * USER_DATA.a1OreEffect, 1) },
                { key: 'coal', name: '煤炭', rate: cbrtSoftCap(CONFIG_DATA.a1CoalRate * USER_DATA.a1OreEffect, 1) },
                { key: 'ironOre', name: '鐵礦', rate: cbrtSoftCap(CONFIG_DATA.a1IronRate * USER_DATA.a1OreEffect, 1) },
                { key: 'goldOre', name: '金礦', rate: cbrtSoftCap(CONFIG_DATA.a1GoldRate * USER_DATA.a1OreEffect, 1) },
                { key: 'diamondOre', name: '鑽礦', rate: cbrtSoftCap(CONFIG_DATA.a1DiamondRate * USER_DATA.a1OreEffect, 1) }
            ];
            const result = PickReward(A1_MINE_ORE, CONFIG_DATA.a1NormalR * USER_DATA.a1MinerEffect);
            PopTime('a1-worker-btn', `自動 ${result.name}+${(CONFIG_DATA.a1NormalR * USER_DATA.a1MinerEffect).toFixed(2)}`, '#ffffffff');
            A1UpdateDsp();
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
            A1UpdateDsp();
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
            A1UpdateDsp();
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
//升級（Deepseek AI 幫我寫的）//////////////////////////////////////////////////////////////////////////////
// ==================== 升級配置 ====================
const UPGRADE_CONFIG = [
    { id: 'miner', lvlKey: 'a1MinerLvl', maxKey: 'a1MinerMax', costKey: 'a1MinerCost', 
      costType: 'messyStone', effectKey: 'a1MinerEffect', effectAdd: 0.25, costMul: 1.35,
      label: '礦主', icon: 'messyStone.png' },
    { id: 'worker', lvlKey: 'a1WorkerLvl', maxKey: 'a1WorkerMax', costKey: 'a1WorkerCost',
      costType: 'ironOre', effectKey: 'a1WorkerEffect', effectAdd: 0.05, costMul: 1.4,
      label: '礦工', icon: 'ironOre.png', onUpgrade: (lvl) => { if (lvl === 1) startWorkerAutoLoop(); } },
    { id: 'ore', lvlKey: 'a1OreLvl', maxKey: 'a1OreMax', costKey: 'a1OreCost',
      costType: 'goldCoin', effectKey: 'a1OreEffect', effectMul: 1.3, costMul: 1.5,
      label: '礦脈', icon: 'goldCoin.png' },
    { id: 'accy', lvlKey: 'a1AccyLvl', maxKey: 'a1AccyMax', costKey: 'a1AccyCost',
      costType: 'goldOre', effectKey: 'a1AccyEffect', effectAdd: 1.5, costMul: 1.6,
      label: '判定', icon: 'goldOre.png', require: { key: 'a1AccyNormalE', msg: '需要【精準採集】' } }
];

// ==================== 通用升級函數 ====================
function A1Upgrade(config) {
    const { id, lvlKey, maxKey, costKey, costType, effectKey, effectAdd, effectMul, costMul, require, onUpgrade } = config;
    // 檢查前置條件
    if (require && !USER_DATA[require.key]) {
        PopTime(`a1-${id}-cost`, require.msg, '#8000ffff');
        return;
    }
    // 檢查上限
    if (USER_DATA[lvlKey] >= USER_DATA[maxKey]) {
        PopTime(`a1-${id}-cost`, '等級已達上限', '#00cc00ff');
        return;
    }
    // 檢查資源
    if (USER_DATA[costType] < USER_DATA[costKey]) {
        PopTime(`a1-${id}-cost`, '材料不足', '#ff0000ff');
        return;
    }
    // 扣除資源
    USER_DATA[costType] -= USER_DATA[costKey];
    // 更新數值
    USER_DATA[lvlKey] += 1;
    if (effectAdd) USER_DATA[effectKey] += effectAdd;
    if (effectMul) USER_DATA[effectKey] *= effectMul;
    USER_DATA[costKey] *= costMul;
    // 更新 DOM
    const lvlEl = document.getElementById(`a1-${id}-lvl`);
    const effectEl = document.getElementById(`a1-${id}-effect`);
    const costEl = document.getElementById(`a1-${id}-cost`);
    if (lvlEl) lvlEl.textContent = `Lvl.${USER_DATA[lvlKey]}`;
    if (effectEl) effectEl.textContent = USER_DATA[effectKey].toFixed(2);
    if (costEl) {
        costEl.innerHTML = `升級: 消耗 ${USER_DATA[costKey].toFixed(2)} <img src="./image/${costType}.png">`;
    }
    // 升級後回調
    if (onUpgrade) onUpgrade(USER_DATA[lvlKey]);
    A1UpdateDsp();
}
//礦鎬升級/////////////////////////
const PICKAXE_STAGES = [
    { lvl: 0, cost: 50, costType: 'stone', effect: 0.8, nextCost: 75, nextType: 'ironIngot' },
    { lvl: 1, cost: 75, costType: 'ironIngot', effect: 0.6, nextCost: 100, nextType: 'goldIngot' },
    { lvl: 2, cost: 100, costType: 'goldIngot', effect: 0.4, nextCost: 125, nextType: 'diamond' },
    { lvl: 3, cost: 125, costType: 'diamond', effect: 0.2, nextCost: null, nextType: null }
];
document.getElementById('a1-pickaxe-cost').addEventListener('click', () => {
    if (USER_DATA.a1MinerLvl < 8) {
        PopTime('a1-pickaxe-cost', '需要【礦主 Lvl.8】', '#8000ffff');
        return;
    }
    const currentLvl = USER_DATA.a1PickaxeLvl;
    if (currentLvl >= 4) {
        PopTime('a1-pickaxe-cost', '等級已達上限', '#00cc00ff');
        return;
    }
    const stage = PICKAXE_STAGES[currentLvl];
    if (USER_DATA[stage.costType] < stage.cost) {
        PopTime('a1-pickaxe-cost', '材料不足', '#ff0000ff');
        return;
    }
    const next = PICKAXE_STAGES[USER_DATA.a1PickaxeLvl];
    USER_DATA[stage.costType] -= stage.cost;
    USER_DATA.a1PickaxeLvl = currentLvl + 1;
    USER_DATA.a1PickaxeEffect = stage.effect;
    // 更新 DOM
    document.getElementById('a1-pickaxe-lvl').textContent = USER_DATA.a1PickaxeLvl;
    document.getElementById('a1-pickaxe-effect').textContent = USER_DATA.a1PickaxeEffect;
    if (next && next.nextCost) {
        document.getElementById('a1-pickaxe-cost').innerHTML = 
            `升級: 消耗 ${next.nextCost}<img src="./image/${next.nextType}.png">`;
    } else {
        document.getElementById('a1-pickaxe-cost').innerHTML = `等級已達上限`;
    }
    A1UpdateDsp();
});
// ==================== 綁定所有升級按鈕 ====================
UPGRADE_CONFIG.forEach(cfg => {
    document.getElementById(`a1-${cfg.id}-cost`).addEventListener('click', () => A1Upgrade(cfg));
});
//技能學習////////////////////////////////////
const UNLOCK_CONFIG = [
    { id: 'long', check: () => USER_DATA.a1PickaxeLvl >= 2, 
      cost: { diamondOre: 5 }, flag: 'a1LongE', request: '【礦鎬 Lvl.2】' },
      
    { id: 'accyNormal', check: () => USER_DATA.a1PickaxeLvl >= 2,
      cost: { goldOre: 15 }, flag: 'a1AccyNormalE', request: '【礦鎬 Lvl.2】' },
      
    { id: 'short', check: () => USER_DATA.a1LongE,
      cost: { diamondOre: 20 }, flag: 'a1ShortE', request: '【蓄力採集】' },
      
    { id: 'accyLong', check: () => USER_DATA.a1LongE && USER_DATA.a1AccyNormalE,
      cost: { goldOre: 50 }, flag: 'a1AccyLongE', request: '【蓄力精準】【精準採集】' }
];
UNLOCK_CONFIG.forEach(({ id, check, cost, flag, label, request }) => {
    document.getElementById(`a1-${id}-cost`).addEventListener('click', () => {
        if (!check()) {
            PopTime(`a1-${id}-cost`, `需要${request}`, '#8000ffff');
            return;
        }
        if (USER_DATA[flag]) {
            PopTime(`a1-${id}-cost`, '已習得', '#00cc00ff');
            return;
        }
        // 檢查所有消耗
        for (const [key, amount] of Object.entries(cost)) {
            if (USER_DATA[key] < amount) {
                PopTime(`a1-${id}-cost`, '材料不足', '#ff0000ff');
                return;
            }
        }
        // 扣除資源
        for (const [key, amount] of Object.entries(cost)) {
            USER_DATA[key] -= amount;
        }
        USER_DATA[flag] = true;
        document.getElementById(`a1-${id}`).textContent = '已習得';
        document.getElementById(`a1-${id}-cost`).innerHTML = '已習得';
        A1UpdateDsp();
    });
});

A1CreateSell();
A1CreateBurn();