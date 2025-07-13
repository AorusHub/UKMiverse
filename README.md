UKMiverse

Kelompok 4 - Web Lanjutan B
- Mohammad Abdul Razaq ( H071231044 )
- Chelsea Shelin Purnaria ( H071231046 )
- Nurul Anugrah ( H071231028 )
- Muhammad Ikhsan Saputra ( H071231083 )

Cara membuka file project kami (Silahkan di lakukan di terminal cmd) :
# 1. Clone repository
git clone https://github.com/AorusHub/UKMiverse.git
cd ukmiverse_project

# 2. Setup Backend dengan Virtual Environment
cd backend

#Lalu Hapus file .venv
rmdir /s /q venv
atau
Remove-Item -Recurse -Force .\venv

#Lalu install lagi venv dengan :
python -m venv venv

# Aktivasi venv (Windows)
venv\Scripts\activate

# Atau untuk macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python run.py

# 3. Setup Frontend (terminal baru)
cd frontend
npm install
npm run dev
