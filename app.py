import os

from flask import Flask, redirect, render_template, request, session, url_for

app = Flask(__name__, template_folder="templates", static_folder="static")
app.secret_key = os.environ.get("SECRET_KEY", "dev-secret-key")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/lesson")
def lesson():
    return render_template("lesson.html")


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