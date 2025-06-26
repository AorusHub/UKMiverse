# Quick Installation Guide

## Command Summary

Setelah clone repository dari GitHub, jalankan command berikut:

### Windows (PowerShell)

```powershell
# 1. Clone dan masuk ke directory
git clone <repository-url>
cd ukmiverse_project

# 2. Setup Backend (Terminal 1)
cd backend
pip install -r requirements.txt
python run.py

# 3. Setup Frontend (Terminal 2 - buka terminal baru)
cd frontend
npm install
npm run dev
```

### macOS/Linux (Bash)

```bash
# 1. Clone dan masuk ke directory
git clone <repository-url>
cd ukmiverse_project

# 2. Setup Backend (Terminal 1)
cd backend
pip install -r requirements.txt
python run.py

# 3. Setup Frontend (Terminal 2 - buka terminal baru)
cd frontend
npm install
npm run dev
```

## URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **API Docs**: http://localhost:5000/api/doc/

## Default Login

- **Admin**: admin@unhas.ac.id / admin123
- **User**: user@unhas.ac.id / user123

## Troubleshooting

### Python Issues
```bash
# Jika pip tidak ditemukan
python -m pip install -r requirements.txt

# Jika Python tidak ditemukan
python3 run.py
```

### Node.js Issues
```bash
# Jika npm lambat, gunakan yarn
yarn install
yarn dev

# Clear cache jika error
npm cache clean --force
```

### Port Issues
```bash
# Jika port 5000 digunakan (macOS AirPlay)
export FLASK_RUN_PORT=5001
python run.py

# Jika port 5173 digunakan
npm run dev -- --port 3000
```
