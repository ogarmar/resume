# Momento Blog (Flask)

Una pequeña app de blog bonita y minimalista hecha con Flask.

## Requisitos
- Python 3.10+
- Windows PowerShell

## Instalación y ejecución
```powershell
# 1) Crear entorno virtual
python -m venv .venv

# 2) Activar entorno
. .venv\Scripts\Activate.ps1

# 3) Instalar dependencias
pip install -r requirements.txt

# 4) Ejecutar la app
$env:FLASK_APP = "app.py"
$env:FLASK_ENV = "development"
flask run
```

La app estará disponible en `http://127.0.0.1:5000`.

## Estructura
```
app.py
static/
  styles.css
templates/
  base.html
  index.html
  post.html
```

## Personalización
- Edita los posts en `app.py` dentro de `generate_posts()`.
- Cambia colores y tipografías en `static/styles.css`.
- Modifica las plantillas en `templates/`.

---
Hecho con ❤

