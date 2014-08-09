var mainState = {
    preload: function () {
        game.stage.backgroundColor = '#3498db';
        //game.physics.startSystem(Phaser.Physics.ARCADE);
        game.load.image('player', 'assets/player.png');
        game.load.image('wallV', 'assets/wallVertical.png');
        game.load.image('wallH', 'assets/wallHorizontal.png');
    },
    
    create: function () {
        // Add player
        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        
        game.physics.arcade.enable(this.player);
        
        // Add vertical gravity
        this.player.body.gravity.y = 500;
        
        // Add cursor
        this.cursor = game.input.keyboard.createCursorKeys();
    },
    
    update: function () {
        this.movePlayer();
    },
    
    movePlayer: function () {
        if (this.cursor.left.isDown) {
            // Move player to the left
            this.player.body.velocity.x = -200;
        } else if (this.cursor.right.isDown) {
            // Move player to the right
            this.player.body.velocity.x = 200;
        } else {
            this.player.body.velocity.x = 0;
        }
        
        if (this.cursor.up.isDown && this.player.body.touching.down) {
            // Jump
            this.player.body.velocity.y = -320;
        }
    }
};

var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');

game.state.add('main', mainState);
game.state.start('main');
