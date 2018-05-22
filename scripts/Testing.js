let testingState = new Phaser.Class({
    // Define scene
    Extends: Phaser.Scene,
    initialize: function Testing() {
        Phaser.Scene.call(this, {key: 'Testing'});
    },

    setupMusic: function() {
        audioManager.bgm = this.sound.add("bgm1");
        audioManager.bgm.play({
            // TODO config music
        });
    },

    setupScene: function() {
        // Create world terrain
        map = this.make.tilemap({key: "map"});
        this.groundTiles = map.addTilesetImage("tiles");
        this.groundLayer = map.createDynamicLayer("Ground", this.groundTiles, 0, 0);
        this.groundLayer.setCollisionByExclusion([-1]);
        this.platformLayer = map.createDynamicLayer("Platforms", this.groundTiles, 0, 0);
        this.platformLayer.setCollisionByExclusion([-1]);

        // Create enemies
        this.enemies = this.physics.add.group();
        this.enemies.runChildUpdate = true;
        this.ghosts = this.add.group(map.createFromObjects("EnemySpawns", "Ghost", {
            key: "characters", frame: "ghost/walk0"}, this));
        this.aliens = this.add.group(map.createFromObjects("EnemySpawns", "Alien", {
            key: "characters", frame: "invert-alien/walk0"}, this));
        this.slimes = this.add.group(map.createFromObjects("EnemySpawns", "Slime", {
            key: "characters", frame: "slime/walk0"}, this));

        this.enemies.addMultiple(this.ghosts);
        this.enemies.addMultiple(this.aliens);
        this.enemies.addMultiple(this.slimes);

        this.physics.add.collider(this.enemies, this.groundLayer);

        // Create players
        this.players = this.physics.add.group();
        this.players.runChildUpdate = true;
        for (let i = 0; i < playerCount; i++) {
            p[i] = new Player(this, "p" + i, pConfig[i]);
            this.players.add(p[i], true);
            p[i].setup();
            p[i]["platformCollision"] = this.physics.add.collider(p[i], this.platformLayer, null, null, this);
            console.log(p[i]["platformCollision"]);
        }
        this.physics.add.collider(this.players, this.groundLayer, null, null, this);

        this.platformLayer.forEachTile(function(tile){
            tile.collideDown = false;
        });

        // Set world boundaries
        this.physics.world.bounds.width = this.groundLayer.width;
        this.physics.world.bounds.height = this.groundLayer.height;

        /*let pads = this.input.gamepads.getAll();
        console.log("connected pads:",pads);*/
    },

    create: function() {
        this.setupMusic();
        this.setupScene();
    },

    move: function(player, time, delta) {
        // Player 1 player.controls
        // Handle left and right movement of character
        // TODO sounds
        if (player.left.isDown) {
            player.body.setVelocityX(-player.moveSpeed); // move left
            player.anims.play(player.name + "walk", true);
            player.flipX = true;
        }
        else if (player.right.isDown) {
            player.body.setVelocityX(player.moveSpeed); // move right
            player.anims.play(player.name + "walk", true);
            player.flipX = false;
        }
        else {
            player.body.setVelocityX(0); // stop moving
            player.anims.play(player.name + "idle", true);
        }

        if (player.down.isDown) {
            player.platformCollision.overlapOnly = true;
        } else {
            // TODO wait for player to fall down
            player.platformCollision.overlapOnly = false;
        }
    },

    shoot: function(player, time, delta) {
        if (Phaser.Input.Keyboard.JustDown(player.shoot) && player.cooldown <= 0) {
            if (player.active === false) return;

            let bullet = player.weapon.get().setActive(true).setVisible(true);
            this.children.bringToTop(player.weapon);

            if(bullet) {
                bullet.fire(player, 3000);
                player.cooldown = player.fireRate * myGame.frameRate;
            }
        }
        if (player.cooldown > 0) player.cooldown --;
    },

    jump: function(player, time, delta) {
        if ((player.jump.isDown || player.up.isDown) && player.body.onFloor())
        {
            player.body.setVelocityY(-player.minJumpPower); // jump up
            player.jumpTime = player.maxJumpTime;
        }
        else if ((player.jump.isDown || player.up.isDown) && player.jumpTime > 0) {
            player.body.setVelocityY((player.body.velocity.y
                - (((player.maxJumpPower - player.minJumpPower) / player.maxJumpTime)
                    * player.jumpTime / player.maxJumpTime)));
            player.jumpTime --;
        }
        else {
            player.jumpTime = 0;
        }

    },

    update: function(time, delta) {
        for (let i = 0; i < p.length; i++) {
            this.move(p[i], time, delta);
            this.jump(p[i], time, delta);
            this.shoot(p[i], time, delta);
            this.physics.world.wrap(p[i]);
        }
    }
});

// Add scene to list of scenes
myGame.scenes.push(testingState);