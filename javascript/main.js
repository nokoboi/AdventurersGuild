// Importa Firebase y Realtime Database
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, get, set, update, push, onValue } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAIYlr1_w2jwLtdfKiG9aH84ai0sD9tmGM",
  authDomain: "gremio-de-aventureros.firebaseapp.com",
  databaseURL: "https://gremio-de-aventureros-default-rtdb.firebaseio.com",
  projectId: "gremio-de-aventureros",
  storageBucket: "gremio-de-aventureros.appspot.com",
  messagingSenderId: "947290324879",
  appId: "1:947290324879:web:676f538f91e1b0376155fa",
  measurementId: "G-JLJ3Q1REB0"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Referencia a la colección (Realtime Database usa "rutas")
const questsRef = ref(db, "quests");

document.addEventListener('DOMContentLoaded', () => {
    const noticeBoard = document.getElementById('noticeBoard');
    const questForm = document.getElementById('questForm');

    function getStars(difficulty) {
        return '★'.repeat(difficulty) + '☆'.repeat(5 - difficulty);
    }

    function createQuestElement(quest, id) {
        const questEl = document.createElement('div');
        questEl.className = `quest-notice ${quest.claimed ? 'claimed' : ''}`;
        questEl.innerHTML = `
            <div class="stars">${getStars(quest.difficulty)}</div>
            <h3>${quest.title}</h3>
            <p>${quest.description}</p>
            <div class="reward">Recompensa: ${quest.reward}</div>
            <button class="claim-btn" onclick="window.claimQuest('${id}')" ${quest.claimed ? 'disabled' : ''}>
                ${quest.claimed ? 'Encargo solicitado' : 'Solicitar'}
            </button>
        `;
        return questEl;
    }

    async function displayQuests() {
        noticeBoard.innerHTML = '';
        onValue(questsRef, (snapshot) => {
            const quests = snapshot.val();
            for (const [id, quest] of Object.entries(quests || {})) {
                const questEl = createQuestElement(quest, id);
                noticeBoard.appendChild(questEl);
            }
        });
    }

    window.claimQuest = async (id) => {
        const questRef = ref(db, `quests/${id}`);
        await update(questRef, { claimed: true });
        displayQuests();
    };

    async function addNewQuest(e) {
        e.preventDefault();

        const newQuest = {
            title: document.getElementById('questTitle').value,
            description: document.getElementById('questDescription').value,
            reward: document.getElementById('reward').value,
            difficulty: parseInt(document.querySelector('input[name="difficulty"]:checked').value),
            claimed: false
        };

        const newQuestRef = push(questsRef); // Crea una nueva entrada en Realtime Database
        await set(newQuestRef, newQuest);
        displayQuests();
        questForm.reset();

        noticeBoard.firstChild.style.animation = 'addQuest 0.5s ease-out';
    }

    questForm.addEventListener('submit', addNewQuest);
    displayQuests(); // Carga inicial de misiones
});
