import BaseScene from "./BaseScene.js";

const TRONCO_TO_RENDER = 4;

class MinigameScene extends BaseScene {
    constructor(config) {
        super('MinigameScene', config);

        this.bird = null;
        this.troncos = null;
        this.isPaused = false;

        this.troncoHorizontalDistance = 0;
        this.troncoVerticalDistanceRange = [160, 250];
        this.troncoHorizontalDistanceRange = [500, 550];
        this.flapVelocity = 300;

        this.parallaxSpeed1 = 0.3;
        this.parallaxSpeed2 = 0.6;

        this.score = 0;
        this.scoreText = '';

        this.currentDifficulty = 'easy';
        this.difficulties = {
            'easy': {
                troncoHorizontalDistanceRange: [420, 450],
                troncoVerticalDistanceRange: [200, 300],
            },
            'normal': {
                troncoHorizontalDistanceRange: [380, 400],
                troncoVerticalDistanceRange: [140, 190],
            },
            'hard': {
                troncoHorizontalDistanceRange: [350, 390],
                troncoVerticalDistanceRange: [120, 150],
            },
        };
    }

    create() {
        const storedBananas = localStorage.getItem('bananasBau');
        this.bananasBau = storedBananas ? parseInt(storedBananas, 10) : 0;

        this.bird = this.physics.add.sprite(100, this.config.height / 2, 'bird').setOrigin(0);
        this.troncos = this.physics.add.group();
        this.bananas = this.physics.add.group({
            defaultKey: 'banana',
            maxSize: 10,
        });

        // Som do botão de pause
        this.menuButtonSound = this.sound.add('menu_button', { volume: 0.3 });

        this.add.image(80,55,'wood_smallborder').setScale(2).setDepth(1);
        this.add.image(40,50,'score_points').setScale(1.5).setDepth(2);
        this.add.image(35,85,'score_points').setScale(1.5).setDepth(2);
        this.add.image(45,85,'score_points').setScale(1.5).setDepth(2);

        this.currentDifficulty = 'easy';
        this.parallaxSpeed1 = 0.3;
        this.parallaxSpeed2 = 0.6;
        this.createParallax();

        this.createBird();
        this.createTroncos();
        this.createCollider();
        this.createScore();
        this.createPause();
        this.controleInputs();

        this.listenToEvents();

        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', { start: 9, end: 15 }),
            frameRate: 8,
            repeat: -1,
        });
        this.bird.play('fly');
    }

    update() {
        this.checkGameStatus();
        this.reciclarTronco();
        this.animateParallax();
    }

    createPause() {
        this.isPaused = false;
    
        // Criação do botão Pause
        const pauseButton = this.add
            .image(this.config.width - 10, this.config.height - 10, 'pause')
            .setInteractive()
            .setScale(3)
            .setOrigin(1);
    
        // Adiciona efeito de hover ao botão Pause
        pauseButton.on('pointerover', () => {
            this.tweens.add({
                targets: pauseButton,
                scale: { from: 3, to: 3.3 }, // Aumenta o botão
                duration: 200,
                ease: 'Sine.easeInOut', // Transição suave
            });
        });
    
        pauseButton.on('pointerout', () => {
            this.tweens.add({
                targets: pauseButton,
                scale: { from: 3.3, to: 3 }, // Volta ao tamanho original
                duration: 200,
                ease: 'Sine.easeInOut',
            });
        });
    
        // Função ao clicar no botão Pause
        pauseButton.on('pointerdown', () => {
            this.isPaused = true;
            this.physics.pause(); // Pausa o jogo
            this.menuButtonSound.play(); // Toca o som do botão
            this.scene.pause(); // Pausa a cena atual
            this.scene.launch('PauseScene'); // Inicia a PauseScene
        });
    }
    

    listenToEvents() {
        if (this.pauseEvent) return;

        this.events.on('resume', () => {
            this.isPaused = false;
            this.physics.resume();
        });
    }

    animateParallax() {
        if (!this.isPaused && this.parallaxSpeed1 > 0 && this.parallaxSpeed2 > 0) {
            this.bg_1.tilePositionX += this.parallaxSpeed1;
            this.bg_2.tilePositionX += this.parallaxSpeed2;
        }
    }

    collectBanana(bird, banana) {
        banana.destroy(); // Remove a banana da tela
        
        // Incrementa o contador de bananas coletadas
        this.bananasBau = (this.bananasBau || 0) + 1;
        
        // Salva a quantidade de bananas no localStorage
        localStorage.setItem('bananasBau', this.bananasBau);
        
        console.log(`Bananas coletadas: ${this.bananasBau}`); // Exibe no console
        
        // Toca o som 'banana_compra' ao coletar uma banana
        this.sound.play('banana_compra', { volume: 0.3 });
        
        // Adiciona 10 ao score sempre que uma banana for coletada
        this.increaseScore(10);
    }
    

    createGround(){
         // create an tiled sprite with the size of our game screen
        this.bg_1 = this.add.tileSprite(0, 0, "bg_1");

        // Set its pivot to the top left corner
        this.bg_1.setOrigin(0, 0);

        // fixe it so it won't move when the camera moves.
        // Instead we are moving its texture on the update
        this.bg_1.setScrollFactor(0);

        // Add a second background layer. Repeat as in bg_1
        this.bg_2 = this.add.tileSprite(0, 0, "bg_2");
        this.bg_2.setOrigin(0, 0);
        this.bg_2.setScrollFactor(0);
    }


    createParallax() {
        // Cria camadas de fundo para o efeito parallax
        this.bg_1 = this.add.tileSprite(0, 0, this.config.width, this.config.height, "bg_1");
        this.bg_1.setOrigin(0, 0);
        this.bg_1.setScrollFactor(0);
        // this.bg_1.setDisplaySize(800,600);

        this.bg_2 = this.add.tileSprite(0, 0, this.config.width, this.config.height, "bg_2");
        this.bg_2.setOrigin(0, 0);
        this.bg_2.setScrollFactor(0);
    }


    listenToEvents() {
        if (this.pauseEvent) { return; }

        this.pauseEvent = this.events.on('resume', () => {
        this.initialTime = 3;
        this.countDownText = this.add.text(...this.screenCenter, 'Voando em: ' + this.initialTime, this.fontOptions).setOrigin(0.5);
        this.timedEvent = this.time.addEvent({
            delay: 1000,
            callback: this.countDown,
            callbackScope: this,
            loop: true
          })
        })
    }

    // Funções in Game
    createBG(){
        this.add.image(0, 0, 'flap-gameplay').setOrigin(0);
    }

    countDown(){
        this.initialTime--;
        this.countDownText.setText('Voando em: ' + this.initialTime);
        if (this.initialTime <= 0) {
        this.isPaused = false;
        this.countDownText.setText('');
        this.physics.resume();
        this.timedEvent.remove();
    }

    }

    // Edição do Passaro
    createBird(){
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setFlipX(true).setScale(4).setOrigin(0);
        this.bird.setBodySize(this.bird.width, this.bird.height - 8);
        this.bird.body.gravity.y = 600;
        this.bird.setCollideWorldBounds(true);
    }

    createTroncos(){

        // Grupo de Troncos
        this.troncos = this.physics.add.group();

        for(let i = 0; i < TRONCO_TO_RENDER; i++){
            const troncoSuperior = this.troncos.create(0, 0, 'tronco-superior').setImmovable(true)
            .setOrigin(0,1);
            const troncoInferior = this.troncos.create(0, 0, 'tronco-inferior').setImmovable(true).setOrigin(0,0);

            this.colocarTronco(troncoSuperior, troncoInferior);
        }
        // Velocidade dos Troncos
        this.troncos.setVelocityX(-200);
    }

    createCollider(){

        // Configura o callback de colisão para chamar gameOver
        this.physics.add.collider(this.bird, this.troncos, () => {
            this.parallaxSpeed1 = 0;
            this.parallaxSpeed2 = 0;
            this.gameOver();
        }, null, this);

        // Colisão do pássaro com as bananas
        this.physics.add.overlap(this.bird, this.bananas, this.collectBanana, null, this);
    }

    createScore() {
        this.score = 0;
        const bestScore = localStorage.getItem('bestScore');
        this.scoreText = this.add.text(65, 38, `:  ${0}`, {fontSize: '32px', fontFamily: 'MinhaFonte', fill: '#000'}).setDepth(2);
        this.add.text(65, 72, `: ${bestScore || 0}`, {fontSize: '32px', fontFamily: 'MinhaFonte', fill: '#000'}).setDepth(2);
    }
    

    createPause(){
        this.isPaused = false;
        const pauseButton = this.add.image(this.config.width - 10, this.config.height -10, 'pause').setInteractive().setScale(3).setOrigin(1).setOrigin(1);
        
        pauseButton.on('pointerdown', () => {
            this.isPaused = true;
            this.physics.pause();
            this.scene.pause();
            this.scene.launch('PauseScene');
        })
    }

    controleInputs(){
        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown-SPACE', this.flap, this);
    }

    checkGameStatus(){
        if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
            this.gameOver();
            }
    }

    colocarTronco(supTronco, infTronco) {
        const difficulty = this.difficulties[this.currentDifficulty];
        const rightMostX = this.getRightMostTronco();
        const troncoVerticalDistance = Phaser.Math.Between(...difficulty.troncoVerticalDistanceRange);
        const troncoVerticalPosition = Phaser.Math.Between(20, this.config.height - 20 - troncoVerticalDistance);
        const troncoHorizontalDistance = Phaser.Math.Between(...difficulty.troncoHorizontalDistanceRange);
    
        // Posicionar os troncos
        supTronco.x = rightMostX + troncoHorizontalDistance;
        supTronco.y = troncoVerticalPosition;
    
        infTronco.x = supTronco.x;
        infTronco.y = supTronco.y + troncoVerticalDistance;
    
        // Certificar que o grupo de bananas existe
        if (!this.bananas) {
            this.bananas = this.physics.add.group({
                defaultKey: 'banana', // Usa o sprite 'banana'
                maxSize: 10,          // Limite de bananas criadas
            });
        }
    
        // Criar a banana na posição correta
        const banana = this.bananas.get(supTronco.x, supTronco.y + troncoVerticalDistance / 2);
        if (banana) {
            banana.setActive(true).setVisible(true); // Ativa e torna visível
            banana.setOrigin(0.5);
            banana.body.setAllowGravity(false); // Desabilita gravidade para a banana
            banana.setVelocityX(-200);          // Movimento horizontal junto com os troncos
        }
    }
    
    reciclarTronco() {
        const tempTroncos = [];
        this.troncos.getChildren().forEach(tronco => {
            if (tronco.getBounds().right <= 0) {
                tempTroncos.push(tronco);
                if (tempTroncos.length === 2) {
                    this.colocarTronco(...tempTroncos);
                    this.increaseScore();
                    this.saveBestScore(); // Salva o bestScore aqui
                    this.increaseDifficulty();
                }
            }
        });
    
        // Remover bananas que saíram da tela
        this.bananas.getChildren().forEach(banana => {
            if (banana.getBounds().right <= 0) {
                banana.destroy(); // Remove banana da tela
            }
        });
    }
    
    increaseDifficulty() {
        if (this.score === 1) {
          this.currentDifficulty = 'normal';
        }
        if (this.score === 3) {
          this.currentDifficulty = 'hard';
        }
    }
    
    flap(){
        if (this.isPaused){return;}
        this.bird.body.velocity.y = -this.flapVelocity;

    }

    increaseScore(points = 1) {
        this.score += points; // Adiciona pontos ao score
        this.scoreText.setText(`: ${this.score}`); // Atualiza o texto do score
    }

    saveBestScore() {
        const bestScoreText = localStorage.getItem('bestScore');
        const bestScore = bestScoreText && parseInt(bestScoreText, 10);
    
        if (!bestScore || this.score > bestScore) {
            localStorage.setItem('bestScore', this.score);
        }
    }
    
    
    gameOver() {
        this.physics.pause();
        this.bird.setTint(0xee4824);
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            },
            loop: false,
        });
    }

    getRightMostTronco(){
        let rightMostX = 0;
    
        this.troncos.getChildren().forEach(function(tronco){
            rightMostX = Math.max(tronco.x, rightMostX);
        })
    
        return rightMostX;
    }
    
}

export default MinigameScene;