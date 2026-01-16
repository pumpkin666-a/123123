/*:
 * @target MZ
 * @plugindesc [V1.1] 備註式地圖光影疊加 (蓋在人物上方)
 * @author Gemini
 * @help 
 * 在地圖備註欄輸入 <OverLayer:圖片檔名>
 * 圖片請放在 img/parallaxes 資料夾，合成模式預設為「加法」。
 */

(() => {
    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createCustomOverLayer();
    };

    Spriteset_Map.prototype.createCustomOverLayer = function() {
        if ($dataMap.meta.OverLayer) {
            this._customOverLayer = new Sprite();
            this._customOverLayer.bitmap = ImageManager.loadParallax($dataMap.meta.OverLayer);
            this._customOverLayer.z = 20;         // 確保層級高於人物
            this._customOverLayer.blendMode = 1;  // 1 為「加法」，亮部會發光
            this._baseSprite.addChild(this._customOverLayer);
        }
    };

    const _Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _Spriteset_Map_update.call(this);
        if (this._customOverLayer) {
            // 同步地圖捲動座標
            this._customOverLayer.x = -$gameMap.displayX() * $gameMap.tileWidth();
            this._customOverLayer.y = -$gameMap.displayY() * $gameMap.tileHeight();
        }
    };
})();