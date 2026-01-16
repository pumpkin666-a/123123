/*:
 * @target MZ
 * @plugindesc [V1.2] 備註式地圖陰影疊加 (蓋在人物上方)
 * @author Gemini
 * @help 
 * 在地圖備註欄輸入 <OverShadow:圖片檔名>
 * 圖片請放在 img/parallaxes 資料夾，合成模式為「乘法」。
 */

(() => {
    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createCustomShadowLayer();
    };

    Spriteset_Map.prototype.createCustomShadowLayer = function() {
        if ($dataMap.meta.OverShadow) {
            this._customShadowLayer = new Sprite();
            this._customShadowLayer.bitmap = ImageManager.loadParallax($dataMap.meta.OverShadow);
            this._customShadowLayer.z = 20;         // 確保層級高於人物
            this._customShadowLayer.blendMode = 2;  // 重要：2 為「乘法 (Multiply)」，專用於陰影
            this._baseSprite.addChild(this._customShadowLayer);
        }
    };

    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.call(this);
        if (this._customShadowLayer) {
            // 同步 1920x1080 圖片與地圖捲動
            this._customShadowLayer.x = -$gameMap.displayX() * $gameMap.tileWidth();
            this._customShadowLayer.y = -$gameMap.displayY() * $gameMap.tileHeight();
        }
    };
})();