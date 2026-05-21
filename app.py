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
    "tagline": "AI Engineer • Data Scientist • Backend Developer",
    "location": "Spain (Remote)",
    "contacts": {
        "phone": "+34 611 32 38 65",
        "emails": [
            "oscargarciatrabajos@gmail.com",
        ],
        "address": "",
        "birthday": "",
        "github": "https://github.com/ogarmar",
        "linkedin": "https://www.linkedin.com/in/ogarmar/",
    },
    "profile": "AI Engineer building production-ready automation systems, AI agents, and LLM-powered tools. Strong foundation in Data Science: statistical modeling, predictive analytics, and data-driven decision making. Complemented by Backend/Full-Stack development skills for end-to-end solution delivery. Passionate about making things work.",
    "education": [
        {
            "title": "BSc in Data Science",
            "institution": "Universitat Politècnica de València (UPV)",
            "status": "Graduation: Jun 2026",
            "focus": "AI, Machine Learning, Statistical Modeling, Data Systems",
        }
    ],
    "languages": [
        {"name": "Spanish", "level": "Native"},
        {"name": "English", "level": "C1 (official Cambridge B2 certificate)"},
        {"name": "French/German", "level": "A1"},
    ],
    "experience": [
        {
            "company": "Freelance",
            "sector": "AI/Automation",
            "role": "AI Automation Engineer",
            "summary": "Building AI-powered automation workflows and LLM solutions",
            "start": "2024",
            "end": "Present",
            "highlights": [
                "Built AI-powered automation workflows: REST APIs, webhooks, PostgreSQL, and messaging platforms (Telegram, Gmail)",
                "Developed LLM solutions with prompt engineering and function calling for functional workflows",
                "Applied statistical analysis and data validation to optimize workflows and measure impact",
                "Designed scalable backend architectures supporting real-time AI interactions",
            ],
        },
        {
            "company": "Urobora",
            "sector": "IT/Software – Consulting",
            "role": "AI Engineer & Automation Specialist",
            "summary": "Production automation systems and AI-driven operations",
            "start": "2024-10",
            "end": "2025-06",
            "highlights": [
                "Architected automation systems connecting multiple services (Google Cloud, Notion, MongoDB)",
                "Developed Python/FastAPI backend tools with async processing for AI-driven operations",
                "Used predictive modeling and A/B testing concepts to inform technical decisions",
                "Maintained production pipelines (CI/CD development) with monitoring, logging, and error handling",
            ],
        },
        {
            "company": "Outlier",
            "sector": "Data/AI",
            "role": "Data Analyst",
            "summary": "LLM training data curation and model evaluation",
            "start": "2026",
            "end": "2026",
            "highlights": [
                "Curated training data for LLM fine-tuning using quality benchmarks",
                "Evaluated model outputs for accuracy and safety across domains and languages",
            ],
        }
    ],
    "projects": [
        {
            "title": "tuneintome.me – Music Social Network",
            "description": "Full-stack platform with real-time interactions, gamified rankings, and authentication. Built scalable and secure backend (Firebase + REST + WebSockets) using Google Firebase.",
            "tags": ["React", "Node.js", "Google Cloud", "Firebase", "SEO", "APIs"],
            "url": "https://tuneintome.me",
            "category": "Full-Stack",
            "minor": False,
        },
        {
            "title": "Compa – AI Voice Assistant for Alzheimer's Care",
            "description": "Voice-first AI assistant: real-time conversation via WebSocket + Web Speech API + Gemini. Secure auth via Telegram bot; memory management with PostgreSQL for personalized interactions. Impact: Accessible UI, bilingual (ES/EN), privacy-first design for sensitive data.",
            "tags": ["FastAPI", "Gemini", "PostgreSQL", "WebSocket", "Telegram Bot"],
            "url": "https://github.com/ogarmar/Compa",
            "category": "AI + HealthTech",
            "minor": False,
        },
        {
            "title": "RAGtor-UPV – AI Chatbot for University Regulations",
            "description": "RAG pipeline: semantic search (FAISS + LaBSE) + PoliGPT for grounded, cited regulatory answers. Automated PDF ingestion: chunking, parallel embeddings, SQLite metadata tracking. Team project (5 contributors); modular design for institutional reuse.",
            "tags": ["Python", "FAISS", "LaBSE", "Streamlit", "PoliGPT"],
            "url": "https://github.com/Marxx01/RAGtor-UPV",
            "category": "AI + RAG",
            "minor": False,
        },
        {
            "title": "Valencia Agri-Insights Pro",
            "description": "Predictive modeling for urban farming: crop recommendations, cost analysis, risk assessment. Applied AutoML (FLAML) for model selection; built monitoring alerts for production use. Team: 3 developers.",
            "tags": ["Streamlit", "FLAML", "Scikit-learn", "Pandas", "Plotly"],
            "url": "https://github.com/ogarmar/EMD-VLC-agrostudy",
            "category": "Data Science + AutoML",
            "minor": True,
        },
        {
            "title": "AI-Typer – AI-Powered Document Resumer and Typing Memory Game",
            "description": "Full-stack typing web integrating LLMs for document analysis. Built modular architecture: TypeScript frontend for responsive UI + Python/FastAPI backend for AI processing. Designed for extensibility: plugin-ready structure for adding new AI features and third-party integrations.",
            "tags": ["TypeScript", "Python", "FastAPI", "React", "LLM Integration", "Ollama"],
            "url": "https://github.com/ogarmar/ai-typer",
            "category": "AI + Full-Stack",
            "minor": True,
        },
        {
            "title": "OCR + AI Document Pipeline",
            "description": "Pipeline combining OCR extraction with LLM-based semantic structuring for kids essay correction automation. Designed for schema compliance and integration with Google Drive and Sheets.",
            "tags": ["TesseractOCR", "LangChain", "Gemini API", "AsyncIO"],
            "url": None,
            "category": "AI + Computer Vision",
            "minor": True,
        },
        {
            "title": "EDM-XAI-3 – Explainable AI Dashboard",
            "description": "Dashboard visualizing model decisions (SHAP, partial dependence) for stakeholder transparency. Applied statistical analysis to compare model architectures and fusion techniques.",
            "tags": ["R", "SHAP", "XGBoost", "Plotly"],
            "url": "https://github.com/ogarmar/EDM-XAI-3",
            "category": "Data Science + Interpretable ML",
            "minor": True,
        },
    ],
    "skills": {
        "AI Engineering": ["LLMs", "RAG", "Prompt Engineering", "AI Agents", "LangChain", "AutoML", "FAISS"],
        "Data Science": ["Pandas", "Statistical Analysis", "EDA", "Scikit-learn", "SHAP", "Predictive Modeling"],
        "Backend/Full-Stack": ["FastAPI", "Flask", "REST", "WebSockets", "React", "TypeScript", "PostgreSQL"],
        "Automation": ["API Integrations", "Webhooks", "Bot Development", "Workflow Orchestration"],
        "Data Infrastructure": ["SQLite", "ETL", "Vector DBs", "Open Data", "AsyncIO"],
        "DevOps": ["Git", "Docker", "Redis", "Cloud Deployment"],
        "Languages": ["Python", "SQL", "R", "JavaScript/TypeScript"],
    },
    "technologies": [
        "Python", "FastAPI", "Flask", "TypeScript", "React", "PostgreSQL",
        "Firebase", "Google Cloud", "LangChain", "FAISS", "Gemini",
        "Streamlit", "Plotly", "Scikit-learn", "Pandas", "R",
        "Docker", "Redis", "Git", "SQL", "JavaScript"
    ],
    "skill_chart": {
        "axes": [
            "AI Engineering",
            "Data Science",
            "Backend Development",
            "Problem Solving",
            "Communication",
            "Innovation & Creativity",
        ],
        "values": [98, 95, 94, 99, 97, 97],
    },
    "graph_overrides": {},
}


@app.route("/resume")
def resume():
    return render_template("resume.html", data=RESUME)


@app.route("/api/resume")
def api_resume():
    return jsonify(RESUME)


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


