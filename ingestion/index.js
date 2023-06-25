import DerivAPIBasic from '@deriv/deriv-api/dist/DerivAPIBasic.js';
import WebSocket from 'ws';

import { MQSender } from './utils.js';

const app_id = 1089; // Replace with your app_id or leave as 1089 for testing.
const connection = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=${app_id}`);
const api = new DerivAPIBasic({ connection });
const tickStream = () => api.subscribe({ ticks: '1HZ100V' });

const clientMq = new MQSender('amqp://localhost');

clientMq.connect();


const tickResponse = async (res) => {
    const data = JSON.parse(res.data);
    if (data.error !== undefined) {
        console.log('Error : ', data.error.message);
        connection.removeEventListener('message', tickResponse, false);
        await api.disconnect();
    }
    if (data.msg_type === 'tick') {
        console.log(data.tick);
        //publish message to message queue

        const message = [
            data.tick.quote,
            data.tick.epoch
        ]


        clientMq.publishMessage(message)

    }
};

const subscribeTicks = async () => {
    await tickStream();
    connection.addEventListener('message', tickResponse);
};

const unsubscribeTicks = () => {
    connection.removeEventListener('message', tickResponse, false);
    tickStream().unsubscribe();
};

subscribeTicks()