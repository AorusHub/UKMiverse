import sqlite3

# Connect to database
conn = sqlite3.connect('instance/ukmiverse.db')
cursor = conn.cursor()

print("=== CHECKING DATABASE ===")

# Check categories
print("\n1. Categories:")
cursor.execute("SELECT id, name FROM category")
categories = cursor.fetchall()
for cat in categories:
    print(f"  ID: {cat[0]}, Name: {cat[1]}")

# Check UKMs
print("\n2. UKMs:")
cursor.execute("SELECT id, nama, category_id FROM ukm LIMIT 10")
ukms = cursor.fetchall()
for ukm in ukms:
    print(f"  ID: {ukm[0]}, Name: {ukm[1]}, category_id: {ukm[2]}")

# Check relations
print("\n3. UKM-Category Relations:")
cursor.execute("""
    SELECT u.nama, u.category_id, c.name 
    FROM ukm u 
    LEFT JOIN category c ON u.category_id = c.id
    LIMIT 10
""")
relations = cursor.fetchall()
for rel in relations:
    print(f"  UKM: {rel[0]}, category_id: {rel[1]}, Category: {rel[2]}")

conn.close()
print("\n=== DONE ===")
