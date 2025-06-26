from flask import Flask
from flask_restx import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .models import db
from .api.auth_routes import api as auth_ns
from .api.ukm_routes import api as ukm_ns
from config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Aktifkan CORS untuk mengizinkan request dari frontend
    CORS(app)

    # Inisialisasi database
    db.init_app(app)

    # Inisialisasi ekstensi
    jwt = JWTManager(app)
    
    # Konfigurasi security untuk Swagger UI
    authorizations = {
        'jsonWebToken': {
            'type': 'apiKey',
            'in': 'header',
            'name': 'Authorization',
            'description': 'JWT Authorization header menggunakan Bearer scheme. Contoh: "Authorization: Bearer {token}"'
        }
    }
    
    api = Api(
        app,
        version='1.0',
        title='UKMiverse API',
        description='API untuk website UKM Universitas Hasanuddin',
        authorizations=authorizations,
        security='jsonWebToken'
    )

    # Daftarkan namespace dari file routes
    api.add_namespace(auth_ns, path='/api/auth')
    api.add_namespace(ukm_ns, path='/api/ukm')

    # Buat tabel dan data awal
    with app.app_context():
        db.create_all()
        init_data()

    return app

def init_data():
    """Inisialisasi data awal untuk roles, categories, dan admin user"""
    from .models import Role, Category, User, UKM
    
    # Buat roles menggunakan method yang baru
    Role.create_default_roles()
    
    # Buat categories jika belum ada
    if not Category.query.first():
        categories = [
            Category(name='Unit Kegiatan Olahraga', description='Wadah pengembangan bakat olahraga', icon='🏃‍♂️'),
            Category(name='Unit Kegiatan Kesenian', description='Tempat berkreasi seni dan budaya', icon='🎭'),
            Category(name='Unit Kegiatan Khusus', description='Kegiatan khusus dan penalaran', icon='⭐')
        ]
        for category in categories:
            db.session.add(category)
        db.session.commit()
    
    # Buat admin user menggunakan factory method
    if not User.query.filter_by(username='admin').first():
        admin_user, message = User.create_user(
            username='admin',
            email='admin@ukmiverse.com',
            password='password123',
            full_name='Administrator',
            role_name='admin'
        )
        
        if not admin_user:
            print(f"Failed to create admin user: {message}")
    
    # Buat sample regular user
    if not User.query.filter_by(username='user1').first():
        regular_user, message = User.create_user(
            username='user1',
            email='user1@ukmiverse.com',
            password='password123',
            full_name='Regular User',
            role_name='user'
        )
    
    # Buat sample UKM jika belum ada
    if not UKM.query.first():
        olahraga_cat = Category.query.filter_by(name='Unit Kegiatan Olahraga').first()
        kesenian_cat = Category.query.filter_by(name='Unit Kegiatan Kesenian').first()
        khusus_cat = Category.query.filter_by(name='Unit Kegiatan Khusus').first()
        
        sample_ukms = [
            UKM(nama='UKM Catur', deskripsi='Klub untuk para pemikir strategis dan penggemar catur.', category_id=olahraga_cat.id),
            UKM(nama='UKM Musik', deskripsi='Wadah penyaluran bakat dan minat di bidang musik.', category_id=kesenian_cat.id),
            UKM(nama='UKM Debat', deskripsi='Mengasah kemampuan berpikir kritis dan public speaking.', category_id=khusus_cat.id),
            UKM(nama='UKM Basket', deskripsi='Untuk kamu yang energik dan suka permainan tim.', category_id=olahraga_cat.id),
            UKM(nama='Unit Persatuan Catur', deskripsi='UKM Persatuan Catur Universitas yang berdedikasi memfokuskan diri pada pembentukan karakter', category_id=olahraga_cat.id)
        ]
        for ukm in sample_ukms:
            db.session.add(ukm)
        db.session.commit()