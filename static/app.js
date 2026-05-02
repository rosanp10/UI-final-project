document.addEventListener('DOMContentLoaded', () => {
	const beginLessonButton = document.getElementById('begin-lesson-btn');
	const slidesContainer = document.getElementById('lesson-slides');

	if (!beginLessonButton || !slidesContainer) {
		return;
	}

	const slides = Array.from(slidesContainer.querySelectorAll('.slide'));
	const prevBtn = document.getElementById('prev-slide');
	const nextBtn = document.getElementById('next-slide');
	const continueBtn = document.getElementById('continue-quiz');
	let currentIndex = 0;

	function showSlide(index) {
		if (index < 0) index = 0;
		if (index >= slides.length) index = slides.length - 1;
		slides.forEach((s, i) => { s.style.display = i === index ? 'block' : 'none'; });
		currentIndex = index;
		if (prevBtn) prevBtn.style.display = currentIndex === 0 ? 'none' : 'inline-block';
		if (nextBtn) nextBtn.style.display = currentIndex === slides.length - 1 ? 'none' : 'inline-block';
		if (continueBtn) continueBtn.style.display = currentIndex === slides.length - 1 ? 'inline-block' : 'none';
	}

	beginLessonButton.addEventListener('click', () => {
		slidesContainer.style.display = 'block';
		showSlide(0);
		slidesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
	});

	if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
	if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
});

// Quiz navigation
document.addEventListener('DOMContentLoaded', () => {
	const quizForm = document.getElementById('quiz-form');
	const quizQuestions = document.querySelectorAll('.quiz-question');
	const quizTitle = document.getElementById('quiz-title');
	const prevBtn = document.getElementById('quiz-prev-btn');
	const nextBtn = document.getElementById('quiz-next-btn');
	const submitBtn = document.getElementById('quiz-submit-btn');
	const errorMsg = document.getElementById('quiz-error');
	const errorCloseBtn = document.getElementById('quiz-error-close');

	if (!quizForm || quizQuestions.length === 0) {
		return;
	}

	let currentQuestion = 0;

	function isAnswered(questionIndex) {
		const answerName = `answer${questionIndex + 1}`;
		return document.querySelector(`input[name="${answerName}"]:checked`) !== null;
	}

	function areAllAnswered() {
		for (let i = 0; i < quizQuestions.length; i++) {
			if (!isAnswered(i)) return false;
		}
		return true;
	}

	function updateSubmitButton() {
		if (currentQuestion === quizQuestions.length - 1) {
			if (areAllAnswered()) {
				submitBtn.disabled = false;
				submitBtn.classList.remove('disabled');
			} else {
				submitBtn.disabled = true;
				submitBtn.classList.add('disabled');
			}
		}
	}

	function showError() {
		errorMsg.style.display = 'block';
		setTimeout(() => {
			if (errorMsg.style.display === 'block') {
				errorMsg.style.display = 'none';
			}
		}, 4000);
	}

	function hideError() {
		errorMsg.style.display = 'none';
	}

	function showQuestion(index) {
		if (index < 0) index = 0;
		if (index >= quizQuestions.length) index = quizQuestions.length - 1;
		
		quizQuestions.forEach((q, i) => {
			q.style.display = i === index ? 'block' : 'none';
		});
		
		currentQuestion = index;
		quizTitle.textContent = `Question ${index + 1} of ${quizQuestions.length}`;
		
		prevBtn.style.display = currentQuestion === 0 ? 'none' : 'inline-block';
		nextBtn.style.display = currentQuestion === quizQuestions.length - 1 ? 'none' : 'inline-block';
		submitBtn.style.display = currentQuestion === quizQuestions.length - 1 ? 'inline-block' : 'none';
		
		updateSubmitButton();
		hideError();
	}

	if (prevBtn) prevBtn.addEventListener('click', () => showQuestion(currentQuestion - 1));
	
	if (nextBtn) {
		nextBtn.addEventListener('click', () => {
			if (isAnswered(currentQuestion)) {
				showQuestion(currentQuestion + 1);
			} else {
				showError();
			}
		});
	}

	if (errorCloseBtn) {
		errorCloseBtn.addEventListener('click', hideError);
	}

	// Validate on form submit
	quizForm.addEventListener('submit', (e) => {
		if (!areAllAnswered()) {
			e.preventDefault();
			showError();
		}
	});

	// Update submit button when any answer changes
	document.querySelectorAll('input[type="radio"]').forEach(input => {
		input.addEventListener('change', updateSubmitButton);
	});

	// Initialize first question
	showQuestion(0);
});
