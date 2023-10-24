import sqlite3
import os
import shutil

def migrate():
    conn = sqlite3.connect('backend/db/db.sqlite')
    cursor = conn.cursor()
    
    migration_files = sorted([f for f in os.listdir('backend/db/migrations') if f.endswith('.sql')])
    
    for migration_file in migration_files:
        with open(f'backend/db/migrations/{migration_file}', 'r') as file:
            sql_script = file.read()
        
        cursor.executescript(sql_script)
        
        if not os.path.exists('backend/db/migrations/completed'):
            os.makedirs('backend/db/migrations/completed')
        shutil.move(f'backend/db/migrations/{migration_file}', f'backend/db/migrations/completed/{migration_file}')
    
    conn.commit()
    
    conn.close()

if __name__ == "__main__":
    migrate()