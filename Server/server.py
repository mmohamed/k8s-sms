from flask import Flask, json
# pip3 install Flask-JWT flask_cors
from flask_jwt import JWT, jwt_required, current_identity
from flask_cors import CORS, cross_origin
from werkzeug.security import safe_str_cmp

class User(object):
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id

users = [
    User(1, 'mmo@medinvention.dev', 'mmo'),
    User(2, 'isa@medinvention.dev', 'isa'),
]

username_table = {u.username: u for u in users}
userid_table = {u.id: u for u in users}

def authenticate(username, password):
    user = username_table.get(username, None)
    if user and safe_str_cmp(user.password.encode('utf-8'), password.encode('utf-8')):
        return user

def identity(payload):
    user_id = payload['identity']
    return userid_table.get(user_id, None)

api = Flask(__name__)
api.debug = True
api.config['SECRET_KEY'] = 'super-secret'
api.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(api)
jwt = JWT(api, authenticate, identity)

@jwt_required()
@cross_origin()
@api.route('/get', methods=['GET', 'OPTIONS'])
def get():
    with open('./data.json') as jsonfile:
        data = json.load(jsonfile)
    return data

if __name__ == '__main__':
    api.run()