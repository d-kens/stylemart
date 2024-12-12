import { KafkaOptions, Transport } from '@nestjs/microservices';

import * as dotenv from 'dotenv';

dotenv.config();
const brokers = process.env.BROKERS
  ? process.env.BROKERS.split(',')
  : ['localhost:9092'];

export const microserviceConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'auth',
      brokers,
      retry: {
        retries: 10,
      },
    },
    producer: {
      allowAutoTopicCreation: true,
    },
    consumer: {
      groupId: 'auth-consumer-group',
    },
    subscribe: {
      fromBeginning: true,
    },
  },
};
