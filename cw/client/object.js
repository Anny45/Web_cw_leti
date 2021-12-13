let Entity = {
    pos_x: 0, pos_y: 0,
    size_x: 0, size_y: 0,
    extend: function (extendProto) {
        let object = Object.create(this);
        for (let property in extendProto) {
            if (this.hasOwnProperty(property) || typeof object[property] ===
                'undefined') {
                object[property] = extendProto[property];
            }
        }
        return object;
    }
};

let Player = Entity.extend({
    rotation: 0,
    move_x: 0, move_y: 0,
    speed: 10,
    draw: function (ctx) {
        spriteManager.drawSprite(ctx, "player", this.pos_x, this.pos_y, this.rotation);
    },
    update: function () {
        physicManager.update(this);
    },
    onTouchEntity: function (obj) {
        if (obj.name.match(/coin[\d]/)) {
            gameManager.score += 1;
            gameManager.updateView();
            obj.kill();
        }
        if (obj.name.match(/enemy[\d]/)) {
            this.kill();
            soundManager.stopAll("indigo-946.mp3");
            soundManager.play("moo.mp3", { looping: false });
        }
    },
    kill: function () {
        gameManager.laterKill.push(this);
    },
});

let Enemy = Entity.extend({
    move_x: 0, move_y: 0,
    speed: 6, rotation: 0,
    draw: function (ctx) {
        spriteManager.drawSprite(ctx, "enemy", this.pos_x, this.pos_y, this.rotation);
    },
    update: function () {
        let player_x = gameManager.player.pos_x
        let player_y = gameManager.player.pos_y
        if (Math.abs(player_x - this.pos_x) > Math.abs(player_y - this.pos_y)) {
            if (player_x - this.pos_x > 0) {
                this.move_x = 1;
                this.move_y = 0;
            } else {
                this.move_x = -1;
                this.move_y = 0;
            }
        } else {
            if (player_y - this.pos_y > 0) {
                this.move_y = 1;
                this.move_x = 0;
            } else {
                this.move_y = -1;
                this.move_x = 0;
            }
        }
        physicManager.update(this);
    },
    onTouchEntity: function (obj) {
        if (obj.name.match(/player/)) {
            obj.kill();
            soundManager.stopAll("indigo-946.mp3");
            soundManager.play("moo.mp3", { looping: false });
        }
    },
    kill: function () {
        gameManager.laterKill.push(this);
    },
});

let Coin = Entity.extend({
    draw: function (ctx) {
        spriteManager.drawSprite(ctx, "coin", this.pos_x, this.pos_y);
    },
    update: function () {
    },
    kill: function () {
        gameManager.laterKill.push(this);
    },
});