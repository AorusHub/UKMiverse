import sqlite3

print("=== FIXING DATABASE RELATIONS ===")

# Connect to database
conn = sqlite3.connect('instance/ukmiverse.db')
cursor = conn.cursor()

# 1. Check categories
cursor.execute("SELECT id, name FROM category")
categories = cursor.fetchall()
print(f"Categories: {categories}")

# 2. If no categories, create them
if not categories:
    print("Creating categories...")
    cursor.execute("INSERT INTO category (name) VALUES ('Unit Kegiatan Olahraga')")
    cursor.execute("INSERT INTO category (name) VALUES ('Unit Kegiatan Kesenian')")
    cursor.execute("INSERT INTO category (name) VALUES ('Unit Kegiatan Khusus')")
    conn.commit()
    
    cursor.execute("SELECT id, name FROM category")
    categories = cursor.fetchall()
    print(f"Created categories: {categories}")

# 3. Get category IDs
olahraga_id = None
kesenian_id = None
khusus_id = None

for cat_id, cat_name in categories:
    if "Olahraga" in cat_name:
        olahraga_id = cat_id
    elif "Kesenian" in cat_name:
        kesenian_id = cat_id
    elif "Khusus" in cat_name:
        khusus_id = cat_id

print(f"Category IDs: Olahraga={olahraga_id}, Kesenian={kesenian_id}, Khusus={khusus_id}")

# 4. Fix UKM categories
cursor.execute("SELECT id, nama, category_id FROM ukm")
ukms = cursor.fetchall()

for ukm_id, ukm_nama, current_cat_id in ukms:
    nama_lower = ukm_nama.lower()
    
    # Assign based on keywords
    if any(word in nama_lower for word in ['catur', 'basket', 'badminton', 'futsal']):
        new_cat_id = olahraga_id
    elif any(word in nama_lower for word in ['musik', 'band']):
        new_cat_id = kesenian_id
    else:
        new_cat_id = khusus_id
    
    if current_cat_id != new_cat_id:
        print(f"Fixing {ukm_nama}: {current_cat_id} -> {new_cat_id}")
        cursor.execute("UPDATE ukm SET category_id = ? WHERE id = ?", (new_cat_id, ukm_id))

# 5. Commit changes
conn.commit()

# 6. Verify
print("\nVerification:")
cursor.execute("""
    SELECT u.nama, c.name 
    FROM ukm u 
    LEFT JOIN category c ON u.category_id = c.id
""")
results = cursor.fetchall()
for ukm_nama, cat_name in results:
    print(f"  {ukm_nama} -> {cat_name}")

conn.close()
print("\n✅ Database fixed!")
