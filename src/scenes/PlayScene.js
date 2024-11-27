import BaseScene from "./BaseScene.js";

class PlayScene extends BaseScene {
    constructor(config) {
        super('PlayScene', config);
    }

    // O preload está sendo carregado em outra Cena (PreloadScene)
    preload() {
    }
    
    create() {
        // Configuração inicial do jogo
        this.bananasGroup = this.add.group();
    
        // Inicialize o macaco antes de resetar o estado
        this.createMonkeyAnimation();
        this.monkey = this.add.sprite(800, 400, 'monkey')
            .setAlpha(0.2)
            .setScale(3.3)
            .play('monkeyWalk');
    
        // Inicialização de textos
        this.requestText = this.add.text(135, 235, ': 0x', {
            fontFamily: 'MinhaFonte', 
            fontSize: '40px', 
            fill: '#fff'
        });
    
        this.bananasSoldText = this.add.text(150, 109, `: 0`, {
            fontFamily: 'MinhaFonte', 
            fontSize: '35px', 
            fill: '#fff'
        });
    
        this.moneyText = this.add.text(515, 50, `$ 0`, {
            fontFamily: 'MinhaFonte', 
            fontSize: '27px', 
            fill: '#fff'
        });
    
        this.bananasStorageText = this.add.text(715, 50, `x 99`, {
            fontFamily: 'MinhaFonte', 
            fontSize: '28px', 
            fill: '#fff'
        });
    
        // Agora que todos os elementos estão criados, reseta o estado do jogo
        this.resetGameState();
    
        // Outros elementos do jogo
        this.isPaused = true; // O jogo começa pausado
        this.createStartPopup();
        this.startPopup.setVisible(true);
    
        this.backgroundMusic = this.sound.add('hora_da_venda', { loop: true, volume: 0.5 });
        this.pressButtonSound = this.sound.add('press_button', { volume: 0.3 });
        this.menuButtonSound = this.sound.add('menu_button', { volume: 0.4 });
        this.startButtonSound = this.sound.add('start_button_sound', { volume: 0.4 });
        this.cashSound = this.sound.add('cash', { volume: 0.5 });
        this.collectSound = this.sound.add('banana_compra', { volume: 0.3 });
        this.monkeyOkaySound = this.sound.add('macaco_okay', { volume: 0.2 });
    
        this.events.on('shutdown', () => {
            this.backgroundMusic.stop();
        });
    
        this.carregarImagens_Textos();
        this.depositoBananas();
        this.contagemTempo();
        this.createPauseButton();
        this.createPausePopup();
        this.createBananaPurchaseButtons();

        // Configurações do macaco
        this.createMonkeyAnimation();
        this.monkey = this.add.sprite(800, 400, 'monkey')
        .setAlpha(0.2)
        .setScale(3.3)
        .play('monkeyWalk');
        this.monkeyTargetX = 400;
        this.monkeySpeed = (this.monkey.x - this.monkeyTargetX) / 120; // Calcula a velocidade para 2 segundos (120 frames se 60 FPS)

        // Criação dos botões de adicionar e remover banana
        this.addBananaButton = this.add.image(100, 500, 'colocarBanana').setInteractive().setScale(3);
        this.removeBananaButton = this.add.image(150, 550, 'retirarBanana').setInteractive().setScale(3);
        
        // Botão de confirmação (inicialmente invisível)
        this.confirmButton = this.add.image(400, 575, 'confirmButton').setInteractive().setVisible(false).setScale(3);

        // Aplica o efeito hover nos botões
        this.createHoverEffect(this.addBananaButton, 3.3); // Aumenta a escala para 1.3 vezes o tamanho original
        this.createHoverEffect(this.removeBananaButton, 3.3);
        this.createHoverEffect(this.confirmButton, 3.3);
        this.createHoverEffect(this.addThreeBananasButton, 3.3);
        this.createHoverEffect(this.addThreeBananasButton, 3.3);
        

        // Inicializar quantidade de bananas no cesto
        this.bananasInBasket = 0;
        this.bananasGroup = this.add.group();

        // Eventos para os botões de adicionar bananas
        this.addBananaButton.on('pointerdown', () => {
            this.pressButtonSound.play(); // Toca o som ao pressionar
            
            // Verifica se há bananas suficientes no estoque
            if (this.bananasInStorage > 0) {
                if (this.bananasInBasket < 9) {
                    this.bananasInBasket++;
                    this.bananasInStorage--; // Reduz do estoque
                    this.addBananaToBasket();
                    this.updateBasketText();
                    this.updateStorageText(); // Atualiza o texto do estoque
                } else {
                    this.showErrorImage(); // Cesto cheio
                }
            } else {
                //Modifique Aqui
                this.requestText.setText('Sem bananas suficientes! Colete mais bananas.');
            }
        });
        
        
        this.removeBananaButton.on('pointerdown', () => {
            this.pressButtonSound.play(); // Toca o som ao pressionar
        
            if (this.bananasInBasket > 0) {
                // Incrementa o estoque com o número de bananas removidas
                this.bananasInStorage += this.bananasInBasket;
                
                // Zera o cesto
                this.clearBasket();
        
                // Atualiza os textos do cesto e do estoque
                this.updateBasketText();
                this.updateStorageText();
            }
        });
        
        
        this.addThreeBananasButton.on('pointerdown', () => {
            this.pressButtonSound.play(); // Toca o som ao pressionar
            
            // Verifica se há bananas suficientes no estoque
            if (this.bananasInStorage >= 3) {
                if (this.bananasInBasket + 3 <= 9) {
                    this.addBananasToBasket(3);
                    this.bananasInStorage -= 3; // Reduz 3 do estoque
                    this.updateBasketText();
                    this.updateStorageText(); // Atualiza o texto do estoque
                } else {
                    this.showErrorImage(); // Cesto cheio
                }
            } else {
                //Modifique Aqui
                this.requestText.setText('Sem bananas suficientes! Colete mais bananas.');
            }
        });
        // Alteração

        this.confirmButton.on('pointerdown', () => {
            this.pressButtonSound.play(); // Toca o som ao pressionar
    
            if (this.bananasInBasket === this.bananasRequested) {
                // Calcula o valor inicial da venda
                let saleAmount = this.bananasRequested * this.bananaPrice;
    
                // Reduz o valor da venda pela metade se o macaco estiver vermelho
                if (this.monkey.tintTopLeft === 0xff0000) { 
                    saleAmount /= 2; 
                }
    
                // Adiciona o valor da venda ao dinheiro acumulado
                this.moneyEarned += saleAmount;
    
                // Atualiza o texto de dinheiro e bananas vendidas
                this.bananasSold += this.bananasRequested;
                this.bananasSoldText.setText(`: ${this.bananasSold}`);
                this.moneyText.setText(`$ ${this.moneyEarned}`);
    
                // Mostra a reação do macaco e reseta o cesto
                this.showMonkeyReaction(true); // Pedido correto
                this.requestText.setText('BOA');
                this.time.delayedCall(1000, () => {
                    this.requestText.setText(': 0x');
                });
    
                // Toca o som "macaco_okay.mp3"
                this.monkeyOkaySound.play();
    
                // Exibe a imagem "renda.png" em zigzag
                this.showEarningsImage();
    
                this.monkeyExit();
                this.clearBasket();
            } else {
                // Mostra a reação do macaco, mas não reduz o dinheiro
                this.showMonkeyReaction(false); // Pedido incorreto
            }
        });

    }

