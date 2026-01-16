/*:
 * @target MZ
 * @plugindesc [V1.1] 區域碰撞控制 (1號擋路，2號通過)
 * @author Gemini
 * @help 
 * 區域 ID 1 (紅色)：絕對無法通行 (牆壁/家具)
 * 區域 ID 2 (綠色)：可以通行 (地毯/標記)
 */

(() => {
    const _Game_Map_checkPassage = Game_Map.prototype.checkPassage;
    Game_Map.prototype.checkPassage = function(x, y, bit) {
        const regionId = this.regionId(x, y);
        
        // 如果是 1 號區域，強制不能通過
        if (regionId === 1) return false; 
        
        // 如果是 2 號區域，強制可以通過
        if (regionId === 2) return true;  
        
        // 其他區域或是沒塗顏色，依照原本圖塊設定
        return _Game_Map_checkPassage.apply(this, arguments);
    };
})();