import BaseScene from "./BaseScene.js";

class MenuScene extends BaseScene {
    constructor(config) {
        super('MenuScene', config);
        this.menu = [
            { scene: 'PlayScene', text: 'Play', buttonKey: 'play_button' },  // A chave da imagem do botão
            { scene: 'ScoreScene', text: 'Score', buttonKey: 'score_button' },
            { scene: 'MinigameScene', text: 'Vendas', buttonKey: 'vendas_button' },
            // { scene: null, text: 'Exit', buttonKey: 'exit_button' }, <----Adcionar Manual
        ];
    }

    preload() {
        // Carregar as imagens dos botões e a música
        this.load.image('play_button', 'assets/play_menuButton.png');
        this.load.image('score_button', 'assets/score_button.png');
        this.load.image('vendas_button', 'assets/vendas_button.png');
        this.load.image('exit_button', 'assets/exit_button.png');
        this.load.image('wood_menu', 'assets/wood_menu.png');
        this.load.image('titulo', 'assets/wood_tittle.png');
        this.load.audio('menu_scene', 'assets/menu_scene.mp3');
        this.load.audio('menu_button', 'assets/menu_button.mp3'); // Som do botão
    }

    create() {
        super.create();

        // Fundo de Menu
        this.add.image(400, 100, 'titulo').setDepth(1).setScale(3);
        this.add.image(120, 300, 'wood_menu').setDepth(1).setScale(3);
        this.add.image(120, 400, 'wood_menu').setDepth(1).setScale(3);
        this.add.image(120, 500, 'wood_menu').setDepth(1).setScale(3);
        // this.add.image(400, 480, 'wood_fundo').setDepth(1).setScale(2);

        // Transição inicial (tela preta clareando em 2 segundos)
        const blackScreen = this.add.rectangle(400, 300, 800, 600, 0x000000)
            .setDepth(5)
            .setAlpha(1); // Começa opaco

        this.tweens.add({
            targets: blackScreen,
            alpha: 0, // Clareia gradualmente
            duration: 2000, // 2 segundos
            onComplete: () => {
                blackScreen.destroy(); // Remove a tela preta após o fade
            }
        });

        // Adiciona música de fundo com fade-in
        this.menuMusic = this.sound.add('menu_scene', { loop: true });
        this.menuMusic.play();
        this.tweens.add({
            targets: this.menuMusic,
            volume: { from: 0, to: 1 }, // Aumenta o volume gradualmente
            duration: 1500 // 1,5 segundos
        });

        // Som do botão
        this.buttonSound = this.sound.add('menu_button');

        // Criar o menu
        this.createMenu(this.menu, this.setupMenuEvents.bind(this));
    }

    createMenu(menuItems, setupMenuEvents) {
        const startX = 120; // Posição inicial do botão no eixo X
        const startY = 300; // Posição inicial do botão no eixo Y
        const buttonSpacing = 100; // Distância entre os botões

        // Iterando sobre os itens do menu e criando os botões
        menuItems.forEach((item, index) => {
            // Carregar o botão usando a chave de imagem (key)
            const button = this.add.image(startX, startY + (index * buttonSpacing), item.buttonKey)
                .setInteractive()
                .setDepth(2).setScale(5);

            item.textGO = button; // Armazenando o botão para eventos posteriores
            setupMenuEvents(item); // Configurando os eventos de interação
        });
    }

    setupMenuEvents(menuItem) {
        const button = menuItem.textGO;

        // Hover
        button.on('pointerover', () => {
            button.setScale(5.5); // Aumenta o tamanho do botão no hover
        });
        button.on('pointerout', () => {
            button.setScale(5); // Restaura o tamanho original do botão
        });

        // Clique
        button.on('pointerup', () => {
            this.buttonSound.play(); // Toca o som do botão

            // Brilho do botão por 1 segundo
            this.tweens.add({
                targets: button,
                scale: 3.5, // Aumenta o tamanho para simular brilho
                alpha: { from: 1, to: 1.5 }, // Aumenta o brilho (opacidade)
                yoyo: true,
                duration: 1000, // 1 segundo
            });

            // Fade out da música em 1,5 segundos
            this.tweens.add({
                targets: this.menuMusic,
                volume: { from: 1, to: 0 }, // Reduz gradualmente o volume
                duration: 1500, // 1,5 segundos
                onComplete: () => {
                    this.menuMusic.stop(); // Para a música após o fade
                }
            });

            // Transição de escurecimento
            const blackScreen = this.add.rectangle(400, 300, 800, 600, 0x000000)
                .setDepth(5)
                .setAlpha(0); // Começa transparente

            this.tweens.add({
                targets: blackScreen,
                alpha: 1, // Escurece gradualmente
                duration: 1500, // 1,5 segundos
                onComplete: () => {
                    // Transição para a cena correspondente
                    if (menuItem.scene) {
                        this.scene.start(menuItem.scene); // Muda para a cena correspondente
                    } else if (menuItem.text === 'Exit') {
                        this.game.destroy(true); // Sai do jogo
                    }
                }
            });
        });
    }
}

export default MenuScene;
