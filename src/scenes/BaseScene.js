class BaseScene extends Phaser.Scene {
  constructor(key, config) {
      super(key);
      this.config = config;
      this.screenCenter = [
          (config.width || this.scale.width) / 2,
          (config.height || this.scale.height) / 2,
      ];
      this.fontSize = 34;
      this.lineHeight = 42;
      this.fontOptions = { fontSize: `${this.fontSize}px`, fontFamily: 'MinhaFonte', fill: '#fff' };
  }

  preload() {
  }

  sayHello() {
      alert('Ver 1.00');
  }

  create() {
      // Fundo
      this.add.image(0, 0, 'background2').setOrigin(0);

      // Botão de Retorno
      if (this.config.canGoBack) {
          const backButton = this.add.image(this.config.width - 10, this.config.height - 10, 'back')
              .setOrigin(1)
              .setScale(3)
              .setInteractive();

          // Adiciona efeito hover
          backButton.on('pointerover', () => {
              this.tweens.add({
                  targets: backButton,
                  scale: 3.3, // Aumenta a escala ao passar o mouse
                  duration: 300,
                  ease: 'Sine.easeInOut',
              });
          });

          backButton.on('pointerout', () => {
              this.tweens.add({
                  targets: backButton,
                  scale: 3, // Volta ao tamanho original
                  duration: 300,
                  ease: 'Sine.easeInOut',
              });
          });

          backButton.on('pointerup', () => {
              this.scene.start('MenuScene');
          });
      }
  }

  createMenu(menu, setupMenuEvents) {
      let lastMenuPositionY = 0;

      menu.forEach(menuItem => {
          const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPositionY];
          menuItem.textGO = this.add.text(...menuPosition, menuItem.text, this.fontOptions).setOrigin(0.5, 1);
          lastMenuPositionY += this.lineHeight;
          setupMenuEvents(menuItem);
      });
  }
}

export default BaseScene;
