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

// Mapeo de clases y sus características
const classRecommendations = {
    barbaro: ['Fuerza', 'Constitución', 'Destreza', 'Inteligencia', 'Sabiduría', 'Carisma'],
    bardo: ['Carisma', 'Destreza', 'Fuerza', 'Sabiduría', 'Inteligencia', 'Constitución'],
    brujo: ['Carisma', 'Inteligencia', 'Sabiduría', 'Destreza', 'Fuerza', 'Constitución'],
    clerigo: ['Sabiduría', 'Carisma', 'Fuerza', 'Destreza', 'Inteligencia', 'Constitución'],
    druid: ['Sabiduría', 'Destreza', 'Constitución', 'Fuerza', 'Carisma', 'Inteligencia'],
    guerrero: ['Fuerza', 'Constitución', 'Destreza', 'Inteligencia', 'Sabiduría', 'Carisma'],
    hechicero: ['Carisma', 'Inteligencia', 'Destreza', 'Fuerza', 'Sabiduría', 'Constitución'],
    ladron: ['Destreza', 'Inteligencia', 'Fuerza', 'Carisma', 'Sabiduría', 'Constitución'],
    monje: ['Destreza', 'Sabiduría', 'Fuerza', 'Carisma', 'Constitución', 'Inteligencia'],
    paladin: ['Fuerza', 'Carisma', 'Constitución', 'Sabiduría', 'Destreza', 'Inteligencia'],
    explorador: ['Destreza', 'Sabiduría', 'Fuerza', 'Constitución', 'Carisma', 'Inteligencia'],
    mago: ['Inteligencia', 'Sabiduría', 'Carisma', 'Fuerza', 'Destreza', 'Constitución']
};

class DiceGame {
    constructor(numDice = 4) {
        this.numDice = numDice;
        this.diceValues = [];
        this.isRolling = false;
        this.minDice = 2;
        this.maxDice = 8;
        this.rollCount = 0;
        this.maxRolls = 6;
        this.rollResults = [];  // Almacena los resultados de todas las tiradas
        this.finalAssignments = {};  // Almacena las asignaciones finales
        
        this.container = document.getElementById('diceContainer');
        this.rollButton = document.getElementById('rollButton');
        this.resultsDiv = document.getElementById('results');
        this.diceCountDisplay = document.getElementById('diceCount');
        this.addDiceButton = document.getElementById('addDice');
        this.removeDiceButton = document.getElementById('removeDice');
        this.classSelector = document.getElementById('dndClass');
        this.resultsTableBody = document.querySelector('#resultsTable tbody');
        
        this.initialize();
        this.setupEventListeners();
        this.updateDiceCount();
    }

    initialize() {
        this.container.innerHTML = '';
        this.diceValues = Array(this.numDice).fill(1);
        this.rollCount = 0;
        this.rollResults = [];
        this.finalAssignments = {};
        this.createDice();
        this.updateControls();
    }

    updateDiceCount() {
        this.diceCountDisplay.textContent = `${this.numDice} Dados`;
        this.updateControls();
    }

    updateControls() {
        this.addDiceButton.disabled = this.numDice >= this.maxDice || this.isRolling;
        this.removeDiceButton.disabled = this.numDice <= this.minDice || this.isRolling;
        this.rollButton.disabled = this.rollCount >= this.maxRolls;
        
        if (this.rollCount >= this.maxRolls) {
            this.rollButton.textContent = 'Tiradas completadas';
        } else {
            this.rollButton.textContent = `Tirada ${this.rollCount + 1} de ${this.maxRolls}`;
        }
    }

    createDice() {
        this.container.innerHTML = '';
        this.diceValues.forEach((value, index) => {
            const dice = document.createElement('div');
            dice.className = 'dice';
            dice.id = `dice-${index}`;
            dice.textContent = value;
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

        this.classSelector.addEventListener('change', () => {
            this.initialize();
            this.resultsTableBody.innerHTML = '';
            this.resultsDiv.textContent = '';
            this.updateControls();
        });
    }

    async rollDice() {
        if (this.isRolling || this.rollCount >= this.maxRolls) return;
        
        this.isRolling = true;
        this.addDiceButton.disabled = true;
        this.removeDiceButton.disabled = true;
        
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

        const total = this.diceValues
            .filter((_, index) => index !== minIndex)
            .reduce((acc, val) => acc + val, 0);

        this.rollResults.push(total);
        this.rollCount++;

        // Obtener la clase seleccionada y sus características
        const selectedClass = this.classSelector.value;
        const classCharacteristics = classRecommendations[selectedClass];

        // Actualizar asignaciones óptimas
        this.updateOptimalAssignments(classCharacteristics);

        this.resultsDiv.textContent = `Tirada ${this.rollCount}: ${total}`;
        
        this.isRolling = false;
        this.updateControls();
    }

    updateOptimalAssignments(classCharacteristics) {
        // Hacer una copia de los resultados y ordenarlos de mayor a menor
        const sortedResults = [...this.rollResults].sort((a, b) => b - a);
        
        // Crear un objeto con las asignaciones óptimas
        this.finalAssignments = {};
        sortedResults.forEach((value, index) => {
            if (index < classCharacteristics.length) {
                this.finalAssignments[classCharacteristics[index]] = value;
            }
        });

        this.updateResultsTable(classCharacteristics);
    }

    getRecommendation(value) {
        if (value >= 15) {
            return "Excelente resultado!";
        } else if (value >= 12) {
            return "Buen resultado.";
        } else {
            return "Puede mejorar.";
        }
    }

    updateResultsTable(classCharacteristics) {
        this.resultsTableBody.innerHTML = '';

        // Mostrar resultados asignados
        classCharacteristics.forEach((characteristic, index) => {
            const row = document.createElement('tr');
            const value = this.finalAssignments[characteristic];
            
            if (value !== undefined) {
                // Característica con valor asignado
                row.innerHTML = `
                    <td>${value}</td>
                    <td>${characteristic}</td>
                    <td>${this.getRecommendation(value)}</td>
                `;
            } else {
                // Característica pendiente
                row.innerHTML = `
                    <td>-</td>
                    <td>${characteristic}</td>
                    <td>Pendiente de tirar</td>
                `;
            }
            
            this.resultsTableBody.appendChild(row);
        });

        // Mostrar resumen de tiradas sin asignar
        if (this.rollCount < this.maxRolls) {
            this.resultsDiv.innerHTML += '<br>Tiradas restantes: ' + (this.maxRolls - this.rollCount);
        } else {
            this.resultsDiv.innerHTML += '<br>¡Todas las características han sido asignadas!';
        }
    }
}

// Inicializar juego y efectos
createParticles();
createRunes();
const game = new DiceGame(4);


