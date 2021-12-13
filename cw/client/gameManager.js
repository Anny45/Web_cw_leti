let gameManager = {
    factory: {}, //фабрика объектов
    entities: [],
    player: null,
    laterKill: [],
    interval: null,
    level: 1,
    score: 0,
    name: "",
    isWin: false,

    updateView: function(){ // текущий рекорд и уровень обновление
        let scoreInput = document.getElementById('score')
        scoreInput.innerHTML = "Очки: " + gameManager.score
        let level1 = document.getElementById('level')
        level1.innerHTML = "Уровень: " + gameManager.level

    },

    initPlayer: function(obj) {
        this.player = obj;
    },
    kill: function(obj) {
        this.laterKill.push(obj);
    },
    update: function() { let i;
//все обновляет из методы
        try{
            if (this.player === null)
                return;
        } catch (e){
            return;
        }

        this.player.move_x = 0;
        this.player.move_y = 0;
        if (eventsManager.action["up"]) {
            this.player.move_y = -1;
            this.player.rotation = 0
        }
        if (eventsManager.action["down"]) {
            this.player.move_y = 1;
            this.player.rotation = 180
        }
        if (eventsManager.action["left"]) {
            this.player.move_x = -1;
            this.player.rotation = -90
        }
        if (eventsManager.action["right"]) {
            this.player.move_x = 1;
            this.player.rotation = 90
        }
        for (let i in this.entities){
            try {
                this.entities[i].update();
            } catch (ex) {
                console.log('bad entity update', ex)
            }
        }
        let coinFlag = false
        for (i = 0; i < this.laterKill.length; i++) {
            let idx = this.entities.indexOf(this.laterKill[i]);
            if (idx > -1)
                this.entities.splice(idx, 1);
            if (this.laterKill[i].name === "player1") {
                coinFlag = true
                gameManager.stopGame();
            }
        }
        if (this.laterKill.length > 0)
            this.laterKill.length = 0;

        for (i of this.entities){
            if (i.type === "coin"){
                coinFlag = true
            }
        }
        if (!coinFlag) {
            if (this.level === 1) {
                this.twoLevel()
            } else {
                this.isWin = true
                this.stopGame()
            }
        }
        try{
            mapManager.centerAt(this.player.pos_x, this.player.pos_y);
        } catch (e){}
        mapManager.draw(ctx);
        this.draw(ctx);
    },

    draw: function(ctx) {

        for(let e = 0; e < this.entities.length; e++){
            this.entities[e].draw(ctx);
        }

    },
     loadAll: function() { //загрузка
        this.laterKill.length = 0;
        this.entities.length = 0;
        this.player = null;
         if (gameManager.interval) {
             clearInterval(gameManager.interval);
             gameManager.interval = null;
         }
         console.log('level', gameManager.level)
         if (gameManager.level === 1){
             mapManager.loadMap("gameMap.json");
         } else{
             mapManager.loadMap("gameMap1.json");
         }
         spriteManager.loadAtlas("objects.json", "objects.png");
         gameManager.factory['player'] = Player;
         gameManager.factory['enemy'] = Enemy;
         gameManager.factory['coin'] = Coin;
         mapManager.parseEntities();
         mapManager.draw(ctx);
         eventsManager.setup(canvas);

    },
    play: function() {
        gameManager.interval =  setInterval(updateWorld, 50);

    },
    stopGame: function () {
        gameManager.updateView()
        gameManager.loadAll(ctx);
        saveScore()
        if (this.isWin){
            setTimeout(()=>spriteManager.drawEndGame(ctx), 500)
            setInterval(()=>{window.location="records.html"},3000)
        }
        else{
            setTimeout(()=>spriteManager.drawLoseGame(ctx), 500)
            setInterval(()=>{window.location="records.html"},3000)
        }
    },
    twoLevel: function() {

        let score = gameManager.score;
        gameManager.level = 2;
        gameManager.factory = {};
        gameManager.entities = [];
        gameManager.player = null;
        gameManager.laterKill = [];
        if (gameManager.interval) {
            clearInterval(gameManager.interval);
            gameManager.interval = null;
        }
        gameManager.interval = null
        gameManager.loadAll(ctx);
        gameManager.play(ctx);
        gameManager.score = score;
        gameManager.updateView();
    }

};
function updateWorld() {
    gameManager.update();
}