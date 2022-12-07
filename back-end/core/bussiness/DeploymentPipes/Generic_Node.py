import time
from json import loads
from kafka import KafkaAdminClient, KafkaConsumer,KafkaProducer
from json import dumps
from NodeStructure import NodeCore
import json
from Tasks import TasksCore
import sys

if __name__ == '__main__':
    # args
    print("check params:",sys.argv)
    my_node_name = sys.argv[1]
    receive_from = sys.argv[2]
    send_to = sys.argv[3]
    my_node_task = sys.argv[4]

    # my_node_name = 'stage_1'
    # receive_from = 'pipe_1_stage_1'
    # send_to = 'pipe_1_stage_2'
    # my_node_task = 'stage_1'

    print("Node " + my_node_name + " is listening!")

    # KafkaAdminClient(bootstrap_servers='localhost : 9092').delete_topics(['pipe_1_stage_1'])
    my_consumer = KafkaConsumer(
        receive_from,
        bootstrap_servers=['localhost : 9092'],
        auto_offset_reset='latest',
        enable_auto_commit=True,
        # group_id='my-group',
        # value_deserializer=lambda x: loads(x.decode('utf-8'))
    )
    my_producer = KafkaProducer(
        bootstrap_servers=['localhost:9092'],
        # value_serializer=lambda x: dumps(x).encode('utf-8')
    )
    for message in my_consumer:
        print("Stage 1 received:", message.value)
        bytes = message.value
        bytesDecoded = bytes.decode()
        objectEl = json.loads(bytesDecoded)
        # node = NodeCore.Pipe_Node('Stage 1','pipe_1_stage_2',objectEl)
        node = NodeCore.Pipe_Node(
            name='Stage 1',
            resources=objectEl,
            task=TasksCore.tasksCore[my_node_task]
        )
        to_send = json.dumps(node.executeTask())
        print("Packet to send:", to_send)
        time.sleep(2)
        print("\n Send to :", send_to)
        my_producer.send(send_to, value=to_send.encode())