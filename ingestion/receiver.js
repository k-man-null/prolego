import { MQReceiver } from "./utils.js";

const clientMq = new MQReceiver('amqp://localhost');

clientMq.connect();

clientMq.receiveMessage();