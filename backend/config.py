import os

class Config:
    """Konfigurasi dasar untuk aplikasi."""
    # Ganti ini dengan kunci yang sangat rahasia di produksi!
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'super-secret-jwt-key'
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///ukmiverse.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False