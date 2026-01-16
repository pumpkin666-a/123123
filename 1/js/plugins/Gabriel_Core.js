/*:
 * @target MZ
 * @plugindesc [V8.0] Gabriel 專用：雙重精靈同步法 (徹底解決大圖切換閃現)
 * @author Gemini
 */

(() => {
    const CONFIG = {
        scale: 0.25,        // 縮放比例
        blinkChance: 0.015, // 眨眼機率
        blinkDuration: 7    // 眨眼長度
    };

    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.call(this);
        if (this._character === $gamePlayer) {
            this.setupGabrielBlinkLayers();
            this.updateGabrielBlinkLayers();
            this.scale.set(CONFIG.scale, CONFIG.scale);
            this.anchor.set(0.5, 1);
        }
    };

    // 1. 初始化：同時建立兩層精靈，分別裝睜眼和閉眼圖
    Sprite_Character.prototype.setupGabrielBlinkLayers = function() {
        if (!this._blinkLayer) {
            this._blinkLayer = new Sprite();
            this._blinkLayer.anchor.set(0.5, 1);
            // 載入閉眼圖 (檔名為 妳的檔名 + _blink)
            const blinkName = this._characterName + "_blink";
            this._blinkLayer.bitmap = ImageManager.loadCharacter(blinkName);
            this._blinkLayer.opacity = 0; // 平時透明
            this.addChild(this._blinkLayer);
        }
    };

    // 2. 同步邏輯：讓「閉眼圖」的動作永遠跟著「睜眼圖」走
    Sprite_Character.prototype.updateGabrielBlinkLayers = function() {
        if (!this._blinkLayer || !this._blinkLayer.bitmap.isReady()) return;

        // 強制同步裁切範圍、位置與縮放
        this._blinkLayer.setFrame(this.getFrameX(), this.getFrameY(), this.getFrameW(), this.getFrameH());
        
        // 眨眼控制：控制「閉眼層」的透明度
        if (this._blinkTimer > 0) {
            this._blinkTimer--;
            this._blinkLayer.opacity = 255; // 眨眼時，蓋上去
        } else {
            this._blinkLayer.opacity = 0;   // 不眨時，消失
            if (Math.random() < CONFIG.blinkChance) {
                this._blinkTimer = CONFIG.blinkDuration;
            }
        }
    };

    // 取得當前睜眼圖的裁切座標
    Sprite_Character.prototype.getFrameX = function() { return this._frame.x; };
    Sprite_Character.prototype.getFrameY = function() { return this._frame.y; };
    Sprite_Character.prototype.getFrameW = function() { return this._frame.width; };
    Sprite_Character.prototype.getFrameH = function() { return this._frame.height; };

})();