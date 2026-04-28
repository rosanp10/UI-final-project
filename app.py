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
    selected_answer = request.form.get("answer")
    session["quiz_answer"] = selected_answer
    return redirect(url_for("results"))


@app.route("/results")
def results():
    selected_answer = session.get("quiz_answer")
    correct_answer = "competition"
    is_correct = selected_answer == correct_answer
    return render_template(
        "results.html",
        selected_answer=selected_answer,
        correct_answer=correct_answer,
        is_correct=is_correct,
    )


if __name__ == "__main__":
    app.run(debug=True)