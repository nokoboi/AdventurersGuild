document.addEventListener('DOMContentLoaded', () => {
    const initialQuests = [
        {
            title: "Derrota al dragón en la Montaña brumosa",
            description: "Un temible dragón rojo ha estado aterrorizando al pueblo de Millbrook. ¡Se necesitan héroes valientes para poner fin a esta amenaza!",
            reward: "5000 piezas de oro + Escudo mágico",
            difficulty: 5,
            claimed: false
        },
        {
            title: "Limpia el sótano infestado de ratas",
            description: "La taberna el Pato Borracho necesita limpiar su sótano de ratas gigantes. ¡Perfecto para aventureros novatos!",
            reward: "50 piezas de oro",
            difficulty: 1,
            claimed: false
        },
        {
            title: "Recupera el tomo perdido",
            description: "El Gremio de Magos busca recuperar un valioso libro de hechizos de las ruinas de una biblioteca abandonada.",
            reward: "500 piezas de oro + Pergamino de proteccion",
            difficulty: 3,
            claimed: false
        }
    ];

    let quests = JSON.parse(localStorage.getItem('quests')) || initialQuests;
    
    const noticeBoard = document.getElementById('noticeBoard');
    const questForm = document.getElementById('questForm');

    function getStars(difficulty) {
        return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
    }

    function createQuestElement(quest, index) {
        const questEl = document.createElement('div');
        questEl.className = `quest-notice ${quest.claimed ? 'claimed' : ''}`;
        questEl.innerHTML = `
            <div class="stars">${getStars(quest.difficulty)}</div>
            <h3>${quest.title}</h3>
            <p>${quest.description}</p>
            <div class="reward">Reward: ${quest.reward}</div>
            <button class="claim-btn" onclick="window.claimQuest(${index})" ${quest.claimed ? 'disabled' : ''}>
                ${quest.claimed ? 'Encargo solicitado' : 'Solicitar'}
            </button>
        `;
        return questEl;
    }

    function displayQuests() {
        noticeBoard.innerHTML = '';
        quests.forEach((quest, index) => {
            noticeBoard.appendChild(createQuestElement(quest, index));
        });
    }

    window.claimQuest = (index) => {
        quests[index].claimed = true;
        localStorage.setItem('quests', JSON.stringify(quests));
        displayQuests();
    };

    function addNewQuest(e) {
        e.preventDefault();
        
        const newQuest = {
            title: document.getElementById('questTitle').value,
            description: document.getElementById('questDescription').value,
            reward: document.getElementById('reward').value,
            difficulty: parseInt(document.querySelector('input[name="difficulty"]:checked').value),
            claimed: false
        };

        quests.unshift(newQuest);
        localStorage.setItem('quests', JSON.stringify(quests));
        displayQuests();
        questForm.reset();

        noticeBoard.firstChild.style.animation = 'addQuest 0.5s ease-out';
    }

    questForm.addEventListener('submit', addNewQuest);
    displayQuests();
});