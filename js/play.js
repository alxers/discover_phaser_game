var playState = {
    
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
        
        // Add coin
        this.coin = game.add.sprite(60, 140, 'coin');
        game.physics.arcade.enable(this.coin);
        this.coin.anchor.setTo(0.5, 0.5);
        
        // Add text
        this.scoreLabel = game.add.text(30, 30, 'score: 0',
                                        { font: '14px Arial', fill: '#ffffff' });
        game.global.score = 0;
        
        // Add enemies
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');
        
        game.time.events.loop(2200, this.addEnemy, this);
        
        
    },
    
    update: function () {
        // Player and walls should collide
        game.physics.arcade.collide(this.player, this.walls);
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        game.physics.arcade.collide(this.enemies, this.walls);
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
        
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
        game.state.start('menu');
    },
    
    takeCoin: function (player, coin) {
        game.global.score += 5;
        this.scoreLabel.text = 'score: ' + game.global.score;
        this.updateCoinPosition();
    },
    
    updateCoinPosition: function () {
        var coinPosition = [
            {x: 140, y: 60}, {x: 360, y:60}, // Top row
            {x: 60, y: 140}, {x: 440, y:140}, // Middle row
            {x: 130, y: 300}, {x: 370, y:300}, // Bottom row
        ];
            
        var newPosition = coinPosition[game.rnd.integerInRange(0, coinPosition.length-1)];
        
        this.coin.reset(newPosition.x, newPosition.y);
    },
    
    addEnemy: function () {
        var enemy = this.enemies.getFirstDead();
        
        if (!enemy) {
            return;
        }
        
        enemy.anchor.setTo(0.5, 1);
        enemy.reset(game.world.centerX, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    }
};