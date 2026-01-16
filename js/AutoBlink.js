/*:
 * @target MZ
 * @plugindesc [V1.3] 自動眨眼系統 - 預載入強化版
 * @author Gemini
 */

(() => {
    // 1. 預載入機制：防止大圖加載延遲導致看不見眨眼
    const _Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
    Scene_Boot.prototype.loadSystemImages = function() {
        _Scene_Boot_loadSystemImages.call(this);
        // 如果你有其他角色也要眨眼，可以在這裡多加幾行
        ImageManager.loadCharacter("$gabriel_blink");
    };

    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.call(this);
        this.updateBlink();
    };

    Sprite_Character.prototype.updateBlink = function() {
        if (!this._character || !this._characterName) return;
        // 排除掉已經在眨眼的圖或非目標角色
        if (this._characterName.toLowerCase().includes('_blink')) return;
        if (!this._characterName.toLowerCase().includes('gabriel')) return;

        // 隨機觸發 (提高機率到 0.02 讓你測試時更容易看到)
        if (Math.random() < 0.02 && !this._blinkTimer) {
            this._blinkTimer = 12; // 稍微加長閉眼時間到 12 幀，方便觀察
            this._originalName = this._characterName;
            this.setCharacterBitmap(this._originalName + "_blink");
        }

        if (this._blinkTimer > 0) {
            this._blinkTimer--;
            if (this._blinkTimer === 0) {
                this.setCharacterBitmap(this._originalName);
            }
        }
    };

    Sprite_Character.prototype.setCharacterBitmap = function(name) {
        if (this._characterName !== name) {
            this._characterName = name;
            this.bitmap = ImageManager.loadCharacter(name);
            // 強制重新計算框架，防止巨大圖換圖時位移
            this.updateCharacterFrame();
        }
    };
})();