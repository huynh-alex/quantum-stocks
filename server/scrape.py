from bs4 import BeautifulSoup as bs
import requests
import numpy as np

class Stock:
    def __init__(self, num):
        self.num = num
    def set_values(self, info):
        self.ticker = info[0]
        self.company = info[1]
        self.sector = info[2]
        self.industry = info[3]
        self.country = info[4]
        self.market_cap = info[5]
        self.p_e = info[6]
        self.price = info[7]
        self.change = info[8]
        self.volume = info[9]
    def get_values(self):
        return [self.num, self.ticker, self.company, self.sector, self.industry, self.country, self.market_cap, self.p_e, self.price, self.change, self.volume]

def get_stocks(stocks_class):
    stocks = []
    for i in range(1, 8201, 20):
        progress = i / 8201 * 100

        stocks_class.set_update_progress(progress)
        url = 'https://finviz.com/screener.ashx?v=111&r=' + str(i)
        html = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
        soup = bs(html.content, "html.parser")
        table_div = soup.find('div', attrs={'id': 'screener-content'})
        table = table_div.find('table')
        table_rows = table.findAll('tr')
        table_elements = table_rows[5].findAll('td')
        table_elements = np.asarray(table_elements[1:], dtype='object')
        rows_on_page = len(table_elements) // 11
        table_elements = table_elements.reshape([rows_on_page,11])

        NUM_ROWS = rows_on_page
        NUM_COLS = 11
        for row in range(1, NUM_ROWS):
            stock_data = [table_elements[row][i].a.get_text() for i in range(NUM_COLS)]
            stocks.append(Stock(stock_data[0]))
            stocks[-1].set_values(stock_data[1:])
    return stocks

def get_one_stock(ticker):
    url = 'https://finviz.com/screener.ashx?v=111&t=' + str(ticker)
    html = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'})
    soup = bs(html.content, "html.parser")
    table_div = soup.find('div', attrs={'id': 'screener-content'})
    table = table_div.find('table')
    table_rows = table.findAll('tr')
    table_elements = table_rows[5].findAll('td')
    table_elements = np.asarray(table_elements[1:], dtype='object')
    table_elements = table_elements.reshape([2,11])
    price = table_elements[1][8].a.get_text()
    return price

