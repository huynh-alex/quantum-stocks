from server.models.stocks import Stocks
from server import app
from server import scrape
from flask import request
from server.models.analyze import Analyze

stocks = Stocks()
analysis = Analyze()

@app.route('/fetch_stocks', methods=['GET'])
def fetch_stocks():
    rows = stocks.fetch_stocks()
    return {'rows': rows}

@app.route('/update_stocks', methods=['GET'])
def update_stocks():
    stocks.update_stocks(scrape.get_stocks(stocks))
    return 'updated'
    
@app.route('/get_update_progress', methods=['GET'])
def get_update_progress():
    return {'progress': stocks.get_update_progress()}

@app.route('/analyze_stocks', methods=['POST'])
def analyze_stocks():
    selectedStocks = request.get_json()['stocks'] #this will be a list of stocks
    budget = request.get_json()['budget']
    print(budget)
    classical_optimization = analysis.classical_optimization(selectedStocks, budget)
    quantum_optimization = analysis.quantum_optimization(selectedStocks)
    return {'classical': classical_optimization, 'quantum': quantum_optimization}

@app.route('/get_analysis_progress', methods=['GET'])
def get_analysis_progress():
    return {'progress': analysis.get_progress()}
