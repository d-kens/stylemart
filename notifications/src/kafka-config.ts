import { KafkaOptions, Transport } from "@nestjs/microservices";
import { logLevel } from "@nestjs/microservices/external/kafka.interface";

import * as dotenv from 'dotenv';

dotenv.config();
const brokers = process.env.BROKERS
  ? process.env.BROKERS.split(',')
  : ['localhost:9092'];

export const microserviceConfig: KafkaOptions = {
    transport: Transport.KAFKA,
    options: {
        client: {
            clientId: 'notifications',
            brokers,
            logLevel: logLevel.INFO,
        },
        consumer: {
            groupId: 'notifications-consumer-group',
            allowAutoTopicCreation: true,
        },
    }
}

export function getClientKafkaConfig() {
    return {
      client: microserviceConfig.options.client,
      consumer: microserviceConfig.options.consumer,
      subscribe: microserviceConfig.options.subscribe,
      run: microserviceConfig.options.run,
    };
  }