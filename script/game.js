//切換區域////////////////////////////////////////////////////////////////////////////////////////////////////////
function SwitchAreaDiv(prev, now) {
    now.classList.add('Show');
    prev.classList.add('Animate-Out');
    now.classList.add('Animate-In');
    // 等待動畫結束後，清理動畫 class 並隱藏舊區域
    const onAnimationEnd = (e) => {
        if (e.target === prev) {
            prev.classList.remove('Show');
            prev.classList.remove('Animate-Out');
            prev.removeEventListener('animationend', onAnimationEnd);
        }
        if (e.target === now) {
            now.classList.remove('Animate-In');
            now.removeEventListener('animationend', onAnimationEnd);
        }
    }
    prev.addEventListener('animationend', onAnimationEnd);
    now.addEventListener('animationend', onAnimationEnd);
}
//監聽區域按鈕
function BindAreaBtn(area) {
    document.getElementById(`area-${area}-btn`).addEventListener('click', GoArea);
    function GoArea() {
        const prev = document.querySelector('.Area-Ctt > .Show');
        const now = document.getElementById(`area-${area}-ctt`);
        SwitchAreaDiv(prev, now);

        const subPrev = document.querySelector('.Sub-Bar > .Show');
        const subNow = document.getElementById(`sub-${area}-bar`);
        SwitchAreaDiv(subPrev, subNow);

        document.querySelector('.Area-Bar > .Active').classList.remove('Active');
        document.getElementById(`area-${area}-btn`).classList.add('Active');
        document.querySelector(`#sub-${area}-bar > .Active`).classList.remove('Active');
        document.getElementById(`sub-${area}-btn`).classList.add('Active');
    }
}
//監聽子區域按鈕
function BindSubAreaBtn(area, barArea) {
    document.getElementById(`sub-${area}-btn`).addEventListener('click', () => GoSubArea());
    function GoSubArea() {
        const prev = document.querySelector('.Area-Ctt > .Show');
        const now = document.getElementById(`area-${area}-ctt`);
        SwitchAreaDiv(prev, now);
        document.querySelector(`#sub-${barArea}-bar > .Active`).classList.remove('Active');
        document.getElementById(`sub-${area}-btn`).classList.add('Active');
    }
}

const areas = ['a', 'b', 'c', 'd', 'e', 'f'];
areas.forEach(BindAreaBtn);

const subAreas = [
    { area: 'c', bar: 'c' },
    { area: 'ca', bar: 'c' },
    { area: 'e', bar: 'e' },
    { area: 'ea', bar: 'e' }
];
subAreas.forEach(({ area, bar }) => BindSubAreaBtn(area, bar));

//Tips/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const tipList = [
    /*000*/'這是一條測試 Tip，用於測試 Tip 欄是否正常運作。',
    /*001*/'這是一條很長很長很長很長很長很長很長很長很長很長很長很長很長很長的 Tip。',
    /*002*/'!!! !! !! !!!!!!!',
    /*003*/'這條 Tip 也太長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長' + 
           '長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長長了吧…………',
    /*004*/'std::cout << "Hello Mine Increment" << endl;',
    /*005*/'1+1=2？ 錯！ 1+1=10　　　　　！',
    /*006*/'5!=20；5!=120。',
    /*007*/'這字可不能倒著念啊：EolaNnaihP。',
    /*008*/'你比較喜歡以下哪一種顏色？紅色、#ff0000、rgb(255, 0, 0)、#ff0000ff、rgba(255, 0, 0, 1)、#f00、#f00f。',
    /*009*/'如果你有焺鸊胾倥耉鋥（虛構的哈哈）請不要閱讀此內容。',
    /*010*/'對這個仁來說 PhianNaloE 太南了中聞，這禮友兩個：一號，中文我不慧圖晝那麼哆學不起夾；二號，總是會范一棵錯誤文法的。',
    /*011*/'X X XXX, x x xxx, XX X XXX, xx x xxx, X X X XXXX, x x x xxxx, XX XX XXX X X, xx xx xxx x x',
    /*012*/'本遊戲由 PhianNaloE 製作。',
    /*013*/'停止從一個區域轉到另一個區域，尤其是速度太快的時候…',
    /*014*/'看膩了現有樣式？去設定那改吧！但我要提醒你只有三個主題。',
    /*015*/'誰曾想，一顆按扭到了裏世界也會變……',
    /*016*/'手動挖一次礦就相當於打了一個長條…起點能自訂的那種。',
    /*017*/'你皮膚怎麼那麼紫？',
    /*018*/'以防你不知道，權重軟上限已經調為四次方根了。',
    /*019*/'好礦工，有好料，快購買【挖礦百倍卡】祝你快速通關！！王小明代言承諾童叟不欺，只要 999999999999999 通用貨幣！！        AD [╳]',
];

const tipElement = document.getElementById('tip-text');

function switchTip() {
    // 淡出效果（可選）
    tipElement.style.opacity = '0';
    
    setTimeout(() => {
        USER_DATA.tip = Math.floor(Math.random()*tipList.length);
        tipElement.textContent = tipList[USER_DATA.tip];
        
        // 重置動畫
        tipElement.style.animation = 'none';
        tipElement.offsetHeight; // 強制重繪
        tipElement.style.animation = 'marquee 15s linear infinite';
        tipElement.style.opacity = '1';
    }, 300);
}

// 每 10 秒換一條（配合動畫長度）
setInterval(switchTip, 10000);