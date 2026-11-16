const questions = [
  { q: "Which keyword declares a constant?", options: ["var", "let", "const", "static"], answer: 2, explain: "const creates a variable that cannot be reassigned." },
  { q: "What does typeof null return?", options: ["null", "object", "undefined", "number"], answer: 1, explain: "This is an old bug in JS: typeof null is 'object'." },
  { q: "What is 2 + '2'?", options: ["4", "22", "NaN", "Error"], answer: 1, explain: "The number is converted to a string, so they are joined: '22'." },
  { q: "Which method adds an item to the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], answer: 0, explain: "push() adds to the end. unshift() adds to the start." },
  { q: "Which method removes the last item of an array?", options: ["shift()", "pop()", "splice()", "slice()"], answer: 1, explain: "pop() removes and returns the last element." },
  { q: "What does === check?", options: ["Value only", "Type only", "Value and type", "Nothing"], answer: 2, explain: "=== is strict equality: both value and type must match." },
  { q: "What is the result of '5' == 5?", options: ["true", "false", "undefined", "Error"], answer: 0, explain: "== converts types before comparing, so '5' becomes 5." },
  { q: "Which one is NOT a JS data type?", options: ["string", "boolean", "float", "undefined"], answer: 2, explain: "JS has only 'number' for all numbers, no separate float type." },
  { q: "How do you write a single-line comment?", options: ["<!-- -->", "#", "//", "**"], answer: 2, explain: "// starts a single-line comment in JS." },
  { q: "What does NaN mean?", options: ["Not a Null", "Not a Number", "New a Number", "Null and Nothing"], answer: 1, explain: "NaN stands for Not a Number." },
  { q: "Which function prints to the browser console?", options: ["print()", "console.log()", "echo()", "write()"], answer: 1, explain: "console.log() prints messages to the console." },
  { q: "What is the value of a variable declared but not assigned?", options: ["null", "0", "undefined", "''"], answer: 2, explain: "Declared but unassigned variables are undefined." },
  { q: "Which method turns a JSON string into an object?", options: ["JSON.stringify()", "JSON.parse()", "JSON.object()", "JSON.convert()"], answer: 1, explain: "JSON.parse() converts a JSON string into a JS object." },
  { q: "Which method turns an object into a JSON string?", options: ["JSON.parse()", "JSON.toString()", "JSON.stringify()", "JSON.text()"], answer: 2, explain: "JSON.stringify() converts an object into a JSON string." },
  { q: "What does arr.length give for [1, 2, 3]?", options: ["2", "3", "4", "undefined"], answer: 1, explain: "The array has 3 items, so length is 3." },
  { q: "Which loop runs at least once?", options: ["for", "while", "do...while", "for...of"], answer: 2, explain: "do...while checks the condition after running the body." },
  { q: "What does Math.floor(4.7) return?", options: ["4", "5", "4.7", "5.0"], answer: 0, explain: "Math.floor() rounds down to the nearest whole number." },
  { q: "Which method creates a new array by changing each item?", options: ["forEach()", "map()", "filter()", "find()"], answer: 1, explain: "map() returns a new array with each item transformed." },
  { q: "Which method keeps only the items that pass a test?", options: ["map()", "reduce()", "filter()", "some()"], answer: 2, explain: "filter() returns a new array with items that pass the test." },
  { q: "How do you select an element by id?", options: ["document.getElementById()", "document.getId()", "document.id()", "document.query()"], answer: 0, explain: "getElementById() finds an element using its id." },
  { q: "Which event fires when a button is clicked?", options: ["hover", "click", "press", "change"], answer: 1, explain: "The 'click' event fires on a mouse click." },
  { q: "What does setTimeout() do?", options: ["Repeats code forever", "Runs code once after a delay", "Stops the program", "Pauses the browser"], answer: 1, explain: "setTimeout() runs a function once after the given time." },
  { q: "What does setInterval() do?", options: ["Runs code once", "Runs code again and again", "Clears a timer", "Nothing"], answer: 1, explain: "setInterval() runs a function repeatedly at a fixed delay." },
  { q: "Which is the correct arrow function?", options: ["function => {}", "() => {}", "=> () {}", "fn() -> {}"], answer: 1, explain: "Arrow functions are written as () => {}." },
  { q: "What is the result of Boolean(0)?", options: ["true", "false", "0", "undefined"], answer: 1, explain: "0 is a falsy value, so Boolean(0) is false." }
];

const progressEl = document.getElementById("progress");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const explanationEl = document.getElementById("explanation");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const quizEl = document.getElementById("quiz");
const resultEl = document.getElementById("result");
const finalScoreEl = document.getElementById("finalScore");
const ratingEl = document.getElementById("rating");
const reviewBtn = document.getElementById("reviewBtn");
const reviewEl = document.getElementById("review");

let current = 0;
let score = 0;
let wrongAnswers = [];
let timeLeft = 30;
let timer;

function showQuestion() {
  const item = questions[current];
  progressEl.textContent = "Q " + (current + 1) + "/" + questions.length;
  scoreEl.textContent = "Score: " + score;
  questionEl.textContent = item.q;
  explanationEl.textContent = "";
  nextBtn.disabled = true;
  optionsEl.innerHTML = "";

  item.options.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = text;
    btn.onclick = () => selectAnswer(i);
    optionsEl.appendChild(btn);
  });

  startTimer();
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 30;
  timerEl.textContent = "Time: " + timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = "Time: " + timeLeft;
    if (timeLeft === 0) {
      selectAnswer(-1); // -1 means no option chosen (time ran out)
    }
  }, 1000);
}

