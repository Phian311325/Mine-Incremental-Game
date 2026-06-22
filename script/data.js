//USER_DATA///////////////////////////////////////////////////////////////////////////////////////////////////////
const USER_DATA = {
    //資源
    messyStone: 0, ironOre:   0, goldOre:   0, diamondOre: 0,
    stone:      0, ironIngot: 0, goldIngot: 0, diamond:    0,
    coal:       0, goldCoin:  0,
    
    //區域一數值
    a1ShortT: 3000  , a1AccyNormalT: 3000, a1NormalT: 3000, a1AccyLongT: 6000, a1LongT: 6000,

    //區域一升級
    a1MinerLvl:    0, a1OreLvl:    0, a1WorkerLvl:    0, a1AccyLvl:    0, a1CritRateLvl:    0, a1CritDmgLvl:    0, a1PickaxeLvl:    0, 
    a1MinerEffect: 0, a1OreEffect: 0, a1WorkerEffect: 0, a1AccyEffect: 0, a1CritRateEffect: 0, a1CritDmgEffect: 0, a1PickaxeEffect: 0, 
    a1MinerCost:   0, a1OreCost:   0, a1WorkerCost:   0, a1AccyCost:   0, a1CritRateCost:   0, a1CritDmgCost:   0,

    a1PowerLvl:    0, a1ShortLvl:    0, a1PreciseLvl:    0, a1PickaxeEffect: 1, 
    a1PowerEffect: 0, a1ShortEffect: 0, a1PreciseEffect: 0,
    a1PowerCost:   0, a1ShortCost:   0, a1PreciseCost:   0,

    //區域一技能
    a1LongE: false, a1AccyNormalE: false, a1ShortE: false, a1AccyLongE: false,

    //其他
    style: '礦洞亮', tip: 12,

    //成就
    invisGoal0: false, invisGoal1: false, invisGoal2: false, invisGoal3: false, invisGoal4: false,
} 
const CONFIG_DATA = {
    //區域一數值
    a1ShortR: 0.2, a1AccyNormalR: 2, a1NormalR: 1, a1AccyLongR: 6, a1LongR: 3,

    //區域一資源權重
    a1StoneRate: 1, a1CoalRate: 0.256, a1IronRate: 0.064, a1GoldRate: 0.016, a1DiamondRate: 0.004,

    //區域一升級
    a1MinerEffect:  1,    a1OreEffect:  1,    a1WorkerEffect:  0,    a1AccyEffect: 10,     a1CritRateEffect:  4,    a1CritDmgEffect:  1.5,  
    a1MinerCost:    3,    a1OreCost:   40,    a1WorkerCost:   10,    a1AccyCost:   30,     a1CritRateCost:    2,    a1CritDmgCost:   20,
    a1MinerMax:    28,    a1OreMax:    26,    a1WorkerMax:    14,    a1AccyMax:    12,     a1CritRateMax:    16,    a1CritDmgMax:    15,
    a1MinerAdd:     0.25, a1OreAdd:     1.3, a1WorkerAdd:      0.08, a1AccyAdd:     1.5,   a1CritRateAdd:     0.5,  a1CritDmgAdd:     0.1,
    a1MinerMul:     1.28, a1OreMul:     1.32, a1WorkerMul:     1.47,  a1AccyMul:    1.37,  a1CritRateMul:     1.44, a1CritDmgMul:     1.36,

    a1PowerEffect:  2,    a1ShortEffect:  0.16, a1PreciseEffect:  1.2,
    a1PowerCost:    3,    a1ShortCost:   50,    a1PreciseCost:   10,
    a1PowerMax:    20,    a1ShortMax:     8,    a1PreciseMax:    10,
    a1PowerAdd:     0.1,  a1ShortAdd:    -0.02, a1PreciseAdd:     0.08,
    a1PowerMul:     1.31, a1ShortMul:     1.74, a1PreciseMul:     1.66,
}