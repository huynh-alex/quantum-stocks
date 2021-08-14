from server.models.users import User
from server import app
from flask import request

user = User()
user_id = 1


@app.route('/create_user', methods=['GET'])
def create_user():
    user.create_user()
    return "success"

@app.route('/get_balance', methods=['GET'])
def get_balance():
    return str(user.get_balance(user_id))
    
@app.route('/set_balance', methods=['POST'])
def set_balance():
    balance = request.get_json()['balance']
    user.set_balance(user_id, balance)
    return 'updated'

@app.route('/init_user', methods=['GET'])
def init_user():
    user.init_user()
    return 'inited'