let eventsManager = {
    bind: [],
    action: [],
    setup: function () {
        this.bind[87] = 'up'; // w
        this.bind[65] = 'left'; // a
        this.bind[83] = 'down'; // s
        this.bind[68] = 'right'; // d

        document.body.addEventListener("keydown", this.onKeyDown); //нажатие на кнопку
        document.body.addEventListener("keyup", this.onKeyUp);
    },
    onKeyDown: function (event) {
        let action = eventsManager.bind[event.keyCode];
        if (action)
            eventsManager.action[action] = true;
    },
    onKeyUp: function (event) {
        let action = eventsManager.bind[event.keyCode];
        if (action)
            eventsManager.action[action] = false;
    }
};