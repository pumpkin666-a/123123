/*:
 * @target MZ
 * @plugindesc [V3.6] 終極大型圖優化 - 自動去框與防崩潰
 * @author Gemini
 */

(() => {
    // 1. 渲染優化：強制清除大圖縮放產生的邊緣滲漏
    const _Sprite_Character_updateBitmap = Sprite_Character.prototype.updateBitmap;
    Sprite_Character.prototype.updateBitmap = function() {
        _Sprite_Character_updateBitmap.call(this);
        if (this.bitmap && this.bitmap.baseTexture) {
            this.bitmap.baseTexture.scaleMode = 0; // Nearest: 讓邊緣銳利，不產生灰框
            this.bitmap.baseTexture.mipmap = 0;    // 關閉縮圖快取，消除殘影
            this.bitmap.smooth = false;
        }
    };

    // 2. 物理裁切：如果圖片邊緣還有極微量雜訊，直接切掉它
    const _Sprite_Character_setFrame = Sprite_Character.prototype.setFrame;
    Sprite_Character.prototype.setFrame = function(x, y, pw, ph) {
        // 往內縮 10 像素。因為你圖很大，縮 10 像素完全不會影響外觀，但能完美去框
        const offset = 10; 
        _Sprite_Character_setFrame.call(this, x + offset, y + offset, pw - (offset * 2), ph - (offset * 2));
    };

    // 3. 縮放邏輯與安全檢查 (解決 Cannot read property 'meta' of undefined)
    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.call(this);
        if (this._character) {
            this.applyCustomScale();
        }
    };

    Sprite_Character.prototype.applyCustomScale = function() {
        // 多重安全檢查：確保遊戲資料已準備好，避免開頭或切換地圖時崩潰
        if (typeof $gameParty === 'undefined' || !$gameParty) return;

        let targetData = null;
        try {
            if (this._character instanceof Game_Player) {
                const leader = $gameParty.leader();
                if (leader) targetData = leader.actor();
            } else if (this._character instanceof Game_Event) {
                targetData = this._character.event();
            } else if (this._character instanceof Game_Follower) {
                const actor = this._character.actor();
                if (actor) targetData = actor.actor();
            }
        } catch (e) { return; }

        // 執行縮放
        if (targetData && targetData.meta && targetData.meta.scale) {
            const s = Number(targetData.meta.scale);
            if (!isNaN(s)) {
                this.scale.set(s, s);
                this.anchor.y = 1;
            }
        }
    };
})();