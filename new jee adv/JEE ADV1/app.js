// ----------------------
// Question Data
// ----------------------
const questions = [
    // Example Physics questions with images
    { id: 1, sub: 'Physics', type: 'SCQ', img: 'images/q1.jpeg', ans: "B" },
    { id: 2, sub: 'Physics', type: 'SCQ', img: 'images/q2.jpeg', ans: "C" }
];

// Placeholder data for Chemistry & Mathematics
for (let i = 3; i <= 52; i++) {
    let sub = i <= 18 ? 'Physics' : (i <= 35 ? 'Chemistry' : 'Mathematics');
    questions.push({ id: i, sub: sub, type: 'SCQ', img: `images/q${i}.jpeg`, ans: "A" });
}

let currentQIdx = 0;
let userAnswers = {};
let timeLeft = 180 * 60;

// ----------------------
// Render Question
// ----------------------
function renderQuestion() {
    const q = questions[currentQIdx];
    document.getElementById('q-title').innerText = `${q.sub} - Question ${q.id}`;

    // Show question image
    const qTextEl = document.getElementById('q-text');
    qTextEl.innerHTML = `<img src="${q.img}" alt="Question ${q.id}" style="max-width:100%; height:auto;">`;

    // Show answer choices (A–D)
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    ['A', 'B', 'C', 'D'].forEach(letter => {
        const div = document.createElement('div');
        div.innerHTML = `
            <label>
                <input type="radio" name="q-opt" value="${letter}" ${userAnswers[q.id] === letter ? 'checked' : ''}>
                ${letter}
            </label>
        `;
        div.style.margin = "10px 0";
        container.appendChild(div);
    });

    updateGrid();
}

// ----------------------
// Update Question Palette
// ----------------------
function updateGrid() {
    const grid = document.getElementById('q-grid');
    grid.innerHTML = '';
    questions.filter(q => q.sub === questions[currentQIdx].sub).forEach(q => {
        const div = document.createElement('div');
        div.className = `q-num ${userAnswers[q.id] ? 'answered' : ''} ${questions[currentQIdx].id === q.id ? 'current' : ''}`;
        div.innerText = q.id;
        div.onclick = () => { currentQIdx = questions.findIndex(item => item.id === q.id); renderQuestion(); };
        grid.appendChild(div);
    });
}

// ----------------------
// Navigation
// ----------------------
function saveAndNext() {
    const selected = document.querySelector('input[name="q-opt"]:checked');
    if (selected) userAnswers[questions[currentQIdx].id] = selected.value;
    if (currentQIdx < questions.length - 1) {
        currentQIdx++;
        renderQuestion();
    }
}

function prevQuestion() {
    if (currentQIdx > 0) {
        currentQIdx--;
        renderQuestion();
    }
}

function switchSubject(sub) {
    currentQIdx = questions.findIndex(q => q.sub === sub);
    renderQuestion();
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
}

// ----------------------
// Submit Test
// ----------------------
function submitTest() {
    clearInterval(timerInterval);
    document.getElementById('test-view').style.display = 'none';
    document.getElementById('control-bar').style.display = 'none';
    const resultView = document.getElementById('result-view');
    resultView.style.display = 'block';

    // Marking Logic (simple demo)
    let total = 0;
    questions.forEach(q => {
        if (userAnswers[q.id] === q.ans) total += 4;
    });

    document.getElementById('score-details').innerHTML = `
        <p>Physics: +${Math.floor(total/3)}</p>
        <p>Chemistry: +${Math.floor(total/3)}</p>
        <p>Mathematics: +${Math.floor(total/3)}</p>
        <hr>
        <h3>Total Score: ${total} / 180</h3>
    `;
}

// ----------------------
// Timer
// ----------------------
const timerInterval = setInterval(() => {
    timeLeft--;
    let m = Math.floor(timeLeft / 60);
    let s = timeLeft % 60;
    document.getElementById('timer').innerText = `${m}:${s < 10 ? '0' : ''}${s}`;
    if (timeLeft <= 0) submitTest();
}, 1000);

// ----------------------
// Initialize
// ----------------------
renderQuestion();