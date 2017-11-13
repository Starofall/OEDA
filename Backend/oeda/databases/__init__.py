from json import load

from ElasticSearchDb import ElasticSearchDb
from oeda.log import error


def create_instance(type, host, port, config):
    """ creates a single instance of a database  """
    if type == "elasticsearch":
        return ElasticSearchDb(host, port, config)


class NonLocal: DB = None


def setup_database(type, host, port):

    with open('./oeda/databases/config.json') as json_data_file:
        try:
            config_data = load(json_data_file)
        except ValueError:
            error("> You need to specify a database configuration in databases/config.json.")
            exit(0)

    NonLocal.DB = create_instance(type, host, port, config_data)


def db():
    if not NonLocal.DB:
        error("You have to setup the database.")
        exit(0)
    return NonLocal.DB