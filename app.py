# bultin library
from uuid import uuid4

# external libraries
from sanic import Sanic
from sanic.response import json
from sanic_cors import CORS

from passlib.hash import pbkdf2_sha256

app = Sanic()

USERS = []


SALT = "aslkdfjl@@#&/askdjf@@%#$(()(/l2kjrlkjlkejrlkwjer"


def hash_password(password):
    return pbkdf2_sha256.hash(password + SALT)


async def get_user_by_email(request, email):
    if request.method == "OPTIONS":
        return json({})
    try:
        user = next(user for user in USERS if user.get('email') == email)
        return json({'data': user})
    except Exception:
        return json({'data': {'message': 'The email is not in database'}})


async def get_user_by_email_password(request):
    if request.method == "OPTIONS":
        return json({})
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    try:
        user = next(
            user for user in USERS
            if user.get('email') == email and
            pbkdf2_sha256.verify(password + SALT, user.get('password'))
        )
        return json({'data': user})
    except Exception:
        return json(
            {'data': {'message': 'The email or password is not in database'}}
        )


async def get_all_users(request):
    if request.method == "OPTIONS":
        return json({})
    return json({'data': USERS})


async def create_user(request):
    if request.method == "OPTIONS":
        return json({})
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    name = request.json.get('name', None)
    if not email or not password or not name:
        return json({'data': {
            'message': 'The name, password or email field is required'
        }})
    new_user = {
        'id': uuid4().hex,
        'email': email,
        'password': hash_password(password),
        'name': name
    }
    USERS.append(new_user)
    return json({'data': new_user}, status=200)


CORS(app)
app.add_route(get_user_by_email_password, '/get_user', methods=["POST"])
app.add_route(
    get_user_by_email, '/get_user/<email>', methods=["GET", "OPTIONS"]
)
app.add_route(get_all_users, '/get_user', methods=["GET", "OPTIONS"])
app.add_route(create_user, '/create_user', methods=["POST", "OPTIONS"])

if __name__ == '__main__':
    app.run(
        debug=True,
        host="0.0.0.0",
        port=8000
    )
