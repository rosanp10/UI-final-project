// ═══════════════════════════════════════════════
//  ANIMAL MATING TYPES – INTERACTIVE WEB GAME
//  script.js
// ═══════════════════════════════════════════════

// ─── State ───────────────────────────────────────
let currentLesson = 0;
const TOTAL_LESSONS = 5;

let currentQuestion = 0;
let score = 0;
let answers = [];         // { correct: bool, qIndex: number }

// ─── Quiz data ────────────────────────────────────
const QUESTIONS = [
  {
    category: "🦢 Monogamy",
    question: "Which mating strategy involves one animal pairing exclusively with a single partner, often sharing parenting duties?",
    options: [
      "Polygyny",
      "Monogamy",
      "Polyandry",
      "Promiscuity"
    ],
    correct: 1,
    explanation: "<strong>Monogamy</strong> is the strategy of pairing with a single partner. Both partners commonly share nest building, incubation, and chick-rearing duties — increasing offspring survival rates."
  },
  {
    category: "🦢 Monogamy",
    question: "Albatrosses are famous for being monogamous. Approximately how long can an albatross live?",
    options: [
      "Up to 20 years",
      "Up to 40 years",
      "Up to 70 years",
      "Up to 10 years"
    ],
    correct: 2,
    explanation: "Albatrosses can live up to <strong>70 years</strong> and often maintain the same partner for decades, performing elaborate dances each time they reunite after long migrations."
  },
  {
    category: "🦁 Polygyny",
    question: "In a polygynous mating system, how is the social arrangement structured?",
    options: [
      "One female mates with multiple males",
      "Animals mate randomly with no preference",
      "One male mates with multiple females",
      "All individuals pair with exactly one partner"
    ],
    correct: 2,
    explanation: "In <strong>polygyny</strong> one dominant male mates with multiple females. Males compete fiercely — through displays, roaring, or combat — driving the evolution of larger body size and ornaments in males."
  },
  {
    category: "🦁 Polygyny",
    question: "Male elephant seals can weigh up to how many times more than a female?",
    options: [
      "Twice as much",
      "Five times as much",
      "Ten times as much",
      "Same weight"
    ],
    correct: 2,
    explanation: "Male elephant seals can weigh up to <strong>ten times</strong> more than females. A dominant 'beach-master' defends a harem of up to 100 females — most males never successfully mate."
  },
  {
    category: "🐠 Polyandry",
    question: "In polyandrous species, which sex typically takes on incubation or brooding duties?",
    options: [
      "The female, who broods all clutches",
      "The male, in a sex-role reversal",
      "Duties are always split equally",
      "Neither parent; eggs are abandoned"
    ],
    correct: 1,
    explanation: "In polyandrous species there is a fascinating <strong>sex-role reversal</strong>: females are often larger and more colorful, while males handle incubation. Seahorse males even carry the pregnancy in a brood pouch."
  },
  {
    category: "🐒 Promiscuity",
    question: "Which evolutionary phenomenon explains why promiscuous species often evolve larger testes relative to body size?",
    options: [
      "Genetic drift",
      "Sperm competition",
      "Kin selection",
      "Sexual imprinting"
    ],
    correct: 1,
    explanation: "<strong>Sperm competition</strong> occurs when the sperm of multiple males compete inside a female's reproductive tract. Species like chimpanzees evolved much larger testes than gorillas — who live in harems with far less sperm competition."
  },
  {
    category: "🦚 Sexual Selection",
    question: "What is a 'lek' in the context of animal mating?",
    options: [
      "A type of nest used by monogamous birds",
      "A communal display arena where males compete for female attention",
      "The act of a male guarding resources to attract females",
      "A female-controlled territory"
    ],
    correct: 1,
    explanation: "A <strong>lek</strong> is a communal arena where males gather purely to display and compete. Females visit, compare the males, and choose mates. No territory or resources are defended — it is all about performance."
  },
  {
    category: "🦚 Sexual Selection",
    question: "According to Darwin, the peacock's extravagant tail evolved mainly because of…",
    options: [
      "Natural selection for camouflage",
      "Mimicry of predators",
      "Sexual selection driven by female mate choice",
      "Protection from parasites"
    ],
    correct: 2,
    explanation: "<strong>Sexual selection</strong> driven by female mate choice explains costly ornaments like the peacock's tail. Females consistently choose the most elaborate males, so genes for large tails spread even though the tail impairs flight and attracts predators."
  }
];

// ─── Screen navigation ────────────────────────────
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) {
    target.classList.add("active");
    target.scrollTop = 0;
  }
}

// ─── Intro ────────────────────────────────────────
function startGame() {
  currentLesson = 0;
  showLesson(0);
  showScreen("screen-videos");
  updateVideoProgress();
}

// ─── Lesson navigation ────────────────────────────
function showLesson(index) {
  document.querySelectorAll(".lesson").forEach(l => l.classList.remove("active"));
  const lesson = document.getElementById("lesson-" + index);
  if (lesson) lesson.classList.add("active");
  currentLesson = index;
  updateVideoProgress();
}

