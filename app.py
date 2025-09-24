from datetime import datetime
import os
import smtplib
from email.mime.text import MIMEText
from urllib.parse import quote
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
"""Flask app serving an interactive resume for Óscar García Martínez."""


@app.template_filter("format_date")
def format_date(value):
    if isinstance(value, datetime):
        return value.strftime("%d %b %Y")
    return value


@app.route("/")
def index():
    return render_template("resume.html", data=RESUME)


# ====== Resume/Portfolio Data (English) ======
RESUME = {
    "name": "ÓSCAR GARCÍA MARTÍNEZ",
    "tagline": "Problem Solver · Data Scientist · AI Engineer",
    "contacts": {
        "phone": "+34 611 32 38 65",
        "emails": [
            "ogarmar@etsinf.upv.es",
            "oscar.garcia-martinez@uni-konstanz.de",
            "oscargarciatrabajos@gmail.com",
        ],
        "address": "",
        "birthday": "",
        "github": "https://github.com/ogarmar",
        "linkedin": "https://www.linkedin.com/in/ogarmar/",
    },
    "education": [
        {
            "title": "Bachelor's Degree in Data Science",
            "institution": "Universitat Politècnica de València",
            "status": "Currently Enrolled",
        }
    ],
    "languages": [
        {"name": "Spanish", "level": "Native"},
        {"name": "English", "level": "Official B2 (Cambridge)"},
    ],
    "experience": [
        {
            "company": "Urobora",
            "sector": "IT/Software – Consulting",
            "role": "Computer Applications Programmer",
            "summary": "Development of AI teams and tools for system-to-system communication",
            "start": "2024-10",
            "end": "2025-06",
            "highlights": [
                "Built AI tooling to bridge and orchestrate communications between services",
                "Contributed to applied ML/NLP components integrated into internal workflows",
            ],
        }
    ],
    "projects": [
        {
            "title": "AI Chatbot with RAG (University Regulations)",
            "description": "Question-answering chatbot grounded on university regulations using Retrieval-Augmented Generation.",
            "tags": ["AI", "RAG", "NLP", "LLMs", "Python"],
            "url": "https://github.com/Marxx01/RAGtor-UPV",
            "minor": False,
        },
        {
            "title": "Regressive and Predictive Analysis of Energy Sources in Europe",
            "description": "Exploratory, regression and forecasting analysis over European energy datasets.",
            "tags": ["Data Analysis", "Regression", "Forecasting", "Python"],
            "url": None,
            "minor": False,
        },
        {
            "title": "Telegram Bot for Real-time Crypto Information",
            "description": "Bot delivering price updates and alerts for cryptocurrencies in real time.",
            "tags": ["Telegram", "APIs", "Python"],
            "url": None,
            "minor": False,
        },
        {
            "title": "Valencia Agro-study (minor project)",
            "description": "Small-scale data analysis workflow around Valencia water and crops.",
            "tags": ["Python", "Data Analysis"],
            "url": "https://github.com/ogarmar/EMD-VLC-agrostudy",
            "minor": True,
        },
    ],
    "skills": [
        "Analysis and problem-solving",
        "Lifelong learning",
        "Specific instrumentation",
        "Effective communication",
        "Application and practical thinking",
        "Planning and time management",
        "Innovation, creativity, and entrepreneurship",
        "Comprehension and Integration",
        "Teamwork and leadership",
    ],
    "technologies": [
        "LaTeX",
        "Python",
        "Excel",
        "R",
        "Artificial Intelligence",
        "LLM editing",
        "NLP",
        "RAG",
        "Word",
        "Power BI",
        "Internet",
        "Video editing",
        "MATLAB",
    ],
    "skill_chart": {
        "axes": [
        "Analysis and problem-solving",
        "Lifelong learning",
        "Specific instrumentation",
        "Effective communication",
        "Application and practical thinking",
        "Planning and time management",
        "Innovation, creativity, and entrepreneurship",
        "Comprehension and Integration",
        "Teamwork and leadership",
        ],
        "values": [99, 93, 93, 97, 97, 93, 97, 99, 93],
    },
    "graph_overrides": {},
}


@app.route("/resume")
def resume():
    return render_template("resume.html", data=RESUME)


@app.route("/contact", methods=["POST"])
def contact():
    # Aceptar JSON o formulario application/x-www-form-urlencoded
    payload = request.get_json(silent=True)
    if not payload:
        # fallback a form data
        payload = request.form.to_dict() if request.form else {}

    sender_email = payload.get("email")
    sender_name = payload.get("name")
    message = payload.get("message")
    when = payload.get("when")

    if not sender_email or not message:
        return jsonify({"ok": False, "error": "Missing fields"}), 400

    target = "oscargarciatrabajos@gmail.com"
    subject = f"[Resume] Message from {sender_name or 'Anonymous'}"
    body = f"From: {sender_name or 'Anonymous'} <{sender_email}>\nWhen: {when or 'n/a'}\n\n{message}"

    host = os.environ.get("SMTP_HOST")
    user = os.environ.get("SMTP_USER")
    password = os.environ.get("SMTP_PASS")
    port = int(os.environ.get("SMTP_PORT", "587"))
    use_tls = os.environ.get("SMTP_TLS", "true").lower() != "false"

    if host and user and password:
        try:
            msg = MIMEText(body)
            msg["Subject"] = subject
            msg["From"] = user
            msg["To"] = target

            with smtplib.SMTP(host, port, timeout=10) as smtp:
                if use_tls:
                    smtp.starttls()
                smtp.login(user, password)
                smtp.send_message(msg)
            return jsonify({"ok": True})
        except Exception as e:
            return jsonify({"ok": False, "error": str(e)}), 500

    # Fallback: return web compose URLs so you can choose Gmail/Yahoo/Outlook in the browser
    gmail = (
        "https://mail.google.com/mail/?view=cm&fs=1&to="
        + quote(target)
        + "&su="
        + quote(subject)
        + "&body="
        + quote(body)
    )
    yahoo = (
        "https://compose.mail.yahoo.com/?to="
        + quote(target)
        + "&subject="
        + quote(subject)
        + "&body="
        + quote(body)
    )
    outlook = (
        "https://outlook.live.com/owa/?path=/mail/action/compose&to="
        + quote(target)
        + "&subject="
        + quote(subject)
        + "&body="
        + quote(body)
    )
    return jsonify({"ok": True, "web": {"gmail": gmail, "yahoo": yahoo, "outlook": outlook}})


if __name__ == "__main__":
    app.run(debug=True)


