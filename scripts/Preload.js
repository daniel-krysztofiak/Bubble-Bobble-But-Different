var preloadState = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:
    function Preload(){
        Phaser.Scene.call(this, {key: 'Preload'});
    },
    loadPlugins: function () {
        this.load.plugin("AnimatedTiles", "plugins/AnimatedTiles.min.js");
    },
    loadAssets: function() {
        this.load.atlas("characters", "characters.png", "characters.json");
        this.load.tilemapTiledJSON("map", "map.json");
        this.load.spritesheet("tiles", "tiles0.png", {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet("bg", "tiles0bg.png", {frameWidth: 32, frameHeight: 32});
    },
    loadAudio: function() {
        this.load.audio("bgm1", [
            "audio/music/bgm1.mp3"
        ]);
        this.load.audio("bgm2", [
            "audio/music/bgm2.mp3"
        ]);
        this.load.audio("bgm3", [
            "audio/music/bgm3.mp3"
        ]);
        this.load.audio("menu1", [
            "audio/music/menu1.mp3"
        ]);
        this.load.audio("menu2", [
            "audio/music/menu2.mp3"
        ]);
        this.load.audio("loose1", [
            "audio/music/loose1.mp3"
        ]);
        this.load.audio("win1", [
            "audio/music/win1.mp3"
        ]);
    },
    preload: function() {
        this.load.baseURL = "./assets/";

        this.loadPlugins();
        this.loadAssets();
        this.loadAudio();
    },


    create: function() {
        console.log("Preload");

        game.scene.start('GamePlay');
    },
    update: function() {
        // Update objects & variables
    }
});

// Add scene to list of scenes
myGame.scenes.push(preloadState);