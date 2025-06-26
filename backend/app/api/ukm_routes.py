from flask import request
from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import db, UKM, Category, User
from ..decorators import admin_required, permission_required, get_current_user

api = Namespace('ukm', description='Operasi terkait UKM')

# Model untuk Category
category_model = api.model('Category', {
    'id': fields.Integer(description='ID Kategori'),
    'name': fields.String(description='Nama Kategori'),
    'description': fields.String(description='Deskripsi Kategori'),
    'icon': fields.String(description='Icon Kategori')
})

# Model untuk UKM
ukm_model = api.model('UKM', {
    'id': fields.Integer(description='ID UKM'),
    'nama': fields.String(description='Nama UKM'),
    'deskripsi': fields.String(description='Deskripsi UKM'),
    'category': fields.Nested(category_model, description='Kategori UKM'),
    'logo_url': fields.String(description='URL Logo UKM'),
    'contact_person': fields.String(description='Contact Person'),
    'contact_email': fields.String(description='Contact Email'),
    'contact_phone': fields.String(description='Contact Phone'),
    'is_active': fields.Boolean(description='Status aktif UKM'),
    'created_at': fields.String(description='Tanggal dibuat'),
    'updated_at': fields.String(description='Tanggal diupdate')
})

# Model untuk input UKM baru (tanpa ID)
ukm_input_model = api.model('UKMInput', {
    'nama': fields.String(required=True, description='Nama UKM'),
    'deskripsi': fields.String(required=True, description='Deskripsi UKM'),
    'category_id': fields.Integer(required=True, description='ID Kategori UKM'),
    'logo_url': fields.String(description='URL Logo UKM'),
    'contact_person': fields.String(description='Contact Person'),
    'contact_email': fields.String(description='Contact Email'),
    'contact_phone': fields.String(description='Contact Phone')
})

# Model untuk response message
message_model = api.model('Message', {
    'message': fields.String(description='Pesan response')
})

# Model untuk response message
message_model = api.model('Message', {
    'message': fields.String(description='Pesan response')
})

@api.route('/')
class UkmList(Resource):
    @api.doc(description="Mengambil semua daftar UKM (Publik).")
    @api.marshal_list_with(ukm_model)
    def get(self):
        """[PUBLIK] Mengambil daftar semua UKM."""
        ukms = UKM.query.filter_by(is_active=True).all()
        return [ukm.to_dict() for ukm in ukms], 200

    @admin_required
    @api.doc(security='jsonWebToken', description="Menambah UKM baru (Admin only).")
    @api.expect(ukm_input_model)
    @api.marshal_with(ukm_model, code=201)
    def post(self):
        """[TERPROTEKSI - ADMIN] Menambah UKM baru."""
        data = request.get_json()
        
        # Validasi category_id
        category = Category.query.get(data.get('category_id'))
        if not category:
            return {"message": "Category tidak ditemukan"}, 400
        
        try:
            new_ukm = UKM(
                nama=data['nama'],
                deskripsi=data['deskripsi'],
                category_id=data['category_id'],
                logo_url=data.get('logo_url'),
                contact_person=data.get('contact_person'),
                contact_email=data.get('contact_email'),
                contact_phone=data.get('contact_phone')
            )
            
            db.session.add(new_ukm)
            db.session.commit()
            
            return new_ukm.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {"message": "Gagal menambah UKM"}, 500

@api.route('/<int:id>')
class Ukm(Resource):
    @api.doc(description="Mengambil detail satu UKM berdasarkan ID (Publik).")
    @api.marshal_with(ukm_model, code=200)
    @api.response(404, 'UKM tidak ditemukan', message_model)
    def get(self, id):
        """[PUBLIK] Mengambil detail satu UKM."""
        ukm = UKM.query.get(id)
        if ukm and ukm.is_active:
            return ukm.to_dict(), 200
        return {"message": "UKM tidak ditemukan"}, 404

    @admin_required
    @api.doc(security='jsonWebToken', description="Mengedit UKM (Admin only).")
    @api.expect(ukm_input_model)
    @api.marshal_with(ukm_model, code=200)
    @api.response(404, 'UKM tidak ditemukan', message_model)
    def put(self, id):
        """[TERPROTEKSI - ADMIN] Mengedit UKM."""
        ukm = UKM.query.get(id)
        if not ukm:
            return {"message": "UKM tidak ditemukan"}, 404
        
        data = request.get_json()
        
        # Validasi category_id jika diubah
        if 'category_id' in data:
            category = Category.query.get(data['category_id'])
            if not category:
                return {"message": "Category tidak ditemukan"}, 400
        
        try:
            # Update fields
            ukm.nama = data.get('nama', ukm.nama)
            ukm.deskripsi = data.get('deskripsi', ukm.deskripsi)
            ukm.category_id = data.get('category_id', ukm.category_id)
            ukm.logo_url = data.get('logo_url', ukm.logo_url)
            ukm.contact_person = data.get('contact_person', ukm.contact_person)
            ukm.contact_email = data.get('contact_email', ukm.contact_email)
            ukm.contact_phone = data.get('contact_phone', ukm.contact_phone)
            
            db.session.commit()
            return ukm.to_dict(), 200
        except Exception as e:
            db.session.rollback()
            return {"message": "Gagal mengupdate UKM"}, 500

    @admin_required
    @api.doc(security='jsonWebToken', description="Menghapus UKM (Admin only).")
    @api.marshal_with(message_model, code=200)
    @api.response(404, 'UKM tidak ditemukan', message_model)
    def delete(self, id):
        """[TERPROTEKSI - ADMIN] Menghapus UKM."""
        ukm = UKM.query.get(id)
        if not ukm:
            return {"message": "UKM tidak ditemukan"}, 404
        
        try:
            # Soft delete - set is_active to False
            ukm.is_active = False
            db.session.commit()
            return {"message": "UKM berhasil dihapus"}, 200
        except Exception as e:
            db.session.rollback()
            return {"message": "Gagal menghapus UKM"}, 500

@api.route('/categories')
class CategoryList(Resource):
    @api.doc(description="Mengambil semua kategori UKM (Publik).")
    @api.marshal_list_with(category_model)
    def get(self):
        """[PUBLIK] Mengambil daftar semua kategori UKM."""
        categories = Category.query.all()
        return [category.to_dict() for category in categories], 200