function nextLesson(fromIndex) {
  if (fromIndex < TOTAL_LESSONS - 1) showLesson(fromIndex + 1);
}

function prevLesson(fromIndex) {
  if (fromIndex > 0) showLesson(fromIndex - 1);
}

function updateVideoProgress() {
  const pct = ((currentLesson + 1) / TOTAL_LESSONS) * 100;
  document.getElementById("video-progress").style.width = pct + "%";
  document.getElementById("video-counter").textContent =
    (currentLesson + 1) + " / " + TOTAL_LESSONS;
}

// ─── Quiz setup ───────────────────────────────────
function showQuiz() {
  score = 0;
  currentQuestion = 0;
  answers = [];
  renderQuestion();
  showScreen("screen-quiz");
  updateQuizProgress();
}

function backToVideos() {
  showScreen("screen-videos");
  showLesson(currentLesson);
}

function renderQuestion() {
  const q = QUESTIONS[currentQuestion];
  const letters = ["A", "B", "C", "D"];
  const isLast = currentQuestion === QUESTIONS.length - 1;

  const optionsHtml = q.options.map((opt, i) => `
    <li>
      <button class="option-btn" onclick="selectAnswer(${i})" id="opt-${i}">
        <span class="option-letter">${letters[i]}</span>
        <span>${opt}</span>
      </button>
    </li>
  `).join("");

  document.getElementById("quiz-container").innerHTML = `
    <div class="question-card">
      <div class="q-category">${q.category}</div>
      <p class="question-text">${currentQuestion + 1}. ${q.question}</p>
      <ul class="options-list">${optionsHtml}</ul>
      <div class="explanation" id="explanation"></div>
      <div class="quiz-nav">
        <button class="btn btn-primary" id="next-btn" onclick="nextQuestion()" style="display:none;">
          ${isLast ? "See Results 🏆" : "Next Question →"}
        </button>
      </div>
    </div>
  `;
  updateQuizProgress();
}

function selectAnswer(selectedIndex) {
  const q = QUESTIONS[currentQuestion];
  const isCorrect = selectedIndex === q.correct;

  // Disable all options
  document.querySelectorAll(".option-btn").forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct");
    else if (i === selectedIndex && !isCorrect) btn.classList.add("wrong");
  });

  // Show explanation
  const expEl = document.getElementById("explanation");
  expEl.innerHTML = (isCorrect ? "✅ Correct! " : "❌ Not quite. ") + q.explanation;
  expEl.classList.add("visible");

  if (isCorrect) score++;
  answers.push({ qIndex: currentQuestion, correct: isCorrect });

  // Show next button
  document.getElementById("next-btn").style.display = "inline-flex";
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion < QUESTIONS.length) {
    renderQuestion();
  } else {
    showResults();
  }
}

function updateQuizProgress() {
  const pct = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  document.getElementById("quiz-progress").style.width = pct + "%";
  document.getElementById("quiz-counter").textContent =
    "Q " + (currentQuestion + 1) + " / " + QUESTIONS.length;
}

// ─── Results ──────────────────────────────────────
function showResults() {
  const total = QUESTIONS.length;
  const pct = score / total;

  let emoji, title, subtitle;
  if (pct === 1) {
    emoji = "🏆"; title = "Perfect Score!";
    subtitle = "Incredible! You aced every question. You're a true expert on animal mating systems!";
  } else if (pct >= 0.75) {
    emoji = "🌟"; title = "Great Job!";
    subtitle = "You have a strong understanding of animal mating strategies. Just a couple of things to review!";
  } else if (pct >= 0.5) {
    emoji = "👍"; title = "Good Effort!";
    subtitle = "You're on the right track! Try rewatching the video lessons to reinforce the concepts.";
  } else {
    emoji = "📚"; title = "Keep Learning!";
    subtitle = "No worries — these concepts take a bit of time to sink in. Review the videos and give it another go!";
  }

  document.getElementById("result-emoji").textContent = emoji;
  document.getElementById("result-title").textContent = title;
  document.getElementById("result-subtitle").textContent = subtitle;
  document.getElementById("score-num").textContent = score;

  // Breakdown grid
  const breakdownHtml = QUESTIONS.map((q, i) => {
    const ans = answers.find(a => a.qIndex === i);
    const isCorrect = ans && ans.correct;
    return `<div class="breakdown-item ${isCorrect ? "correct" : "wrong"}">
      ${isCorrect ? "✅" : "❌"} Q${i + 1}: ${q.category.split(" ")[0]}
    </div>`;
  }).join("");
  document.getElementById("result-breakdown").innerHTML = breakdownHtml;

  // Animate ring
  const circumference = 314; // 2 * π * 50
  const offset = circumference - (pct * circumference);
  // color based on score
  const ringEl = document.getElementById("ring-fill");
  if (pct >= 0.75) ringEl.style.stroke = "#3fb950";
  else if (pct >= 0.5) ringEl.style.stroke = "#d29922";
  else ringEl.style.stroke = "#f85149";

  showScreen("screen-results");
  // Trigger animation after render
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ringEl.style.strokeDashoffset = offset;
    });
  });
}

function retakeQuiz() {
  showQuiz();
}
