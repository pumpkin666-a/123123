/*:
 * @target MZ
 * @plugindesc 終極自定義對話框修復版 - 鎖定位置、座標與文字起點
 * @author Gemini
 * @help 
 * 1. 將對話框背景圖片放入 /img/pictures/ 資料夾。
 * 2. 圖片檔名需為 MyCustomBox.png。
 */

(() => {
    const imageName = 'MyCustomBox'; 

    // 1. 遊戲啟動時預載圖片
    const _Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
    Scene_Boot.prototype.loadSystemImages = function() {
        _Scene_Boot_loadSystemImages.call(this);
        ImageManager.loadPicture(imageName);
    };

    // 2. 物理鎖定對話視窗的大小與螢幕位置
    const _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function() {
        _Window_Message_updatePlacement.call(this);
        
        this.width = 1800;   // 根據妳的圖片寬度
        this.height = 351;   // 根據妳的圖片高度
        
        // 置中並靠下顯示
        this.x = (Graphics.boxWidth - this.width) / 2;
        this.y = Graphics.boxHeight - this.height - 20;
        
        this.opacity = 0;    // 隱藏原始視窗框，只顯示自定義圖片
        this.padding = 18;   // 保持內部基本邊距
    };

    // 3. 解決位移核心：鎖死文字起始 X 座標
    // 數字 420 會讓文字往右移，避開左邊的花紋
    Window_Message.prototype.newLineX = function() {
        return 420; 
    };

    // 4. 解決位移核心：鎖死新頁面文字起始點
    const _Window_Message_newPage = Window_Message.prototype.newPage;
    Window_Message.prototype.newPage = function(textState) {
        _Window_Message_newPage.call(this, textState);
        textState.x = this.newLineX(); // 強制回歸 420，不准累加
        textState.y = 110;             // 垂直起點，數字越大越靠下，讓文字居中
    };

    // 5. 將自定義圖片置入對話框背景
    const _Window_Message_setBackgroundType = Window_Message.prototype.setBackgroundType;
    Window_Message.prototype.setBackgroundType = function(type) {
        if (type === 0) { // 當對話選擇「視窗」模式時顯示
            if (!this._customBg) {
                this._customBg = new Sprite();
                this._customBg.bitmap = ImageManager.loadPicture(imageName);
                this._customBg.anchor.x = 0.5;
                this._customBg.anchor.y = 0.5;
                this.addChildAt(this._customBg, 0); // 確保在文字下方
            }
            // 圖片在視窗內的中心點
            this._customBg.x = this.width / 2; 
            this._customBg.y = this.height / 2;
            this._customBg.visible = true;
        } else if (this._customBg) {
            this._customBg.visible = false;
        }
    };

// 6. 選項視窗（ChoiceList）位置精準修正
    Window_ChoiceList.prototype._refreshFrame = function() {}; 
    
    const _Window_ChoiceList_updatePlacement = Window_ChoiceList.prototype.updatePlacement;
    Window_ChoiceList.prototype.updatePlacement = function() {
        _Window_ChoiceList_updatePlacement.call(this);
        
        // --- 【水平位置修正】 ---
        // 將選項視窗定位在自定義對話框右側花紋的左邊
        // 1800 是妳對話框的寬度，減去視窗本身寬度再減去邊距
        const messageWindowX = (Graphics.boxWidth - 1800) / 2;
        this.x = messageWindowX + 1800 - this.width - 80; 
        
        // --- 【垂直位置修正】 ---
        // 確保選項從對話框上方長出來，不論選項有多少都不會掉下去
        this.y = Graphics.boxHeight - this.height - 120; 
        
        this.opacity = 0; 
        
        // 重新繪製背景黑塊
        if (!this._myBlackBox) {
            this._myBlackBox = new Sprite();
            this.addChildAt(this._myBlackBox, 0);
        }
        this._myBlackBox.bitmap = new Bitmap(this.width, this.height);
        this._myBlackBox.bitmap.fillAll('rgba(0, 0, 0, 0.9)'); // 90% 透明度的黑
    };
})();