    resetGameState() {
        // Reinicializa contadores
        this.timeLimit = 180;
        this.bananasSold = 0;
        this.moneyEarned = 0;
        this.bananaPrice = 2;
    
        // Reinicializa o estoque
        this.bananasInStorage = 99;
        localStorage.setItem('bananasBau', this.bananasInStorage);
    
        // Reinicia o texto e elementos visuais
        if (this.bananasGroup) {
            this.bananasGroup.clear(true, true);
        }
    
        if (this.requestText) {
            this.requestText.setText(': 0x');
        }
        if (this.bananasSoldText) {
            this.bananasSoldText.setText(`: ${this.bananasSold}`);
        }
        if (this.moneyText) {
            this.moneyText.setText(`$ ${this.moneyEarned}`);
        }
        if (this.bananasStorageText) {
            this.bananasStorageText.setText(`x ${this.bananasInStorage}`);
        }
    
        // Reseta o estado do macaco, se ele existir
        if (this.monkey) {
            this.monkey.setPosition(800, 400).setAlpha(0.2).clearTint();
            this.monkey.play('monkeyWalk');
        }
    
        // Reseta o popup de pausa
        this.createPausePopup(); // Recria o popup para garantir que as imagens sejam restauradas
    
        // Reseta outras variáveis do jogo
        this.hasGeneratedRequest = false;
        this.bananasInBasket = 0;
        this.bananasRequested = 0;
    }
    
