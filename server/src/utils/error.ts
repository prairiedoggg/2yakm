
export const commonError = {
    NO_ACCESS_TOKEN: { name: 'NoAccessToken', message: '액세스 토큰이 없음.' },
    INVALID_TOKEN: { name: 'InvalidToken', message: '토큰이 유효하지 않음' },
    EXPIRED_TOKEN: { name: 'ExpiredToken', message: '토큰이 만료됨' },
  };
  
export function createError(name: string, message: string, status: number) {
    const error = new Error(message) as any;
    error.name = name;
    error.status = status;
    return error;
  }