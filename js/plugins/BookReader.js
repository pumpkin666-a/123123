/*:
 * @target MZ
 * @plugindesc 獨立讀書系統 - 強制撐開內容與位置修正
 * @author Gemini
 */

(() => {
    const BOOK_SWITCH = 10; 

    // 1. 強制讓視窗和內容區域變成全螢幕
    const _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function() {
        if ($gameSwitches.value(BOOK_SWITCH)) {
            this.width = Graphics.boxWidth;
            this.height = Graphics.boxHeight;
            this.x = 0;
            this.y = 0;
            this.opacity = 0;
            // 關鍵：直接重新建立內容畫布，確保它跟螢幕一樣大
            this.createContents(); 
            this.setBackgroundType(2); // 隱藏原本的花邊框
        } else {
            _Window_Message_updatePlacement.call(this);
        }
    };

// 2. 文字排版：首行與後續行對齊優化
    const _Window_Message_newPage = Window_Message.prototype.newPage;
    Window_Message.prototype.newPage = function(textState) {
        _Window_Message_newPage.call(this, textState);
        if ($gameSwitches.value(BOOK_SWITCH)) {
            // 設定第一行的起點
            // y = 550 是高度（妳可以依需求微調）
            // x = 100 是左邊距
            textState.y = 550; 
            textState.x = 100;
            this.contents.textColor = '#ffffff'; // 確保白色字
        }
    };

    // 修正每一行換行後的左邊距，確保跟首行對齊
    const _Window_Message_newLineX = Window_Message.prototype.newLineX;
    Window_Message.prototype.newLineX = function() {
        if ($gameSwitches.value(BOOK_SWITCH)) {
            return 100; // 必須跟上面的 textState.x 一致
        }
        return _Window_Message_newLineX.call(this);
    };

    // 3. 背景黑屏：確保覆蓋全螢幕
    const _Window_Message_setBackgroundType = Window_Message.prototype.setBackgroundType;
    Window_Message.prototype.setBackgroundType = function(type) {
        if ($gameSwitches.value(BOOK_SWITCH)) {
            if (!this._readerBg) {
                this._readerBg = new Sprite();
                this.addChildAt(this._readerBg, 0);
            }
            this._readerBg.bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
            this._readerBg.bitmap.fillAll('rgba(0, 0, 0, 0.95)'); 
            this._readerBg.visible = true;
            // 徹底關閉其他插件可能產生的背景圖片
            if (this._customBg) this._customBg.visible = false;
        } else {
            if (this._readerBg) this._readerBg.visible = false;
            _Window_Message_setBackgroundType.call(this, type);
        }
    };
})();