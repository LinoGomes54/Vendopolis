const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let timer;
let timeLimit = 180; // 3 minutos em segundos
let bananasSold = 0;
let moneyEarned = 0;
let bananaPrice = 2; // Exemplo de preço unitário da banana
let requestText, timeText, moneyText, bananasSoldText;

function preload() {
    // Carregue aqui os assets para o jogo, como sprites dos macacos e banana
}

function create() {
    // Texto para exibir o tempo
    timeText = this.add.text(10, 10, `Tempo: ${formatTime(timeLimit)}`, { fontSize: '24px', fill: '#fff' });
    moneyText = this.add.text(10, 40, `Dinheiro: $${moneyEarned}`, { fontSize: '24px', fill: '#fff' });
    bananasSoldText = this.add.text(10, 70, `Bananas vendidas: ${bananasSold}`, { fontSize: '24px', fill: '#fff' });
    requestText = this.add.text(10, 120, 'Pedido: Nenhum pedido ainda', { fontSize: '24px', fill: '#fff' });

    // Evento para gerar pedidos aleatórios
    this.time.addEvent({
        delay: Phaser.Math.Between(2000, 5000), // Tempo entre pedidos
        callback: generateRandomRequest,
        callbackScope: this,
        loop: true
    });

    // Evento de contagem regressiva
    timer = this.time.addEvent({
        delay: 1000,
        callback: updateTimer,
        callbackScope: this,
        loop: true
    });
}

function generateRandomRequest() {
    const bananasRequested = Phaser.Math.Between(1, 12);
    requestText.setText(`Pedido: ${bananasRequested} bananas`);

    // O jogador pode clicar para "vender" bananas para o pedido atual
    this.input.once('pointerdown', () => {
        sellBananas(bananasRequested);
    });
}

function sellBananas(bananas) {
    bananasSold += bananas;
    moneyEarned += bananas * bananaPrice;

    bananasSoldText.setText(`Bananas vendidas: ${bananasSold}`);
    moneyText.setText(`Dinheiro: $${moneyEarned}`);
    requestText.setText('Pedido: Nenhum pedido');
}

function updateTimer() {
    timeLimit--;
    timeText.setText(`Tempo: ${formatTime(timeLimit)}`);

    if (timeLimit <= 0) {
        endGame(this);
    }
}

function endGame(scene) {
    scene.scene.pause();
    scene.add.text(400, 300, `Fim de jogo!\nBananas vendidas: ${bananasSold}\nDinheiro total: $${moneyEarned}`, 
        { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const partInSeconds = seconds % 60;
    return `${minutes}:${partInSeconds.toString().padStart(2, '0')}`;
}

function update() {
    // Aqui você pode incluir a lógica para animações ou outros elementos no jogo
}
