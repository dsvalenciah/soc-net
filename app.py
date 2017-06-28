# bultin library
from uuid import uuid4

# external libraries
from sanic import Sanic
from sanic.views import HTTPMethodView
from sanic.response import json
from sanic_cors import CORS

app = Sanic()

USERS = []


class User(HTTPMethodView):

    def get(self, request, email):
        try:
            user = next(user for user in USERS if user.get('email') == email)
            return json({'data': user})
        except Exception:
            return json({'data': USERS})

    def post(self, request, email):
        email = request.json.get('email', None)
        password = request.json.get('passwordA', None)
        name = request.json.get('name', None)
        if not email or not password or not name:
            return json({
                'error': {
                    'message':
                        'The name, password or email field is required',
                }
            }, status=400)
        new_user = {
            'id': uuid4().hex,
            'email': email,
            'password': password,
            'name': name
        }
        USERS.append(new_user)
        return json(new_user, status=201)

    def put(self, request, email):
        return json({})

    def patch(self, request, email):
        return json({})

    def delete(self, request, email):
        return json({})

    def options(self, request, email):
        return json({})


CORS(app)
app.add_route(User.as_view(), '/user/<email>')

if __name__ == '__main__':
    app.run(
        debug=True,
        host="0.0.0.0",
        port=8000
    )
