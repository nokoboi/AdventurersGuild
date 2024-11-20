// Crear partículas mágicas
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.width = particle.style.height = Math.random() * 10 + 5 + 'px';
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);
    }
}

// Crear runas mágicas
function createRunes() {
    const container = document.getElementById('runes');
    const runeSymbols = ['⚡', '✧', '⚔️', '⚜️', '☘️', '⭐'];
    for (let i = 0; i < 15; i++) {
        const rune = document.createElement('div');
        rune.className = 'rune';
        rune.textContent = runeSymbols[Math.floor(Math.random() * runeSymbols.length)];
        rune.style.left = Math.random() * 100 + 'vw';
        rune.style.animationDelay = Math.random() * 8 + 's';
        container.appendChild(rune);
    }
}

class DiceGame {
    constructor(numDice = 4) {
        this.numDice = numDice;
        this.diceValues = [];
        this.isRolling = false;
        this.minDice = 2;  // Mínimo de dados permitido
        this.maxDice = 8;  // Máximo de dados permitido
        
        this.container = document.getElementById('diceContainer');
        this.rollButton = document.getElementById('rollButton');
        this.resultsDiv = document.getElementById('results');
        this.diceCountDisplay = document.getElementById('diceCount');
        this.addDiceButton = document.getElementById('addDice');
        this.removeDiceButton = document.getElementById('removeDice');
        
        this.initialize();
        this.setupEventListeners();
        this.updateDiceCount();
    }

    initialize() {
        this.container.innerHTML = '';
        this.diceValues = Array(this.numDice).fill(1);
        this.createDice();
        this.updateControls();
    }

    updateDiceCount() {
        this.diceCountDisplay.textContent = `${this.numDice} Runas`;
        this.updateControls();
    }

    updateControls() {
        this.addDiceButton.disabled = this.numDice >= this.maxDice;
        this.removeDiceButton.disabled = this.numDice <= this.minDice;
    }

    createDice() {
        this.container.innerHTML = '';
        this.diceValues.forEach((value, index) => {
            const dice = document.createElement('div');
            dice.className = 'dice';
            dice.id = `dice-${index}`;
            dice.textContent = value;
            // Añadir animación de aparición para nuevos dados
            dice.style.animation = 'glow 0.5s ease-in-out';
            this.container.appendChild(dice);
        });
    }

    setupEventListeners() {
        this.rollButton.addEventListener('click', () => this.rollDice());
        
        this.addDiceButton.addEventListener('click', () => {
            if (this.numDice < this.maxDice && !this.isRolling) {
                this.numDice++;
                this.diceValues.push(1);
                this.updateDiceCount();
                this.createDice();
            }
        });
        
        this.removeDiceButton.addEventListener('click', () => {
            if (this.numDice > this.minDice && !this.isRolling) {
                this.numDice--;
                this.diceValues.pop();
                this.updateDiceCount();
                this.createDice();
            }
        });
    }

    async rollDice() {
        if (this.isRolling) return;
        
        this.isRolling = true;
        this.rollButton.disabled = true;
        this.addDiceButton.disabled = true;
        this.removeDiceButton.disabled = true;
        this.rollButton.textContent = 'Lanzando...';
        this.resultsDiv.textContent = '';
        
        document.querySelectorAll('.dice').forEach(dice => {
            dice.classList.remove('eliminated');
        });

        const diceElements = document.querySelectorAll('.dice');
        diceElements.forEach(dice => dice.classList.add('rolling'));

        for (let i = 0; i < 15; i++) {
            this.diceValues = this.diceValues.map(() => 
                Math.floor(Math.random() * 6) + 1
            );
            
            diceElements.forEach((dice, index) => {
                dice.textContent = this.diceValues[index];
            });
            
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        diceElements.forEach(dice => dice.classList.remove('rolling'));

        const minValue = Math.min(...this.diceValues);
        const minIndex = this.diceValues.findIndex(value => value === minValue);
        document.getElementById(`dice-${minIndex}`).classList.add('eliminated');

        const sum = this.diceValues
            .filter((_, index) => index !== minIndex)
            .reduce((acc, val) => acc + val, 0);

        this.resultsDiv.textContent = `Las runas antiguas revelan: ${sum}`;
        
        this.isRolling = false;
        this.rollButton.disabled = false;
        this.rollButton.textContent = 'Invoca las runas';
        this.updateControls();
    }
}

// Initialize game and effects
createParticles();
createRunes();
const game = new DiceGame(4);

