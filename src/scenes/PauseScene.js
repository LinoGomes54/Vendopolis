import BaseScene from './BaseScene.js';

class PauseScene extends BaseScene {

  constructor(config) {
    super('PauseScene', config);

    this.menu = [
      {scene: 'MinigameScene', text: 'Continue', buttonImage: 'resumeButton'}, 
      {scene: 'MenuScene', text: 'Exit', buttonImage: 'exit_button'}, 
    ];
  }

  preload() {
    this.load.audio('menu_button', 'assets/sounds/menu_button.mp3'); 
    this.load.audio('musica_final', 'assets/sounds/musica_final.mp3'); 
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
    this.add.image(400, 300, 'popupBackground').setScale(2, 3);

    // Adiciona o áudio da música final
    this.finalMusic = this.sound.add('musica_final', { loop: true, volume: 0.5 });
  }

  createMenu(menu, setupEvents) {
    this.menuItems = [];
    menu.forEach((menuItem, index) => {
      const button = this.add.sprite(400, 265 + (index * 60), menuItem.buttonImage); 
      button.setOrigin(0.5);
      button.setInteractive();
      button.setScale(3); 
      button.setDepth(2);

      menuItem.buttonGO = button;  
      this.menuItems.push(menuItem);

      setupEvents(menuItem);
    });
  }

  setupMenuEvents(menuItem) {
    const buttonGO = menuItem.buttonGO;

    const menuButtonSound = this.sound.add('menu_button', { volume: 0.4 }); 

    buttonGO.on('pointerover', () => {
      buttonGO.setTint(0xffff00); 
      buttonGO.setScale(3.5); 
    });

    buttonGO.on('pointerout', () => {
      buttonGO.clearTint();  
      buttonGO.setScale(3); 
    });

    buttonGO.on('pointerup', () => {
      menuButtonSound.play(); 

      if (menuItem.scene && menuItem.text === 'Continue') {
        this.scene.stop();
        this.scene.resume(menuItem.scene);
      } else {
        this.finalMusic.stop(); 
        this.scene.stop('MinigameScene');
        this.scene.start(menuItem.scene);
      }
    });
  }
}

export default PauseScene;
