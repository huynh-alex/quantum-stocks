from flask import request
from server.models import portfolio
from server import app

pending_stocks = {}
portfolio = portfolio.Portfolio()

@app.route('/add_pending_stock', methods=['POST'])
def add_pending_stock():
    ticker = str(request.get_json()['ticker'])
    price = request.get_json()['price']
    name = request.get_json()['name']
    
    if ticker not in pending_stocks:
        pending_stocks[ticker] = [name, 1, price]
    else:
        pending_stocks[ticker] = [name, pending_stocks[ticker][1] + 1, price]
    return "success"

@app.route('/subtract_pending_stock', methods=['POST'])
def subtract_pending_stock():
    ticker = str(request.get_json()['ticker'])
    price = request.get_json()['price']
    name = request.get_json()['name']
    
    if ticker not in pending_stocks:
        return "all removed"
    else:
        pending_stocks[ticker] = [name, pending_stocks[ticker][1] - 1, price]
        if pending_stocks[ticker][1] == 0:
            del pending_stocks[ticker]
    return "success"

@app.route('/fetch_pending_stocks', methods=['GET'])
def fetch_pending():
    return {'pending': pending_stocks}

@app.route('/purchase_pending_stocks', methods=['GET'])
def purchase_pending():
    to_purchase = []
    for key,value in pending_stocks.items():
        ticker = key
        name = value[0]
        amount = value[1]
        price = value[2]  
        to_purchase.append((ticker, name, amount, price))
    portfolio.purchase_pending_stocks(to_purchase)
    clear_pending_stocks()
    return "success"

@app.route('/clear_pending_stocks', methods=['GET'])
def clear_pending_stocks():
    global pending_stocks
    pending_stocks = {}
    return "cleared"

@app.route('/sell_stock', methods=['POST'])
def sell_stock():
    ticker = str(request.get_json()['ticker'])
    date = request.get_json()['date']
    total = float(request.get_json()['total'])
    portfolio.sell_stock(ticker, date, total)
    return "sold"

@app.route('/fetch_portfolio', methods=['GET'])
def fetch_portfolio():
    non_unique_rows, unique_rows = portfolio.fetch_portfolio()
    return {'non_unique_rows': non_unique_rows, 'unique_rows': unique_rows}
