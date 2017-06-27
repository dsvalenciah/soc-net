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

    def get(self, request, _id):
        try:
            user = next(x for x in USERS if x.get('id') == _id)
            return json({
                'data': user
            })
        except Exception:
            return json({
                'data': USERS,
            })

    def post(self, request, _id):
        email = request.json.get('email', None)
        password = request.json.get('password', None)
        if not email or not password:
            return json({
                'error': {
                    'message': 'The name or password field is required',
                }
            }, status=400)
        new_user = {
            'id': uuid4().hex,
            'email': email,
            'password': password
        }
        USERS.append(new_user)
        return json(new_user, status=201)

    def put(self, request, _id):
        return json({})

    def patch(self, request, _id):
        return json({})

    def delete(self, request, _id):
        return json({})

    def options(self, request, _id):
        return json({})


CORS(app)
app.add_route(User.as_view(), '/user/<_id>')

if __name__ == '__main__':
    app.run(
        debug=True,
        host="0.0.0.0",
        port=8000
    )
