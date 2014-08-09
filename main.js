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
        
        // Create world
        this.createWorld();
    },
    
    update: function () {
        // Player and walls should collide
        game.physics.arcade.collide(this.player, this.walls);
        
        this.movePlayer();
        if (!this.player.inWorld) {
            this.playerDie();
        }
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
    },
    
    createWorld: function () {
        // Add walls
        this.walls = game.add.group();
        this.walls.enableBody = true;
        
        game.add.sprite(0, 0, 'wallV', 0, this.walls); // Left
        game.add.sprite(480, 0, 'wallV', 0, this.walls); // Right
        game.add.sprite(0, 0, 'wallH', 0, this.walls); // Top left
        game.add.sprite(0, 320, 'wallH', 0, this.walls); // Top right
        game.add.sprite(0, 3200, 'wallH', 0, this.walls); // Bottom left
        game.add.sprite(300, 320, 'wallH', 0, this.walls); // Bottom right
        game.add.sprite(-100, 160, 'wallH', 0, this.walls); // Middle left
        game.add.sprite(400, 160, 'wallH', 0, this.walls); // Middle right
        
        var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
        middleBottom.scale.setTo(1.5, 1);
        
        this.walls.setAll('body.immovable', true);
    },
    
    playerDie: function () {
        game.state.start('main');
    }
};

var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');

game.state.add('main', mainState);
game.state.start('main');
