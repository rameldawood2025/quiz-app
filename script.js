const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const startScreen = document.getElementById('start-screen');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const scoreContainer = document.getElementById('score-container');
const scoreText = document.getElementById('score-text');
const difficultySelect = document.getElementById('difficulty-select');
const progressBar = document.getElementById('progress-bar');
const timerDisplay = document.getElementById('timer');

let shuffledQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let countdown = null;
const QUESTION_TIME = 15;

startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  setNextQuestion();
});
restartButton.addEventListener('click', returnToStartScreen);

function startGame() {
  score = 0;
  clearInterval(countdown);
  startScreen.classList.add('hide');
  scoreContainer.classList.add('hide');
  questionContainerElement.classList.remove('hide');

  const selectedDifficulty = difficultySelect.value;
  const filtered = selectedDifficulty === 'all'
    ? questions
    : questions.filter(q => q.difficulty === selectedDifficulty);

  if (filtered.length === 0) {
    alert("No questions found for selected difficulty.");
    returnToStartScreen();
    return;
  }

  shuffledQuestions = filtered.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  setNextQuestion();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function returnToStartScreen() {
  clearInterval(countdown);
  questionContainerElement.classList.add('hide');
  scoreContainer.classList.add('hide');
  startScreen.classList.remove('hide');
  updateProgress(0);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setNextQuestion() {
  resetState();

  if (!shuffledQuestions[currentQuestionIndex]) {
    returnToStartScreen();
    return;
  }

  showQuestion(shuffledQuestions[currentQuestionIndex]);
  updateProgress((currentQuestionIndex + 1) / shuffledQuestions.length * 100);
  startTimer(QUESTION_TIME);
}

function showQuestion(question) {
  questionElement.innerText = question.question;
  answerButtonsElement.innerHTML = '';
  question.answers.forEach(answer => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    if (answer.correct) button.dataset.correct = answer.correct;
    button.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

function resetState() {
  clearInterval(countdown);
  clearStatusClass(document.body);
  nextButton.classList.add('hide');
  answerButtonsElement.innerHTML = '';
  timerDisplay.innerText = '';
}

function selectAnswer(e) {
  clearInterval(countdown);
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === 'true';
  if (correct) score++;

  setStatusClass(document.body, correct);
  Array.from(answerButtonsElement.children).forEach(button => {
    setStatusClass(button, button.dataset.correct === 'true');
    button.disabled = true;
  });

  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');
  } else {
    setTimeout(() => {
      showFinalScore();
    }, 800);
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  element.classList.add(correct ? 'correct' : 'wrong');
}

function clearStatusClass(element) {
  element.classList.remove('correct', 'wrong');
}

function updateProgress(percent) {
  progressBar.style.width = percent + '%';
}

function startTimer(seconds) {
  let timeLeft = seconds;
  timerDisplay.innerText = `${timeLeft}s`;

  countdown = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(countdown);

      setStatusClass(document.body, false);
      Array.from(answerButtonsElement.children).forEach(button => {
        const isCorrect = button.dataset.correct === 'true';
        setStatusClass(button, isCorrect);
        button.disabled = true;
      });

      if (shuffledQuestions.length > currentQuestionIndex + 1) {
        setTimeout(() => {
          currentQuestionIndex++;
          setNextQuestion();
        }, 1000);
      } else {
        setTimeout(() => {
          showFinalScore();
        }, 1000);
      }
    }
  }, 1000);
}

function showFinalScore() {
  questionContainerElement.classList.add('hide');
  scoreContainer.classList.remove('hide');
  scoreText.innerText = `You scored ${score} out of ${shuffledQuestions.length}!`;
  restartButton.innerText = 'Back to Start Screen';
}

const questions = [
  {
    question: 'What is 2 + 2?',
    answers: [{ text: '4', correct: true }, { text: '22', correct: false }],
    difficulty: 'easy'
  },
  {
    question: 'What is the capital of France?',
    answers: [
      { text: 'Berlin', correct: false },
      { text: 'Paris', correct: true },
      { text: 'Madrid', correct: false },
      { text: 'Rome', correct: false }
    ],
    difficulty: 'easy'
  },
  {
    question: 'What year was JavaScript created?',
    answers: [
      { text: '1995', correct: true },
      { text: '2005', correct: false },
      { text: '1989', correct: false },
      { text: '2000', correct: false }
    ],
    difficulty: 'medium'
  },
  {
    question: 'Which company developed React?',
    answers: [
      { text: 'Google', correct: false },
      { text: 'Facebook', correct: true },
      { text: 'Microsoft', correct: false },
      { text: 'Amazon', correct: false }
    ],
    difficulty: 'medium'
  },
  {
    question: 'What does CSS stand for?',
    answers: [
      { text: 'Creative Style System', correct: false },
      { text: 'Computer Style Sheets', correct: false },
      { text: 'Colorful Style Syntax', correct: false },
      { text: 'Cascading Style Sheets', correct: true }
    ],
    difficulty: 'easy'
  },
  {
    question: 'What does HTTP stand for?',
    answers: [
      { text: 'HyperText Transfer Protocol', correct: true },
      { text: 'HighText Transfer Protocol', correct: false },
      { text: 'HyperTransfer Text Protocol', correct: false },
      { text: 'Home Tool Transfer Protocol', correct: false }
    ],
    difficulty: 'medium'
  },
  {
    question: 'Which symbol is used for comments in JavaScript?',
    answers: [
      { text: '//', correct: true },
      { text: '/* */', correct: false },
      { text: '<!-- -->', correct: false },
      { text: '#', correct: false }
    ],
    difficulty: 'easy'
  },
  {
    question: 'Which HTML element is used to create a link?',
    answers: [
      { text: '<a>', correct: true },
      { text: '<link>', correct: false },
      { text: '<href>', correct: false },
      { text: '<button>', correct: false }
    ],
    difficulty: 'easy'
  },
  {
    question: 'Who wrote "To Kill a Mockingbird"?',
    answers: [
      { text: 'Harper Lee', correct: true },
      { text: 'Mark Twain', correct: false },
      { text: 'Ernest Hemingway', correct: false },
      { text: 'F. Scott Fitzgerald', correct: false }
    ],
    difficulty: 'hard'
  },
  {
    question: 'What is the output of `typeof null` in JavaScript?',
    answers: [
      { text: '"object"', correct: true },
      { text: '"null"', correct: false },
      { text: '"undefined"', correct: false },
      { text: '"function"', correct: false }
    ],
    difficulty: 'hard'
  },
  {
    question: 'Which method is used to round a number down in JavaScript?',
    answers: [
      { text: 'Math.round()', correct: false },
      { text: 'Math.floor()', correct: true },
      { text: 'Math.ceil()', correct: false },
      { text: 'Math.min()', correct: false }
    ],
    difficulty: 'medium'
  },
  {
    question: 'Which HTML tag is used to define a table row?',
    answers: [
      { text: '<tr>', correct: true },
      { text: '<td>', correct: false },
      { text: '<th>', correct: false },
      { text: '<row>', correct: false }
    ],
    difficulty: 'easy'
  }
];















