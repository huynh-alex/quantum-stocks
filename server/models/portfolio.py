import sqlite3
import datetime
from server.models.users import User
from server import scrape

user = User()
user_id = 1

class Portfolio:
    
    def __init__(self):
        self.db = sqlite3.connect('server/databases/portfolio.db', check_same_thread=False)
        self.create_portfolio()

    def create_portfolio(self):
        cur = self.db.cursor()
        cur.execute('''CREATE TABLE IF NOT EXISTS portfolio(
            date TIMESTAMP,
            ticker TEXT,
            company TEXT,
            price BLOB,
            quantity BLOB)
            ''')

    def purchase_pending_stocks(self, pending_stocks):
        cur = self.db.cursor()
        for stock in pending_stocks:
            ticker = stock[0]
            company = stock[1]
            quantity = stock[2]
            price = stock[3]
            user.set_balance(1, float(user.get_balance(1)) - quantity * price)
            cur.execute('INSERT OR REPLACE INTO portfolio VALUES (?, ?, ?, ?, ?)', (ticker, company, quantity, price, datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")))
        self.db.commit()

    def fetch_portfolio(self):
        cur = self.db.cursor()
        non_unique_rows = cur.execute('SELECT * from portfolio').fetchall()
        unique_rows = {} #{ticker: company, shares, total}
        # this is the expandable row
        for i in range(len(non_unique_rows)):
            row = non_unique_rows[i]
            ticker = row[0]
            company = row[1]
            shares = float(row[2])
            bought_for = row[3]
            if ticker in unique_rows:
                previous_shares = unique_rows[ticker][1]
                previous_price = unique_rows[ticker][2]
                unique_rows[ticker] = [company, previous_shares + shares, previous_price + (shares * bought_for), []]
            else:
                unique_rows.update({ticker: [company, shares, bought_for * shares, []]})
            current_price = float(scrape.get_one_stock(ticker))
            non_unique_rows[i] = non_unique_rows[i] + (current_price,)
        return non_unique_rows, unique_rows

    def sell_stock(self, ticker, date, total):
        cur = self.db.cursor()
        cur.execute('DELETE FROM portfolio WHERE (ticker = ? AND date = ?)', (ticker, date))
        user.set_balance(1, float(user.get_balance(1) + total))
        self.db.commit()
