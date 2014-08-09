var bootState = {
    
    preload: function () {
        game.load.image('progressBar', 'assets/progressBar.png');
    },
    
    create: function () {
        game.stage.backgroundColor = '#000000';
        game.state.start('load');
    }
};