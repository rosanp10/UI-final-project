document.addEventListener('DOMContentLoaded', () => {
	const beginLessonButton = document.getElementById('begin-lesson-btn');
	const lessonVideoSection = document.getElementById('lesson-video');

	if (!beginLessonButton || !lessonVideoSection) {
		return;
	}

	beginLessonButton.addEventListener('click', () => {
		lessonVideoSection.style.display = 'block';
		lessonVideoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
	});
});
