class PreloadScene extends Phaser.Scene{
    constructor(){
        super('PreloadScene');
    }

    preload(){
        // Pre-carregamento das Imagens
        this.load.image('background2', 'assets/background2.png');
        this.load.image('tronco-superior','assets/tronco-superior.png');
        this.load.image('tronco-inferior','assets/tronco-inferior.png');
        this.load.image('pause','assets/pause.png');
        this.load.image('back', 'assets/back.png');
        this.load.image('banana', 'assets/banana.png');
        this.load.image('grupo-banana', 'assets/grupo-banana.png');
        this.load.image('banana', 'assets/grounds.png');
        this.load.image('bg_1', 'assets/bg-1.png');
        this.load.image('bg_2', 'assets/bg-2.png');
        this.load.image('playButton', 'assets/play_button.png'); 
        this.load.image('background', 'assets/background.png'); 
        this.load.image('colocarBanana', 'assets/colocarBanana.png'); 
        this.load.image('colocarBanana3', 'assets/colocarBanana3.png'); 
        this.load.image('3banana', 'assets/3banana.png'); 
        this.load.image('retirarBanana', 'assets/retirarBanana.png'); 
        this.load.image('wood_fundo','assets/wood_plank.png');
        this.load.image('banana', 'assets/banana.png');
        this.load.image('basket', 'assets/basket.png');
        this.load.image('confirmButton', 'assets/confirmButton.png');
        this.load.image('wood_border','assets/wood_border.png');
        this.load.image('wood_smallborder','assets/wood_plank_smallborder.png');
        this.load.image('pedido','assets/pedido.png'); // Não carregado
        this.load.image('banana_chest','assets/banana_chest.png');
        this.load.image('banana_vendida','assets/banana_vendida.png');
        this.load.image('relogio','assets/clock.png');
        this.load.image('money','assets/money.png');
        this.load.image('prato','assets/prato.png');
        this.load.image('pause', 'assets/pause.png');
        this.load.image('resumeButton', 'assets/resumeButton.png');
        this.load.image('startButton', 'assets/startButton.png');
        this.load.image('menuButton', 'assets/menuButton.png');
        this.load.image('popupBackground', 'assets/popupBackground.png');
        this.load.image('maisbanana', 'assets/maisbanana_background.png');
        this.load.image('maisbananaButton', 'assets/maisbananaButton.png')
        this.load.image('errorbanana', 'assets/errorBanana.png')
        this.load.image('comprarbanana1', 'assets/compra1_banana.png')
        this.load.image('comprarbanana2', 'assets/compra2_banana.png')
        this.load.image('renda', 'assets/renda.png');
        this.load.image('bananacomprada', 'assets/banana_comprada.png');
        this.load.image('pause_wood', 'assets/pause_wood.png');
        this.load.image('restartButton', 'assets/restart.png');
        this.load.image('scoretittle', 'assets/score_tittle.png');
        this.load.image('score_points', 'assets/score_points.png');

        //Sons e Musicas
        this.load.audio('hora_da_venda', 'assets/sounds/hora_da_venda.mp3');
        this.load.audio('press_button', 'assets/sounds/press_button.mp3');
        this.load.audio('menu_button', 'assets/sounds/menu_button.mp3');
        this.load.audio('start_button_sound', 'assets/sounds/start_button.mp3');
        this.load.audio('menu_scene', 'assets/sounds/menu_scene.mp3');
        this.load.audio('cash', 'assets/sounds/cash.mp3');
        this.load.audio('macaco_okay', 'assets/sounds/macaco_ok.mp3');
        this.load.audio('banana_compra', 'assets/sounds/collectSound.mp3');
        this.load.audio('error', 'assets/sounds/error.mp3');
        this.load.audio('musica_final', 'assets/sounds/final.mp3');

        // Sprite
        this.load.spritesheet('monkey', 'assets/monkey_sprite.png', {
            frameWidth: 64, // Largura de cada frame
            frameHeight: 65 // Altura de cada frame
        });
        this.load.spritesheet('bird', 'assets/birdSprite.png', {
            frameWidth: 16, 
            frameHeight: 16
        });

    }

    create(){   
        //Primeira Cena a ser Iniciada
        this.scene.start('MenuScene');
        // this.scene.start('MinigameScene');

    }

}


export default PreloadScene;