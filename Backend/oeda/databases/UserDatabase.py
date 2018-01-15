# Abstract interface for user database
#
# A database stores the raw data and the users of RTX.


class UserDatabase:

    def __init__(self):
        pass

    def get_user(self, username):
        """ returns user with the given username """
        pass

    def get_users(self):
        """ returns all users in the system """
        pass

    def save_user(self, user):
        """ saves user into the system """
        pass

    def update_user(self, user):
        """ updates given user in the system """
        pass