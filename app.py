import os

from flask import Flask, redirect, render_template, request, session, url_for

app = Flask(__name__, template_folder="templates", static_folder="static")
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key")

LESSON_PAGES = [
    {
        "title": "Competition: Strength & Dominance",
        "summary": "Some animals compete physically, and the strongest gains access to mates.",
        "detail": "Competition happens when animals fight or show dominance to win mating opportunities.",
        "video_url": "https://www.youtube.com/embed/wm-fZ-20rOc?si=aleZFe1KBQgEIVXg&amp;start=18",
        "example": "Deer competing for mates",
        "background": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
    },
    {
        "title": "Courtship: Rituals & Gifts",
        "summary": "Animals may dance, bring gifts, or perform complex rituals to attract and bond with a mate.",
        "detail": "Courtship behavior uses actions and signals that help a potential mate recognize interest and fitness.",
        "video_url": "https://www.youtube.com/embed/Azra2UVOwao?si=r9ImqvWpqaNAdbmb&amp;start=18",
        "example": "Penguins or birds",
        "background": "https://images.unsplash.com/photo-1501706362039-c6e80948b7b0?auto=format&fit=crop&w=1600&q=80",
    },
    {
        "title": "Visual Attraction: Displays & Color",
        "summary": "Bright colors and elaborate displays signal health and vitality to potential mates.",
        "detail": "Visual attraction relies on appearance, patterns, and display behaviors to stand out.",
        "video_url": "https://www.youtube.com/embed/rX40mBb8bkU?si=8KIfQBbQW61EZoa6&amp;start=58",
        "example": "Peacock or Bird of Paradise",
        "background": "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1600&q=80",
    },
]

@app.route("/")
def index():
    return render_template("index.html", lesson_count=len(LESSON_PAGES), question_count=4)

@app.route("/lesson")
def lesson():
    return render_template("lesson.html")


@app.route("/lesson/<int:lesson_number>")
def lesson_page(lesson_number):
    if lesson_number < 1 or lesson_number > len(LESSON_PAGES):
        return redirect(url_for("lesson"))

    lesson = LESSON_PAGES[lesson_number - 1].copy()
    total_lessons = len(LESSON_PAGES)
    lesson.update({
        "number": lesson_number,
        "total": total_lessons,
        "progress_percent": round((lesson_number / total_lessons) * 100),
    })
    return render_template("lesson_page.html", lesson=lesson)


@app.route("/lesson/review")
def lesson_review():
    lessons = []
    for i, lesson_data in enumerate(LESSON_PAGES):
        lesson = lesson_data.copy()
        lesson.update({
            "number": i + 1,
            "total": len(LESSON_PAGES),
        })
        lessons.append(lesson)
    return render_template("lesson_review.html", lessons=lessons)


@app.route("/quiz")
def quiz():
    return render_template("quiz.html")


@app.route("/quiz", methods=["POST"])
def quiz_submit():
    answer1 = request.form.get("answer1")
    answer2 = request.form.get("answer2")
    answer3 = request.form.get("answer3")
    answer4 = request.form.get("answer4")
    session["quiz_answer1"] = answer1
    session["quiz_answer2"] = answer2
    session["quiz_answer3"] = answer3
    session["quiz_answer4"] = answer4
    return redirect(url_for("results"))


@app.route("/results")
def results():
    answer1 = session.get("quiz_answer1")
    answer2 = session.get("quiz_answer2")
    answer3 = session.get("quiz_answer3")
    answer4 = session.get("quiz_answer4")
    correct_answer1 = "competition"
    correct_answer2 = "visual display"
    correct_answer3 = "courtship behavior"
    correct_answer4 = "visual attraction"
    is_correct1 = answer1 == correct_answer1
    is_correct2 = answer2 == correct_answer2
    is_correct3 = answer3 == correct_answer3
    is_correct4 = answer4 == correct_answer4
    total_correct = sum([is_correct1, is_correct2, is_correct3, is_correct4])
    return render_template(
        "results.html",
        answer1=answer1,
        correct_answer1=correct_answer1,
        is_correct1=is_correct1,
        answer2=answer2,
        correct_answer2=correct_answer2,
        is_correct2=is_correct2,
        answer3=answer3,
        correct_answer3=correct_answer3,
        is_correct3=is_correct3,
        answer4=answer4,
        correct_answer4=correct_answer4,
        is_correct4=is_correct4,
        total_correct=total_correct,
    )


if __name__ == "__main__":
    app.run(debug=True)