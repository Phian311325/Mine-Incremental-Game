//函數庫/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//初始化進度條///////////////
function SetupBar(Selector) {
    const canvas = document.querySelector(Selector);
    const ctx = canvas.getContext('2d');
    // 設定實際像素尺寸（避免模糊）
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;
    return ctx;
}
//彈出提示（從按鈕位置上浮並虛化）//////////////
function PopTime(target, desc, color) {
    const btn = document.getElementById(target);
    if (!btn) return;
    // 獲取按鈕位置
    const rect = btn.getBoundingClientRect();
    // 建立彈出元素
    const pop = document.createElement('div');
    pop.textContent = desc;
    pop.style = `position: fixed; left: ${rect.left}px; top: ${rect.top}px; color: ${color}; font-size: 18px;` + 
                `text-shadow: 1px 1px #000000cc; pointer-events: none; z-index: 1`;
    document.body.appendChild(pop);
    // 動畫：上浮 + 虛化
    let startTime = performance.now();
    const duration = 1000; // 動畫持續時間
    function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // 上浮：從 0 移動到 -60px
        const offsetY = -60 * progress;
        // 虛化：50% 後透明度 1 → 0
        const opacity = 2 - progress*2;
        pop.style.transform = `translateY(${offsetY}px)`;
        pop.style.opacity = opacity;
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            pop.remove();
        }
    }
    requestAnimationFrame(animate);
}
//戰利品抽取//////////////////
function PickReward(rewards, given) {
    // 計算總權重
    let total = 0;
    for (const r of rewards) {
        total += r.rate;
    }
    // 隨機抽取
    const rng = Math.random() * total;
    let accum = 0;
    let selected = rewards[0];  // 預設第一個
    for (const r of rewards) {
        accum += r.rate;
        if (rng < accum) {
            selected = r;
            break;
        }
    }
    // 增加對應資源
    USER_DATA[selected.key] += given;
    return selected;  //回傳抽到的獎勵，方便顯示名稱
}
//軟上限///////////////////////////
function cbrtSoftCap(value, cap) {
    let m = value / cap
    if (m > 1) m = Math.cbrt(m) //開立方根也會使數值趨近於 1
    return cap * m;
};