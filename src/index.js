import MenuScene from './scenes/MenuScene.js';
import MinigameScene from "./scenes/MinigameScene.js";
import PreloadScene from './scenes/PreloadScene.js';
import ScoreScene from './scenes/ScoreScene.js';
import PauseScene from './scenes/PauseScene.js';
import PlayScene from './scenes/PlayScene.js';


// Valores Globais para Todas as "Cenas"

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = {x: WIDTH * 0.1, y: HEIGHT / 2};

const SHARED_CONFIG = {
    width: WIDTH,
    height: HEIGHT,
    startPosition: BIRD_POSITION

}

const Scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, MinigameScene, PauseScene];
const creatScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = () => Scenes.map(creatScene);


var config = {

    // WebGl (Web Graphics Library) JS Api para renderizar graficos 2D e 3D
    type: Phaser.AUTO,
    ...SHARED_CONFIG,
    pixelArt: true,
    physics:{
        // Arcade physics plugin, é um plugin que gerencia uma fisica no jogo;
        default: 'arcade',
        arcade:{
            // gravity: {y:400},
            // gravity {y:200}
            // debug:true,
        }
    },
    scene: initScenes()
    
};

const game = new Phaser.Game(config);