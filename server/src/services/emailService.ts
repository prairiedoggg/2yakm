import nodemailer from 'nodemailer';
import { consumer } from '../config/kafkaConfig';
import { pool } from '../db';

const sendEmail = async (
  recipientEmail: string,
  alarmName: string,
  alarmTime: string
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: '이약뭐약 약 알람 서비스입니다.',
    html: `
    <h1>이약뭐약 약 알람 서비스</h1>
    <br/>
    <p>알람 이름: <strong>${alarmName}</strong></p>
    <p>알람 시간: <strong>${alarmTime}</strong></p>
    <br/>
    <p>안녕하세요!</p>
    <p>지금은 약을 드실 시간입니다. 복용 방법에 따라 정확히 복용해주세요.</p>
    <br/>
    <br/>
    <img src="https://res.cloudinary.com/dnxyampqy/image/upload/v1723135153/llflxzkmg9qlfw1pi4xu.png" alt="약 이미지" style="width:201px;height:auto;">
    <br/>
    <p>서비스를 이용해 주셔서 감사합니다.</p>
  `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('이메일 발송 실패:', error);
    return false;
  }
};

const getUserEmail = async (userId: string): Promise<string> => {
  const query = 'SELECT email FROM users WHERE id = $1';
  const result = await pool.query(query, [userId]);
  if (result.rows.length === 0) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  return result.rows[0].email;
};

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'alarm-email', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const { alarm, userId, name } = JSON.parse(message.value!.toString());
      try {
        const userEmail = await getUserEmail(userId);
        await sendEmail(userEmail, alarm.name, alarm.times[0].time);
        console.log(`이메일 전송 성공: ${userId}, ${alarm.name}, ${alarm.times[0].time}`);
      } catch (error) {
        console.error('이메일 전송 실패:', error);
      }
    },
  });
};

run().catch(console.error);