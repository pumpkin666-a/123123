/*:
 * @target MZ
 * @plugindesc [V1.0] 自動眨眼系統
 * @author Gemini
 * @help 
 * 只要角色圖片名為 X.png，且資料夾內有 X_blink.png，
 * 就會隨機觸發眨眼效果。
 */

(() => {
    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.call(this);
        this.updateBlink();
    };

    Sprite_Character.prototype.updateBlink = function() {
        if (!this._character || !this._characterName) return;
        if (this._characterName.includes('_blink')) return;

        // 設定眨眼頻率 (數值越大眨越慢)
        if (Math.random() < 0.01 && !this._blinkTimer) {
            this._blinkTimer = 10; // 閉眼持續 10 幀
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
})();