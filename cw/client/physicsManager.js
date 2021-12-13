let physicManager = {
    update: function (obj) {
        if (obj.move_x === 0 && obj.move_y === 0)
            return "stop";
        let newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        let newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);
        let ts;
        if (mapManager.getTilesetIdx(newX, newY) !== 2) {
            ts = mapManager.getTilesetIdx(newX, newY)
        } else if (mapManager.getTilesetIdx(newX + obj.size_x, newY) !== 2) {
            ts = mapManager.getTilesetIdx(newX + obj.size_x, newY)
        } else if (mapManager.getTilesetIdx(newX + obj.size_x, newY + obj.size_y) !== 2) {
            ts = mapManager.getTilesetIdx(newX + obj.size_x, newY + obj.size_y)
        } else if (mapManager.getTilesetIdx(newX, newY + obj.size_y) !== 2) {
            ts = mapManager.getTilesetIdx(newX, newY + obj.size_y)
        } else {
            ts = 2
        }
        let e = this.entityAtXY(obj, newX, newY);
        if (e !== null && obj.onTouchEntity)
            obj.onTouchEntity(e);
        if ((ts === 7 || ts === 6 || ts === 2 || (ts === 1 && obj.type !== "player"))) {
            obj.pos_x = newX;
            obj.pos_y = newY;
        } else
            return "break";
        return "move";
    },
    entityAtXY: function (obj, x, y) {
        for (let i = 0; i < gameManager.entities.length; i++) {
            let e = gameManager.entities[i];
            if (e.name !== obj.name) {
                if (x + obj.size_x < e.pos_x ||
                    y + obj.size_y < e.pos_y ||
                    x > e.pos_x + e.size_x ||
                    y > e.pos_y + e.size_y)
                    continue;
                return e;
            }
        }
        return null;
    },

};