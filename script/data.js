//USER_DATA///////////////////////////////////////////////////////////////////////////////////////////////////////
const USER_DATA = {
    //資源
    messyStone: 0, ironOre:   0, goldOre:   0, diamondOre: 0,
    stone:      0, ironIngot: 0, goldIngot: 0, diamond:    0,
    coal:       0, goldCoin:  0,
    
    //區域一數值
    a1ShortT: 3000  , a1AccyNormalT: 3000, a1NormalT: 3000, a1AccyLongT: 6000, a1LongT: 6000,

    //區域一升級
    a1MinerLvl:   0, a1MinerEffect:   1, a1MinerCost:    5, a1MinerMax:  28,
    a1OreLvl:     0, a1OreEffect:     1, a1OreCost:     64, a1OreMax:    18,
    a1WorkerLvl:  0, a1WorkerEffect:  0, a1WorkerCost:  10, a1WorkerMax: 20,
    a1AccyLvl:    0, a1AccyEffect:   10, a1AccyCost:    30, a1AccyMax:   12,
    a1PickaxeLvl: 0, a1PickaxeEffect: 1, a1PickaxeCost:  0, a1PickaxeMax: 4,
    a1LongE:       false,
    a1AccyNormalE: false,
    a1ShortE:      false,
    a1AccyLongE:   false,

    //設定
    style: '礦洞亮',

    //成就           1      2      3
    invisibleGoal: [false, false, false]
}
const CONFIG_DATA = {
    //區域一數值
    a1ShortR:    0.2, a1AccyNormalR:    2, a1NormalR:    1, a1AccyLongR:    6, a1LongR:    3,

    //區域一資源權重
    a1StoneRate: 1, a1CoalRate: 0.256, a1IronRate: 0.064, a1GoldRate: 0.016, a1DiamondRate: 0.004,
}