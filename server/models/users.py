import sqlite3

class User:

    def __init__(self):
        self.db = sqlite3.connect('server/databases/users.db', check_same_thread=False)
        self.create_user()
        self.progress = 0

    def create_user(self):
        cur = self.db.cursor()
        cur.execute('''CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY,
            balance REAL)
            ''')
        cur.close()
    
    def init_user(self):
        cur = self.db.cursor()
        cur.execute('INSERT OR REPLACE INTO users VALUES (?, ?)', (1, 1000.00))
        self.db.commit()
        cur.close()

    def set_balance(self, id, balance):
        cur = self.db.cursor()
        cur.execute('INSERT OR REPLACE INTO users VALUES (?, ?)', (id, balance))
        self.db.commit()
        cur.close()

    def get_balance(self, id):
        cur = self.db.cursor()
        rows = cur.execute('SELECT balance FROM users where (id = ?)', (id,)).fetchone()
        cur.close()
        return rows[0]