var playState = {
    
    create: function () {
        
        // Add player
        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.setTo(0.5, 0.5);
        this.player.animations.add('right', [1, 2], 8, true);
        this.player.animations.add('left', [3, 4], 8, true);
        
        game.physics.arcade.enable(this.player);
        
        // Add vertical gravity
        this.player.body.gravity.y = 500;
        
        // Add cursor
        this.cursor = game.input.keyboard.createCursorKeys();
        //game.input.keyboard.addKeyCapture([Phaser.Keyboard.UP, Phaser.Keyboard.DOWN,
        //                                   Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT]);
        
        // Add WASD 
        this.wasd = {
            up: game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: game.input.keyboard.addKey(Phaser.Keyboard.A),
            right: game.input.keyboard.addKey(Phaser.Keyboard.D)
        }
        
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
        
        //game.time.events.loop(2200, this.addEnemy, this);
        this.nextEnemy = 0;
        
        // Add sounds
        this.jumpSound = game.add.audio('jump');
        this.coinSound = game.add.audio('coin');
        this.deadSound = game.add.audio('dead');
        
        // Add particles
        this.emitter = game.add.emitter(0, 0, 15);
        this.emitter.makeParticles('pixel');
        this.emitter.setYSpeed(-150, 150);
        this.emitter.setXSpeed(-150, 150);
        this.emitter.gravity = 0;
    },
    
    update: function () {
        // Player and walls should collide
        game.physics.arcade.collide(this.player, this.layer);
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        game.physics.arcade.collide(this.enemies, this.layer);
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
        
        this.movePlayer();
        
        if (!this.player.inWorld) {
            this.playerDie();
        }
        
        if (this.nextEnemy < game.time.now) {
            var start = 4000,
                end = 1000,
                score = 100;
            var delay = Math.max(start - (start - end) * game.global.score / score, end);
            this.addEnemy();
            this.nextEnemy = game.time.now + delay;
        }
    },
    
    movePlayer: function () {
        if (this.cursor.left.isDown || this.wasd.left.isDown) {
            // Move player to the left
            this.player.body.velocity.x = -200;
            this.player.animations.play('left');
        } else if (this.cursor.right.isDown || this.wasd.right.isDown) {
            // Move player to the right
            this.player.body.velocity.x = 200;
            this.player.animations.play('right');
        } else {
            this.player.body.velocity.x = 0;
            this.player.animations.stop();
            this.player.frame = 0; // Show first frame
        }
        
        if ((this.cursor.up.isDown || this.wasd.up.isDown) 
            && this.player.body.onFloor()) {
            // Jump
            this.player.body.velocity.y = -320;
            this.jumpSound.play();
        }
    },
    
    createWorld: function () {    
        this.map = game.add.tilemap('map');
        this.map.addTilesetImage('tileset');
        this.layer = this.map.createLayer('Tile Layer 1');
        this.layer.resizeWorld();
        this.map.setCollision(1);
    },
    
    playerDie: function () {
        if (!this.player.alive) {
            return;
        }
        this.player.kill();
        this.deadSound.play();
        
        this.emitter.x = this.player.x;
        this.emitter.y = this.player.y;
        this.emitter.start(true, 600, null, 15);
        
        game.time.events.add(1000, this.startMenu, this);
    },
    
    takeCoin: function (player, coin) {
        this.coin.scale.setTo(0, 0);
        game.add.tween(this.coin.scale).to({x: 1, y: 1}, 300).start();
        game.add.tween(this.player.scale).to({x: 1.3, y: 1.3}, 50).to({x: 1, y: 1}, 150).start();
        game.global.score += 5;
        this.scoreLabel.text = 'score: ' + game.global.score;
        this.updateCoinPosition();
        this.coinSound.play();
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
    },
    
    startMenu: function () {
        game.state.start('menu');
    }
};