function selectAnswer(chosen) {
  clearInterval(timer);
  const item = questions[current];
  const buttons = optionsEl.querySelectorAll(".option");

  buttons.forEach((btn) => (btn.disabled = true));
  buttons[item.answer].classList.add("correct");

  if (chosen === item.answer) {
    score++;
  } else {
    if (chosen !== -1) buttons[chosen].classList.add("wrong");
    wrongAnswers.push({
      q: item.q,
      yours: chosen === -1 ? "Time ran out" : item.options[chosen],
      correct: item.options[item.answer],
      explain: item.explain
    });
  }

  scoreEl.textContent = "Score: " + score;
  explanationEl.textContent = item.explain;
  nextBtn.disabled = false;
}

function showResult() {
  quizEl.classList.add("hidden");
  resultEl.classList.remove("hidden");
  reviewEl.classList.add("hidden");
  finalScoreEl.textContent = "Final score: " + score + "/" + questions.length;

  const percent = (score / questions.length) * 100;
  if (percent === 100) ratingEl.textContent = "Perfect! You are a JS master!";
  else if (percent >= 70) ratingEl.textContent = "Great job!";
  else if (percent >= 40) ratingEl.textContent = "Not bad, keep practicing.";
  else ratingEl.textContent = "Keep learning, you will get better!";

  reviewBtn.style.display = wrongAnswers.length ? "inline-block" : "none";
}

function showReview() {
  reviewEl.innerHTML = "<h3>Wrong answers</h3>";
  wrongAnswers.forEach((w) => {
    reviewEl.innerHTML +=
      "<p><b>" + w.q + "</b><br>" +
      "Your answer: " + w.yours + "<br>" +
      "Correct answer: " + w.correct + "<br>" +
      w.explain + "</p>";
  });
  reviewEl.classList.remove("hidden");
}

function restart() {
  current = 0;
  score = 0;
  wrongAnswers = [];
  resultEl.classList.add("hidden");
  quizEl.classList.remove("hidden");
  showQuestion();
}

nextBtn.onclick = () => {
  current++;
  if (current < questions.length) showQuestion();
  else showResult();
};

restartBtn.onclick = restart;
reviewBtn.onclick = showReview;

showQuestion();
