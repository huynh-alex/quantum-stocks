from server import scrape
import sqlite3
import requests

class Stocks:

    def __init__(self):
        self.db = sqlite3.connect('server/databases/stocks.db', check_same_thread=False)
        self.create_stocks()
        self.update_progress = 0
        self.api_key = 'D4O43NY0RLJLTQ5B'

    def create_stocks(self):
        cur = self.db.cursor()
        cur.execute('''CREATE TABLE IF NOT EXISTS stocks(
            num INTEGER PRIMARY KEY,
            ticker TEXT,
            company TEXT,
            sector TEXT,
            industry TEXT,
            country TEXT,
            market_cap TEXT,
            p_e REAL,
            price REAL,
            change TEXT,
            volume TEXT)
            ''')
        cur.close()

    def update_stocks(self, new_stocks):
        cur = self.db.cursor()
        for i in range(len(new_stocks)):
            stock = new_stocks[i].get_values()
            cur.execute('INSERT OR REPLACE INTO stocks VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', tuple(stock[i] for i in range(len(stock))))
        self.db.commit()
        cur.close()

    def fetch_stocks(self):
        cur = self.db.cursor()
        rows = cur.execute('SELECT * FROM stocks').fetchall()
        cur.close()
        return rows

    def set_update_progress(self, update_progress):
        self.update_progress = update_progress

    def get_update_progress(self):
        return self.update_progress