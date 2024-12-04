import BaseScene from './BaseScene.js';

class ScoreScene extends BaseScene {
    constructor(config) {
        super('ScoreScene', { ...config, canGoBack: true });
    }

    create() {
        super.create();

        // Recupera os valores do localStorage
        const bestScore = parseInt(localStorage.getItem('bestScore'), 10) || 0;
        const moneyTotal = parseInt(localStorage.getItem('moneyTotal'), 10) || 0;
        const bananaSoldTotal = parseInt(localStorage.getItem('bananaSoldTotal'), 10) || 0;

        // Exibe o placar máximo
        this.add.text(...this.screenCenter, `: ${bestScore || 0}`, this.fontOptions)
            .setOrigin(0.5)
            .setDepth(2);

        // Fundo do popup
        this.add.image(400, 300, 'popupBackground').setScale(4, 6);
        this.add.image(400, 210, 'scoretittle').setScale(3, 4);
        this.add.image(340, 295, 'score_points').setScale(2);

        // Exibe o total de dinheiro acumulado
        this.add.text(400, 355, `   $${moneyTotal}`, {
            fontFamily: 'MinhaFonte',
            fontSize: '30px',
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        // Exibe o total de bananas vendidas acumuladas
        this.add.text(400, 410, `: ${bananaSoldTotal}`, {
            fontFamily: 'MinhaFonte',
            fontSize: '30px',
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        // Adiciona as imagens relacionadas
        this.add.image(340, 350, 'money').setScale(1.5); // Ícone de dinheiro
        this.add.image(340, 400, 'banana_vendida').setScale(0.9); // Ícone de banana
    }
}

export default ScoreScene;
