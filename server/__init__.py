from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


from server.views import stocks, portfolio, users