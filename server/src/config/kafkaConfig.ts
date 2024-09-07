import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: '2yakm-alarm-service',
  brokers: ['localhost:9092'] // 카프카 브로커 주소
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: 'email-group' });

export default kafka;