from oeda.log import *
from oeda.rtxlib.changeproviders.DummyChangeProvider import DummyChangeChangeProvider
from oeda.rtxlib.changeproviders.HTTPRequestChangeProvider import HTTPRequestChangeProvider
from oeda.rtxlib.changeproviders.KafkaProducerChangeProvider import KafkaProducerChangeProvider
from oeda.rtxlib.changeproviders.MQTTPublisherChangeProvider import MQTTPublisherChangeProvider


def init_change_provider(wf):
    """ loads the specified change provider into the workflow """
    cp = wf.change_provider
    if cp["type"] == "kafka_producer":
        cp["instance"] = KafkaProducerChangeProvider(wf, cp)
    elif cp["type"] == "mqtt_publisher":
        cp["instance"] = MQTTPublisherChangeProvider(wf, cp)
    elif cp["type"] == "http_request":
        cp["instance"] = HTTPRequestChangeProvider(wf, cp)
    elif cp["type"] == "dummy":
        cp["instance"] = DummyChangeChangeProvider(wf, cp)
    else:
        error("Not a valid changeProvider")
        exit(1)