    carregarImagens_Textos(){

        // Cenário
        this.add.image(400, 300, 'background').setOrigin();
        this.add.image(400, 540, 'prato').setScale(2);
        this.add.image(735, 200, 'maisbanana').setScale(4);
        this.add.image(178, 240, 'wood_smallborder').setOrigin().setScale(3,2.5);

        // Criação dos botões de adicionar e remover banana
        this.addBananaButton = this.add.image(100, 500, 'colocarBanana').setInteractive().setScale(3);
        this.addThreeBananasButton = this.add.image(200, 500, 'colocarBanana3').setInteractive().setScale(3); 

        // Tabela Principal
        // X = Horizontal, Y= Altura

        this.add.image(180, 80,'wood_smallborder').setOrigin().setScale(3, 3.1);
        this.add.image(115,60,'relogio').setScale(1);
        this.add.image(115,120,'banana_vendida').setScale(0.8);
        this.add.image(110,252,'pedido').setScale(1);
        this.add.image(240,250,'banana').setScale(0.8);

        // Tabela Dinheiro
        this.add.image(480, 60,'money').setScale(1.5).setDepth(1);
        this.add.image(515, 55, 'wood_smallborder').setOrigin().setScale(2);

        // Imagens - Bananas no Deposito
        this.add.image(715, 55, 'wood_smallborder').setOrigin().setScale(2);

        // Textos
        this.timeText = this.add.text(150, 42, `: ${this.formatTime(this.timeLimit)}`, { fontFamily:'MinhaFonte', fontSize: '35px', fill: '#fff' });
        this.moneyText = this.add.text(515, 50, `$ ${this.moneyEarned}`, { fontFamily:'MinhaFonte', fontSize: '27px', fill: '#fff' });
        this.bananasSoldText = this.add.text(150, 109, `: ${this.bananasSold}`, { fontFamily:'MinhaFonte', fontSize: '35px', fill: '#fff' });
        this.requestText = this.add.text(135, 235, ': 0x', {fontFamily:'MinhaFonte',  fontSize: '40px', fill: '#fff' });

    }

    showEarningsImage() {
        // Cria a imagem "renda.png" no ponto inicial (fora da tela)
        const earningsImage = this.add.image(400, 500, 'renda').setScale(2).setAlpha(1);
    
        // Animação zigzag (de baixo para cima com movimento horizontal)
        this.tweens.add({
            targets: earningsImage,
            y: 300, // Posição final na vertical
            x: { from: 400, to: 400 }, // Movimento horizontal em zigzag
            ease: 'Sine.easeInOut',
            duration: 900, // Duração da animação
            yoyo: true, // Faz o movimento voltar
            repeat: 0, // Não repete
        });
    
        // Temporizador para remover a imagem após a animação
        this.time.delayedCall(900, () => {
            earningsImage.destroy(); // Remove a imagem
        });
    }

    showBananaPurchasedImage() {
        const purchasedImage = this.add.image(600, 500, 'bananacomprada').setScale(1).setAlpha(1).setDepth(2);
        this.tweens.add({
            targets: purchasedImage,
            y: 300, 
            x: { from: 590, to: 610}, 
            ease: 'Sine.easeInOut',
            duration: 900,
            yoyo: true, 
            repeat: 0, 
        });
        this.time.delayedCall(900, () => {
            purchasedImage.destroy();
        });
    }

    createBananaPurchaseButtons() {
        // Configuração do cesto
        this.basket = this.add.image(600, 455, 'basket').setScale(2.3).setDepth(2);
    
        // Botão para gastar 10 dinheiro e comprar 30 bananas
        this.comprarbanana10 = this.add.image(600, 490, 'comprarbanana1')
            .setInteractive()
            .setScale(1.5).setDepth(2);
    
        // Adiciona funcionalidade ao botão
        if (this.comprarbanana10) {
            this.comprarbanana10.on('pointerdown', () => {
                if (this.moneyEarned >= 10) {
                    this.moneyEarned -= 10; // Deduz 10 dinheiro
                    this.bananasInStorage += 30; // Adiciona 30 bananas ao estoque
                    this.updateStorageText(); // Atualiza o texto do estoque
                    this.moneyText.setText(`$ ${this.moneyEarned}`); // Atualiza o dinheiro na interface
                    this.animateButton(this.comprarbanana10); // Anima o botão
    
                    // Exibe a imagem "bananacomprada.png" em movimento de zigzag
                    this.showBananaPurchasedImage();
    
                    // Toca o som "collectSound.mp3"
                    this.collectSound.play();
                } else {
                    // Mostra imagem de erro
                    this.showErrorImage();
                }
            });
        }
    
        // Botão para gastar 20 dinheiro e comprar 80 bananas
        this.comprarbanana20 = this.add.image(600, 540, 'comprarbanana2')
            .setInteractive()
            .setScale(1.5).setDepth(2);
    
        // Adiciona funcionalidade ao botão
        if (this.comprarbanana20) {
            this.comprarbanana20.on('pointerdown', () => {
                if (this.moneyEarned >= 20) {
                    this.moneyEarned -= 20; // Deduz 20 dinheiro
                    this.bananasInStorage += 80; // Adiciona 80 bananas ao estoque
                    this.updateStorageText(); // Atualiza o texto do estoque
                    this.moneyText.setText(`$ ${this.moneyEarned}`); // Atualiza o dinheiro na interface
                    this.animateButton(this.comprarbanana20); // Anima o botão
    
                    // Exibe a imagem "bananacomprada.png" em movimento de zigzag
                    this.showBananaPurchasedImage();
    
                    // Toca o som "collectSound.mp3"
                    this.collectSound.play();
                } else {
                    // Mostra imagem de erro
                    this.showErrorImage();
                }
            });
        }
    
        // Adiciona efeito hover aos botões
        if (this.comprarbanana10) this.createSpecialHoverEffect(this.comprarbanana10, 1.8);
        if (this.comprarbanana20) this.createSpecialHoverEffect(this.comprarbanana20, 1.8);
    }
    
