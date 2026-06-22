//成就////////////////////////////////////////////////////////////////////////////////////////////////////////////
const INVISIBLE_GOAL = [
    /*000*/{name: '切屏大師', desc: '切屏切太快導致露出後面的東西'},
    /*001*/{name: '欸唉太好用了你知道嗎', desc: '不是跟你說只有三個樣式嗎？'},
    /*002*/{name: '尋覓大師', desc: '切屏按鈕的兩向性'},
    /*003*/{name: 'AD Block 也攔不住', desc: '反正這東西壓根獲取不了，沒有渠道'},
    /*004*/{name: '愚人節快樂', desc: '114514 1919810 2333333333333'},
]
function GainInvinibleGoal(index) {
    if (!USER_DATA[`invisGoal${index}`]) {
        PopTime('area-c-btn', `獲得隱藏成就：${INVISIBLE_GOAL[index].name}！\n${INVISIBLE_GOAL[index].desc}`, '#800080ff');
        console.log(`用戶獲得了成就：${INVISIBLE_GOAL[index].name}！\n${INVISIBLE_GOAL[index].desc}`);
        USER_DATA[`invisGoal${index}`] = true;
        RenderInvisibleGoals();
    }
}
function RenderInvisibleGoals() {
    const container = document.getElementById('invisible-goal-list');
    if (!container) return;
    
    container.innerHTML = INVISIBLE_GOAL.map((goal, index) => {
        const unlocked = USER_DATA[`invisGoal${index}`];
        return `
            <div class="Craft-Block ${unlocked ? 'Invisible-Unlocked' : 'Goal-Locked'}">
                <div class="Block-Dsp-Row Value"><span>#${index}</span><span>${unlocked ? goal.name : '????????????????????'}</span></div>
                <div class="Block-Dsp-Row" >${unlocked ? goal.desc : '????????????????????'}</div>
            </div>
        `;
    }).join('');
}

document.getElementById('goal-iaa-btn').addEventListener('click', () => {
    (USER_DATA.style == 'ferygwgghhyu') ? GainInvinibleGoal(2) : GainInvinibleGoal(0);
});
document.getElementById('ferygwgghhyu-theme').addEventListener('click', () => {
    GainInvinibleGoal(1);
})
document.getElementById('tip-text').addEventListener('click', () => {
    if (USER_DATA.tip == 19) GainInvinibleGoal(3);
})
const today = new Date();
if (today.getMonth() === 3 && today.getDate() === 1) GainInvinibleGoal(4);