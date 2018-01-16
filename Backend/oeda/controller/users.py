from flask import request, jsonify
from flask_restful import Resource
from oeda.databases import user_db, setup_experiment_database, db
import json, traceback, jwt, requests
from werkzeug.security import generate_password_hash, check_password_hash
from elasticsearch.exceptions import ConnectionError
from oeda.service.execution_scheduler import initialize_execution_scheduler
from oeda.service.execution_scheduler import get_execution_scheduler_timer

key = "oeda_jwt_token_secret"

class UserRegisterController(Resource):
    @staticmethod
    def post():
        try:
            content = request.get_json()
            if len(content['name']) != 0 and len(content['password']) != 0:
                # check if given username is unique
                users = user_db().get_users()

                for user in users:
                    if user['name'] == content['name']:
                        return {"message": "Username already exists"}, 409
                content['password'] = generate_password_hash(content['password'])
                new_user = user_db().save_user(content)
                return new_user
            else:
                return {"message": "Invalid information"}, 404
        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"message": e.message}, 404


class UserController(Resource):

    # retrieves the user information (1-st element) as well as its id (0-th element)
    @staticmethod
    def get(username):
        try:
            user = user_db().get_user(username)
            if len(user) == 0:
                return None
            return user
        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"message": e.message}, 404

    # updates the user information and returns newly created jwt token
    @staticmethod
    def post(username):
        try:
            content = request.get_json()
            # if type, host, and port are provided, setup experiment database and update user
            if 'host' in content['db_configuration'] and 'port' in content['db_configuration'] and 'type' in content['db_configuration']:
                setup_experiment_database(str(content['db_configuration']['type']), str(content['db_configuration']['host']), str(content['db_configuration']['port']))
                user_db().update_user(content)
                # start execution scheduler using updated config
                initialize_execution_scheduler(10)
                resp = jsonify({"message": "Update successful", "token": jwt.encode({"user": content}, key, algorithm="HS256")})
                resp.status_code = 200
                return resp
            else:
                resp = jsonify({"message": "Host and/or port values are missing"})
                resp.status_code = 404
                return resp
        except ConnectionError as e:
            resp = jsonify({"message": e.message})
            resp.status_code = 404
            return resp


class UserListController(Resource):
    @staticmethod
    def get():
        try:
            users = user_db().get_users()
            if len(users) == 0:
                return {"message": "Users are not found"}, 404
            return users
        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"message": e.message}, 404


class UserLoginController(Resource):
    @staticmethod
    def post():
        try:
            content = request.get_json()
            username = content["username"]
            password = content["password"]
            if len(username) != 0 and len(password) != 0:
                user_info_without_id = user_db().get_user(username)[1]
                print user_info_without_id
                if len(user_info_without_id) is not 0:
                    # assuming that only one user is returned from DB
                    user_info_without_id = user_info_without_id[0]
                    if check_password_hash(user_info_without_id['password'], password):
                        del user_info_without_id['password']
                        encoded_jwt = jwt.encode({"user": user_info_without_id}, key, algorithm="HS256")

                        if 'host' in user_info_without_id['db_configuration'] and 'port' in user_info_without_id['db_configuration'] and 'type' in user_info_without_id['db_configuration']:
                            # if user is logged-in, and configured experiments database previously:
                            # initialize experiment database and start execution scheduler if they are not done before
                            if db() is None:
                                setup_experiment_database(str(user_info_without_id['db_configuration']['type']), str(user_info_without_id['db_configuration']['host']), str(user_info_without_id['db_configuration']['port']))
                            if get_execution_scheduler_timer() is None:
                                initialize_execution_scheduler(10)

                        # return the usual jwt token
                        return {"token": encoded_jwt}, 200
                    else:
                        return {"message": "Provided credentials are not correct"}, 403
                else:
                    return {"message": "User does not exist. Please register first."}, 404
            else:
                return {"message": "Invalid information"}, 404
        except Exception as e:
            tb = traceback.format_exc()
            print(tb)
            return {"message": e.message}, 404