    createSpecialHoverEffect(button, scale = 1.55, duration = 300) {
        // Quando o mouse passa sobre o botão
        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scale: { from: button.scaleX, to: scale }, // Aumenta a escala do botão
                duration: duration,
                ease: 'Sine.easeInOut', // Efeito suave
            });
        });

        // Quando o mouse sai do botão
        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scale: { from: button.scaleX, to: 1.4 }, // Retorna ao tamanho original
                duration: duration,
                ease: 'Sine.easeInOut', // Efeito suave
            });
        });
    }

    animateButton(button) {
        this.tweens.add({
            targets: button,
            scale: { from: button.scaleX, to: button.scaleX * 1.1 }, // Aumenta a escala
            duration: 150,
            yoyo: true, // Retorna à escala original
            ease: 'Sine.easeInOut',
        });
    }   

    createMonkeyAnimation() {
        // Animação de caminhada
        this.anims.create({
            key: 'monkeyWalk', // Nome da animação de caminhada
            frames: this.anims.generateFrameNumbers('monkey', { start: 0, end: 2 }), // Frames 0, 1, 2
            frameRate: 8, // Ajuste para a velocidade desejada
            repeat: -1 // Repetir indefinidamente
        });
    
        // Animação de raiva
        this.anims.create({
            key: 'monkeyAngry', // Nome da animação de raiva
            frames: this.anims.generateFrameNumbers('monkey', { start: 3, end: 5 }), // Frames 3, 4, 5
            frameRate: 5, // Ajuste para a velocidade desejada
            repeat: -1 // Repetir indefinidamente
        });
    }

    showErrorImage() {
        if (this.errorImage) {
            return; // Se já houver uma imagem de erro, não cria outra
        }
    
        // Cria a imagem de erro (fora da tela inicialmente)
        this.errorImage = this.add.image(400, 600, 'errorbanana').setScale(3).setAlpha(1);
    
        // Movimento ZigZag (de baixo para cima)
        this.tweens.add({
            targets: this.errorImage,
            y: 300,  // Move a imagem para a posição de erro
            x: 400,  // Movimento ZigZag horizontal
            ease: 'Sine.easeInOut',
            duration: 1000,
            yoyo: true,  // Faz o movimento voltar para baixo
            repeat: 0,   // Não repete
        });
    
        // Toca o som de erro
        this.sound.play('error', { volume: 0.5 });
    
        // Temporizador para desaparecer após 1 segundo
        this.time.delayedCall(1000, () => {
            if (this.errorImage) {
                this.errorImage.setAlpha(0);  // Faz a imagem desaparecer suavemente
                this.time.delayedCall(300, () => {
                    this.errorImage.destroy();  // Remove a imagem completamente
                    this.errorImage = null;  // Zera a referência
                });
            }
        });
    }

    showAddBananasError() {
        if (this.errorImage) {
            // Se a imagem de erro já estiver visível, não cria outra
            return;
        }

        // Cria a imagem de erro (fora da tela inicialmente)
        this.errorImage = this.add.image(400, 600, 'errorBanana').setScale(3).setAlpha(1);

        // Movimento ZigZag (de baixo para cima)
        this.tweens.add({
            targets: this.errorImage,
            y: 200,  // Move a imagem para a posição de erro (desça até 200px do topo)
            x: 450,  // Movimento ZigZag: move de esquerda para direita e vice-versa
            ease: 'Sine.easeInOut',
            duration: 1000,
            yoyo: true,  // Faz o movimento voltar para baixo
            repeat: 0,   // Não repete
        });

        // Temporizador para desaparecer após 1 segundo
        this.time.delayedCall(1000, () => {
            if (this.errorImage) {
                this.errorImage.setAlpha(0);  // Faz a imagem desaparecer suavemente
                this.time.delayedCall(300, () => {
                    this.errorImage.destroy();  // Remove a imagem completamente após a animação
                    this.errorImage = null;  // Zera a referência
                });
            }
        });
    }
    // Criar a janela inicial do jogo
    createStartPopup() {
        // Cria uma sobreposição preta inicial (cobre toda a tela)
        this.screenOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000)
            .setAlpha(1) // Totalmente opaco
            .setDepth(3); // Definir profundidade abaixo do popup
    
        // Cria o painel de início (inicialmente visível)
        this.startPopup = this.add.container(400, 300).setVisible(true).setDepth(4);
    
        // Fundo da janela de início
        const popupBackground = this.add.image(0, 0, 'popupBackground').setScale(3);
    
        // Texto de boas-vindas
        const popupText = this.add.text(0, -50, 'Bem-vindo ao Jogo!\nClique em Iniciar para começar!', {
            fontFamily: 'MinhaFonte',
            fontSize: '18px',
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);
    
        // Botão para iniciar o jogo
        const startButton = this.add.image(0, 35, 'startButton')
            .setInteractive()
            .setScale(3)
            .on('pointerdown', () => {
                this.startButtonSound.play(); // Toca o som do botão de menu
                this.startGame();            // Chama a função de iniciar o jogo
            });
    
        // Adiciona tudo ao container do popup
        this.startPopup.add([popupBackground, popupText, startButton]);
    
        // Aplica o efeito de hover no botão de iniciar
        this.createHoverEffect(startButton, 3.6);
    }
    // Começa o jogo (remove o popup e despausa o jogo)
    startGame() {
        // Esconde o popup de início
        this.startPopup.setVisible(false);
    
        // Inicia a música
        this.backgroundMusic.play();
    
        // Inicia o jogo (despausa)
        this.isPaused = false;
        this.timer.paused = false;  // Retoma o timer
        this.monkey.setAlpha(1);  // Torna o macaco visível
    
        // Faz a sobreposição preta desaparecer gradualmente
        this.tweens.add({
            targets: this.screenOverlay,
            alpha: 0, // Gradualmente desaparece
            duration: 2000, // 2 segundos para clarear
            onComplete: () => {
                this.screenOverlay.destroy(); // Remove a sobreposição da memória
            }
        });
    
        // Começa o movimento do macaco e outras lógicas do jogo
        this.monkeyTargetX = 400;  // Posição de destino do macaco
        this.monkeySpeed = (this.monkey.x - this.monkeyTargetX) / 120; // Define a velocidade do macaco
    }

    pauseGame() {
        this.isPaused = true; // Define que o jogo está pausado
        this.timer.paused = true; // Pausa o contador de tempo
        this.backgroundMusic.pause(); // Pausa a música
    
        // Cria o overlay (se ainda não existir)
        if (!this.cenaOverlay) {
            this.cenaOverlay = this.add.rectangle(400, 300, 800, 600, 0x000000)
                .setAlpha(1) // Semi-transparente
                .setDepth(2); // Coloca atrás do popup
        }
        // Atualiza o texto no popup
        this.pausePopupText.setText(
                `: ${this.formatTime(this.timeLimit)}\n \n` +
                `: ${this.bananasSold}\n \n` +
                `: $${this.moneyEarned}`
        );

        if (!this.pauseImages) {
            this.pauseImages = this.add.container(400, 200).setDepth(4);
    
            const clockImage = this.add.image(-45, 29, 'relogio').setScale(0.85);
            const bananaImage = this.add.image(-50, 78, 'banana_vendida').setScale(0.65);
            const moneyImage = this.add.image(-50, 130, 'money').setScale(0.85);
            const pause_wood = this.add.image(80, 75, 'pause_wood').setScale(4,2.5);
    
            this.pauseImages.add([clockImage, bananaImage, moneyImage, pause_wood]);
        }

        this.pauseImages.setVisible(true); 
    
        // Mostra o popup de pausa
        this.pausePopup.setVisible(true);
    }

    resumeGame() {
        this.isPaused = false; // Retoma o jogo
        this.timer.paused = false; // Retoma o contador de tempo
        this.backgroundMusic.resume(); // Retoma a música
    
        if (this.cenaOverlay) {
            this.cenaOverlay.destroy(); // Remove o overlay
            this.cenaOverlay = null;
        }
    
        if (this.pauseImages) {
            this.pauseImages.setVisible(false); // Esconde as imagens
        }
    
        this.pausePopup.setVisible(false); // Esconde o popup
    }
    // Função que aplica o efeito de hover em um botão
    createHoverEffect(button, scale = 3, duration = 300) {
        // Quando o mouse passa sobre o botão
        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scale: { from: button.scaleX, to: scale }, // Aumenta a escala do botão
                duration: duration,
                ease: 'Sine.easeInOut', // Efeito suave
            });
        });

        // Quando o mouse sai do botão
        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scale: { from: button.scaleX, to: 3 }, // Retorna ao tamanho original
                duration: duration,
                ease: 'Sine.easeInOut', // Efeito suave
            });
        });
    }
    //Contagem de Tempo
    contagemTempo(){
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }  
    // Adiciona 3 bananas de uma vez
    addThreeBananasToBasket() {
        this.addBananaToBasket('3banana');
    }
    //Adiciona Banana na Cesta
    addBananaToBasket(bananaType = 'banana') {
        // Adiciona uma banana no cesto visualmente (utilizando o tipo de banana passado como argumento)
        const banana = this.add.image(350 + (this.bananasInBasket * 10), 520 + (Math.floor(this.bananasInBasket / 10) * 30), bananaType).setScale(1);
        this.bananasGroup.add(banana);
    }
    addBananasToBasket(numBananas) {
        for (let i = 0; i < numBananas; i++) {
            // Calcula a posição das bananas dentro do cesto (alinhando horizontalmente)
            const xPosition = 350 + (this.bananasInBasket * 10);  // Alinha horizontalmente
            const yPosition = 520 + (Math.floor(this.bananasInBasket / 10) * 30);  // Alinha verticalmente a cada 10 bananas

            // Adiciona a imagem de uma banana no cesto
            const banana = this.add.image(xPosition, yPosition, 'banana').setScale(1);

            // Adiciona a banana ao grupo de bananas
            this.bananasGroup.add(banana);

            // Incrementa a contagem de bananas no cesto
            this.bananasInBasket++;
        }
    }

    depositoBananas(){
        // Inicializar variáveis do jogo
        this.bananasInStorage = parseInt(localStorage.getItem('bananasBau'), 10) || 0;

        // Imagem
        this.add.image(680, 64, 'banana_chest').setOrigin().setScale(1);

        // Adicione o texto das bananas no depósito
        this.bananasStorageText = this.add.text(715, 50, `x ${this.bananasInStorage}`, { 
            fontFamily: 'MinhaFonte', 
            fontSize: '28px', 
            fill: '#fff' 
        });

        // Atualize o texto toda vez que vender bananas
        this.updateStorageText();
    }
    // Atualizar texto das bananas no armazém
    updateStorageText() {
        this.bananasStorageText.setText(`x ${this.bananasInStorage}`);
    }
    // Atualizar armazém ao vender bananas
    sellBananas(bananas) {

        if (this.bananasInStorage >= bananas) {
            this.bananasSold += bananas;
            this.moneyEarned += bananas * this.bananaPrice;
            this.bananasInStorage -= bananas;

            // Salva no localStorage
            localStorage.setItem('bananasbau', this.bananasInStorage);

            // Atualiza os textos
            this.bananasSoldText.setText(`: ${this.bananasSold}`);
            this.moneyText.setText(`$ ${this.moneyEarned}`);
            this.updateStorageText();
            } else {
                // Modifique Aqui
                this.requestText.setText(`Sem bananas suficientes no armazém!`);
            }
    }
    createPauseButton() {
        // Cria o botão de pause
        this.pauseButton = this.add.image(760, 545, 'pause')
        .setDepth(0)
        .setInteractive()
        .setScale(3.9)
        .on('pointerdown', this.pauseGame, this);

        this.pauseButton.on('pointerdown', () => {
            this.menuButtonSound.play(); // Toca o som ao pressionar
            this.pauseGame();
        });

        this.PauseHoverEffect(this.pauseButton, 4.5);
    }

    PauseHoverEffect(button, scale = 4.5, duration = 300) {
        // Quando o mouse passa sobre o botão
        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scale: { from: button.scaleX, to: scale }, // Aumenta a escala do botão
                duration: duration,
                ease: 'Sine.easeInOut', // Efeito suave
            });
        });

        // Quando o mouse sai do botão
        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scale: { from: button.scaleX, to: 3.9 }, // Retorna ao tamanho original
                duration: duration,
                ease: 'Sine.easeInOut', // Efeito suave
            });
        });
    }

    createPausePopup() {
        // Cria a janela popup de pause (inicialmente invisível)
        this.pausePopup = this.add.container(400, 300).setVisible(false).setDepth(3);
    
        const popupBackground = this.add.image(0, 0, 'popupBackground').setScale(2.5, 4);
        
        const popupText = this.add.text(0, -20, '', { 
            fontFamily: 'MinhaFonte', 
            fontSize: '24px', 
            fill: '#fff', 
            align: 'center' 
        }).setOrigin(0.5);
    
        const resumeButton = this.add.image(-50, 92, 'resumeButton')
            .setInteractive()
            .setScale(3)
            .on('pointerdown', () => {
                this.menuButtonSound.play(); 
                this.resumeGame();           
            });
    
        const menuButton = this.add.image(55, 92, 'menuButton')
            .setInteractive()
            .setScale(3)
            .on('pointerdown', () => {
                this.menuButtonSound.play(); 
                this.scene.start('MenuScene'); // Redireciona para a MenuScene
            });
    
        // Adiciona as imagens de relógio, banana, dinheiro e madeira ao popup
        const clockImage = this.add.image(-45, -70, 'relogio').setScale(0.85);
        const bananaImage = this.add.image(-50, -20, 'banana_vendida').setScale(0.65);
        const moneyImage = this.add.image(-50, 30, 'money').setScale(0.85);
        const pause_wood = this.add.image(80, -25, 'pause_wood').setScale(4, 2.5);
    
        // Adiciona todos os elementos ao container do popup
        this.pausePopup.add([popupBackground, popupText, resumeButton, menuButton, clockImage, bananaImage, moneyImage, pause_wood]);
    
        // Salva o texto para atualização posterior
        this.pausePopupText = popupText;
    
        // Aplica efeito hover nos botões
        this.createHoverEffect(menuButton, 3.6);
        this.createHoverEffect(resumeButton, 3.6);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const partInSeconds = seconds % 60;
        return `${minutes}:${partInSeconds.toString().padStart(2, '0')}`;
    }
    // Gera um pedido diferentee para cada macaco
    generateRandomRequest() {
        this.bananasRequested = Phaser.Math.Between(1, 9);
        this.requestText.setText(`: ${this.bananasRequested}x `);
        
        // Torna o botão de confirmação visível
        this.confirmButton.setVisible(true);
    }

    clearBasket() {
        // Zera o número de bananas no cesto
        this.bananasInBasket = 0;
    
        // Remove todas as bananas visuais do grupo de bananas
        this.bananasGroup.clear(true, true);

        this.updateBasketText();
    }

    updateBasketText() {
        this.requestText.setText(`: ${this.bananasRequested}x`); 
    }

    showMonkeyReaction(isCorrect) {
        if (isCorrect) {
            this.cashSound.play(); // Toca o som de confirmação
            this.requestText.setText('BOA');
        } else {
            this.requestText.setText(`: ${this.bananasRequested}x`);
            this.monkey.setTint(0xff0000); // Macaco fica vermelho
            this.monkey.play('monkeyAngry'); // Ativa a animação de raiva
        }
    }

    monkeyExit() {
        this.tweens.add({
            targets: this.monkey,
            x: 1000, // Sai pela lateral
            alpha: 0.2,
            duration: 1500,
            onComplete: () => {
                // Reseta o macaco para nova interação
                this.monkey.setPosition(800, 400).setAlpha(0.2).clearTint();
                this.monkey.play('monkeyWalk'); // Volta à animação de caminhada
                this.hasGeneratedRequest = false; // Permite um novo pedido quando o próximo macaco chegar
            }
        });
    }

    sellBananas(bananas) {
        this.bananasSold += bananas;
        this.moneyEarned += bananas * this.bananaPrice;

        this.bananasSoldText.setText(`: ${this.bananasSold}`);
        this.moneyText.setText(`$ ${this.moneyEarned}`);
    }

    endGame() {
        this.isPaused = false; // Pausa o jogo
        this.timer.paused = true; // Pausa o contador de tempo
        this.backgroundMusic.stop(); // Para a música de fundo
    
        // Recupera os valores acumulados do localStorage
        const moneyTotal = parseInt(localStorage.getItem('moneyTotal'), 10) || 0;
        const bananaSoldTotal = parseInt(localStorage.getItem('bananaSoldTotal'), 10) || 0;
    
        // Atualiza o total acumulado no localStorage se necessário
        if (this.moneyEarned > moneyTotal) {
            localStorage.setItem('moneyTotal', this.moneyEarned);
        }
    
        if (this.bananasSold > bananaSoldTotal) {
            localStorage.setItem('bananaSoldTotal', this.bananasSold);
        }
    
        // Recupera o placar máximo do localStorage
        const bestScore = JSON.parse(localStorage.getItem('bestScore')) || { bananasSold: 0, moneyEarned: 0 };
    
        // Atualiza o placar máximo se necessário
        if (this.bananasSold > bestScore.bananasSold || this.moneyEarned > bestScore.moneyEarned) {
            const newBestScore = { bananasSold: this.bananasSold, moneyEarned: this.moneyEarned };
            localStorage.setItem('bestScore', JSON.stringify(newBestScore));
        }
    
        this.createEndGamePopup();
    }
    

    createEndGamePopup() {
        // Cria um overlay preto inicial com alpha 0 (transparente)
        const overlay = this.add.rectangle(400, 300, 800, 600, 0x000000)
            .setAlpha(0) 
            .setDepth(5);
    
        // Efeito de fade-in no overlay
        this.tweens.add({
            targets: overlay,
            alpha: 1, 
            duration: 1000, 
            onComplete: () => {
                this.showFinalPopup();
            }
        });
    }

    // Método para criar e exibir o popup final
    showFinalPopup() {
        // Container do popup
        const endGamePopup = this.add.container(400, 300).setDepth(6);

        // Fundo do popup
        const popupBackground = this.add.image(0, 0, 'popupBackground').setScale(3, 5);

        // Texto de parabéns
        const congratulationsText = this.add.text(0, -90, 'Excelente!', {
            fontFamily: 'MinhaFonte',
            fontSize: '45px',
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        // Texto de informações finais
        const finalStatsText = this.add.text(20, 15, 
            `: ${this.bananasSold}\n\n$${this.moneyEarned}`, 
            {
                fontFamily: 'MinhaFonte',
                fontSize: '35px',
                fill: '#fff',
                align: 'center'
            }).setOrigin(0.5);

        // Adiciona a imagem "bananasold" no popup
        const bananaSoldImage = this.add.image(-45, -30, 'banana_vendida').setScale(1.2);

        // Adiciona a imagem "banana" no popup
        const moneyImage = this.add.image(-45, 50, 'money').setScale(1.5);

        // Botão de reiniciar o jogo
        const restartButton = this.add.image(-70, 120, 'restartButton')
            .setInteractive()
            .setScale(4)
            .on('pointerdown', () => {
                this.menuButtonSound.play(); 
                this.finalMusic.stop(); 
                this.scene.restart(); 
            });

        // Botão para ir ao MenuScene
        const menuButton = this.add.image(70, 120, 'menuButton')
            .setInteractive()
            .setScale(4)
            .on('pointerdown', () => {
                this.menuButtonSound.play(); 
                this.finalMusic.stop(); 
                this.scene.start('MenuScene'); 
            });

        // Adiciona tudo ao container do popup
        endGamePopup.add([popupBackground, congratulationsText, finalStatsText, bananaSoldImage, moneyImage, restartButton, menuButton]);

        // Aplica efeito hover nos botões
        this.endGameHoverEffect(restartButton, 4.5);
        this.endGameHoverEffect(menuButton, 4.5);

        // Toca a música final
        this.finalMusic = this.sound.add('musica_final', { loop: true, volume: 0.5 });
        this.finalMusic.play();
    }
    
    endGameHoverEffect(button, scale = 4.5, duration = 300) {
        // Quando o mouse passa sobre o botão
        button.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scale: { from: button.scaleX, to: scale }, // Aumenta a escala do botão
                duration: duration,
                ease: 'Sine.easeInOut', // Efeito suave
            });
        });

        // Quando o mouse sai do botão
        button.on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scale: { from: button.scaleX, to: 4}, // Retorna ao tamanho original
                duration: duration,
                ease: 'Sine.easeInOut', // Efeito suave
            });
        });
    }

    updateTimer() {
        if (this.isPaused) {
            return; // Se o jogo estiver pausado, não faz nada
        }
        
        this.timeLimit--;
        this.timeText.setText(`: ${this.formatTime(this.timeLimit)}`);
    
        if (this.timeLimit <= 0) {
            this.endGame();
        }
    }
    
    update() {
        if (this.isPaused) {
            return; 
        }
        
        if (!this.isPaused && this.cenaOverlay) {
            this.cenaOverlay.destroy();
            this.cenaOverlay = null;
        }

        if (this.monkey.x > this.monkeyTargetX) {
            this.monkey.x -= this.monkeySpeed; 
        } else if (!this.bananasRequested) {
            this.generateRandomRequest();
        }
        if (this.monkey.x > this.monkeyTargetX) {
            this.monkey.x -= this.monkeySpeed; 
            this.monkey.setAlpha(Phaser.Math.Clamp(this.monkey.alpha + 0.005, 0.75, 1));
            if (!this.monkey.anims.isPlaying) {
                this.monkey.play('monkeyWalk'); 
            }
        } else if (!this.hasGeneratedRequest) {
            this.hasGeneratedRequest = true;
            this.monkey.stop(); 
            this.generateRandomRequest();
        }
    }
}

export default PlayScene;