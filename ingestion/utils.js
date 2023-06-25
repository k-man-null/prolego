import * as amqplib from 'amqplib';

export class MQSender {

    queue = 'ticks';

    constructor(url) {
        this.url = url;   
    }

    async connect() {
        try {

            this.connection = await amqplib.connect(this.url);
            this.channel = await this.connection.createChannel();
           
            this.channel.assertQueue(this.queue);

            console.log(`Connection successful`);

        } catch (error) {
            console.log(error)
        }
    }

    publishMessage(message) {

        console.log(this,this.channel)

        this.channel.sendToQueue(this.queue, Buffer.from(message));

        console.log(message);

    }

    
}


export class MQReceiver {

    queue = 'ticks';

    constructor(url) {
        this.url = url;   
    }

    async connect() {
        try {

            this.connection = await amqplib.connect(this.url);
            this.channel = await this.connection.createChannel();

            console.log(`Connection successful`);

        } catch (error) {
            console.log(error)
        }
    }

    receiveMessage() {

        console.log(this.channel)
        this.channel.consume(queue, (msg) => {
            if (msg !== null) {
                console.log('Recieved:', msg.content.toString());
                this.channelConsume.ack(msg);
            } else {
                console.log('Consumer cancelled by server');
            }
        });

    }

}

