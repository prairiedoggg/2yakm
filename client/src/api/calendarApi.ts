import { get, post, put, del } from './api';

// 사용자 일정 전체보기
export const calendarAllGet = async () => {
  try {
    const res = await get('/api/calendars');
    console.log('캘린더 전체 일정 get', res);
    return res;
  } catch (err) {
    console.log('Get Csalendar Data failed', err);
  }
};

// 일정 상세보기
export const calendarGet = async (date: string) => {
  try {
    const res = await get(`/api/calendars/${date}`);
    console.log(`${date} 캘린더 get`, res);
    return res;
  } catch (err) {
    console.log('Get Calendar Data failed', err);
  }
};

export const calendarPost = async (requestBody: object) => {
  try {
    const res = await post('/api/calendars', requestBody);
    console.log('캘린더 post', res);
    return res;
  } catch (err) {
    console.log('Post Calendar Data failed', err);
  }
};

export const calendarPut = async (date: string, requestBody: any) => {
  try {
    console.log('요청값', requestBody);
    const res = await put(`/api/calendars/${date}`, requestBody);
    console.log(`${date} 캘린더 put`, res);
    return res;
  } catch (err) {
    console.log('Put Calendar Data failed', err);
  }
};

export const calendarDelete = async (date: string) => {
  try {
    const res = await del(`/api/calendars/${date}`);
    console.log(`${date} 캘린더 delete`, res.data);
    return res;
  } catch (err) {
    console.log('Delete Calendar Data failed', err);
  }
};
