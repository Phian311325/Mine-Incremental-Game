// 存檔（只存 USER_DATA）
function SaveGame() {
    localStorage.setItem('mineGameData', JSON.stringify(USER_DATA));
    PopTime('save-game-btn', '存檔成功！', '#00ff00ff');
}

function AutoSaveGame() {
    localStorage.setItem('mineGameData', JSON.stringify(USER_DATA));
    PopTime('area-d-btn', '存檔成功！', '#00ff00ff');
}

// 讀檔
function LoadGame() {
    const data = localStorage.getItem('mineGameData');
    if (!data) { PopTime('area-d-btn', '沒有存檔', '#ff0000ff'); return; }
    const parsed = JSON.parse(data);
    Object.assign(USER_DATA, parsed);
    A1UpdateDsp();  // 重新整理所有 UI
    RenderInvisibleGoals();
    UpdateStyle();
    PopTime('area-d-btn', '讀檔成功！', '#00ff00ff');
}

// 重置
function ResetGame() {
    if (!confirm('進行硬重置會使數據永久消失（除非事先導出）\n確定進行硬重置？')) return;
    localStorage.removeItem('mineGameData');
    location.reload();
}

// ==================== 導出存檔 ====================
function ExportGame() {
    try {
        // 將 USER_DATA 轉成 JSON 字串（格式化方便閱讀）
        const jsonData = JSON.stringify(USER_DATA);
        
        // 建立下載用的 Blob
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // 自動下載 .json 檔案（檔名含時間戳記，方便區分不同存檔）
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        const link = document.createElement('a');
        link.href = url;
        link.download = `礦洞增量存檔-${timestamp}.misav`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 釋放記憶體
        URL.revokeObjectURL(url);
        
        PopTime('export-game-btn', '導出成功！', '#00ff00ff');
    } catch (err) {
        PopTime('export-game-btn', '導出失敗：' + err.message, '#ff0000ff');
        console.error('導出失敗：', err);
    }
}

// ==================== 導入存檔 ====================
function ImportGame() {
    // 建立一個隱藏的上傳按鈕
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.misav';
    input.style.display = 'none';
    document.body.appendChild(input);
    
    input.addEventListener('change', function(e) {
        const file = this.files[0];
        if (!file) {
            document.body.removeChild(this);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(ev) {
            try {
                const rawData = ev.target.result;
                const importedData = JSON.parse(rawData);
                
                // 合併到 USER_DATA（保留既有結構，覆蓋相符的欄位）
                Object.assign(USER_DATA, importedData);
                
                // 更新所有 UI
                A1UpdateDsp();
                RenderInvisibleGoals();
                UpdateStyle();
                PopTime('import-reset-btn', '導入成功！', '#00ff00ff');
            } catch (err) {
                PopTime('import-reset-btn', '導入失敗，檔案格式錯誤', '#ff0000ff');
                console.error('導入失敗：', err);
            }
            
            // 移除 input 元素
            document.body.removeChild(input);
        };
        
        reader.readAsText(file);
    });
    
    // 觸發檔案選擇視窗
    input.click();
}

function UpdateStyle() {
    const saved = USER_DATA.style || '礦洞亮';
    const themeMap = {
        '礦洞亮': './style/Original.css',
        '科技暗': './style/Dark.css',
        'ferygwgghhyu': './style/DeepSeek.css'
    };
    if (themeMap[saved]) {
        document.getElementById('style').href = themeMap[saved];
        // 更新 Active 狀態
        a(saved);
    }
}
function a(saved) {
    document.querySelectorAll('#theme > .Big-Btn').forEach(btn => btn.classList.remove('Active'));
    const activeBtn = document.getElementById(`${saved}-theme`) || 
                      document.getElementById('礦洞亮-theme');
    if (activeBtn) activeBtn.classList.add('Active');
}

window.addEventListener('load', LoadGame);
document.getElementById('save-game-btn').addEventListener('click', SaveGame);
document.getElementById('export-game-btn').addEventListener('click', ExportGame);
document.getElementById('import-reset-btn').addEventListener('click', ImportGame);
document.getElementById('hard-reset-btn').addEventListener('click', ResetGame);
setInterval(AutoSaveGame, 30000);

//樣式切換/////////////////////////////////////////////////////
document.getElementById('礦洞亮-theme').addEventListener('click', () => {
    document.getElementById('style').href = './style/Original.css';
    USER_DATA.style = '礦洞亮';
    a('礦洞亮');
})
document.getElementById('科技暗-theme').addEventListener('click', () => {
    document.getElementById('style').href = './style/Dark.css';
    USER_DATA.style = '科技暗';
    a('科技暗');
})
document.getElementById('ferygwgghhyu-theme').addEventListener('click', () => {
    document.getElementById('style').href = './style/DeepSeek.css';
    USER_DATA.style = 'ferygwgghhyu';
    a('ferygwgghhyu');
})