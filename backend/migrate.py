import sqlite3

conn = sqlite3.connect('portfolio.db')
c = conn.cursor()

# Add timeline link columns
try:
    c.execute("ALTER TABLE timeline_items ADD COLUMN link_url VARCHAR(500)")
    print("Added link_url")
except sqlite3.OperationalError as e:
    print(f"link_url: {e}")

try:
    c.execute("ALTER TABLE timeline_items ADD COLUMN link_text VARCHAR(100)")
    print("Added link_text")
except sqlite3.OperationalError as e:
    print(f"link_text: {e}")

conn.commit()
conn.close()
print("Migration complete")
