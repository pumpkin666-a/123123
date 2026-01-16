/*:
 * @target MZ
 * @plugindesc [v1.1] 在指定座標 (黑色區域) 顯示地點與時間
 * @help 
 * 1. 請確保 數據庫 > 系統2 > UI區域寬度/高度 設為 1920x1080。
 * 2. 視窗會固定在螢幕絕對座標，不隨地圖滾動。
 */

(() => {
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        
        // 建立視窗 (寬度 450, 高度 120)
        const rect = new Rectangle(0, 0, 450, 120);
        this._infoWindow = new Window_Base(rect);
        
        // 強制座標定位：x=20, y=20 (左上角黑色區域)
        this._infoWindow.x = 20; 
        this._infoWindow.y = 20;
        
        // 如果想讓視窗背景變透明，請把下面這行前面的 // 刪除：
        // this._infoWindow.opacity = 0; 
        
        this.addWindow(this._infoWindow);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        
        if (this._infoWindow) {
            this._infoWindow.contents.clear();
            
            // 抓取地圖設置中的「顯示名稱」
            const mapName = $gameMap.displayName() || "未知區域";
            
            // 抓取電腦系統時間
            const time = new Date().toLocaleTimeString('zh-TW', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            });
            
            // 繪製文字 (不限制寬度避免被切掉)
            this._infoWindow.contents.fontSize = 26; // 稍微調大字體配合1920解析度
            this._infoWindow.drawText(`📍 地點: ${mapName}`, 0, 0, 400);
            this._infoWindow.drawText(`⏰ 時間: ${time}`, 0, 46, 400);
        }
    };
})();