let spriteManager = {
    image: new Image(),
    sprites: [],
    imgLoaded: false,
    jsonLoaded: false,

    loadAtlas: function (atlasJson, atlasImg) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
                spriteManager.parseAtlas(request.responseText);
            }
        };
        request.open("GET", atlasJson, true);
        request.send();
        this.loadImg(atlasImg);
    },
    loadImg: function (imgName) {
        this.image.onload = function () {
            spriteManager.imgLoaded = true;
        };
        this.image.src = imgName;
    },
    parseAtlas: function (atlasJSON) {
        let atlas = JSON.parse(atlasJSON);
        for (let i in atlas) {
            let frame = atlas[i];
            this.sprites.push({
                name: frame.name, x: frame.x, y: frame.y, w: frame.w, h:
                frame.h
            });
        }
        this.jsonLoaded = true;
    },
    drawSprite: function (ctx, name, x, y, rotation = 0) {
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(function () {
                spriteManager.drawSprite(ctx, name, x, y);
            }, 100);
        } else {
            let sprite = this.getSprite(name);
            if (!mapManager.isVisible(x, y, sprite.w, sprite.h))
                return;
            x -= mapManager.view.x;
            y -= mapManager.view.y;
            if (rotation !== 0) {
                ctx.save();
                ctx.translate(x + sprite.w / 2, y + sprite.h / 2);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, -sprite.w / 2,
                    -sprite.h / 2, sprite.w, sprite.h);
                ctx.restore();
            } else {
                ctx.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, x,
                    y, sprite.w, sprite.h);
            }
        }
    },
    drawEndGame: function (ctx) {
        let image = new Image();
        image.onload = function () {
            ctx.drawImage(image, 0, 0, 800, 800);
        };
        image.src = "..\/tiles\/win.png";
    },
    drawLoseGame: function () {
        let image = new Image();
        image.onload = function () {
            ctx.drawImage(image, 0, 0, 800, 800);
        };
        image.src = "..\/tiles\/lose.png";
    },
    getSprite: function (name) {
        for (let i = 0; i < this.sprites.length; i++) {
            let s = this.sprites[i];
            if (s.name === name)
                return s;
        }
        return null;
    }
};