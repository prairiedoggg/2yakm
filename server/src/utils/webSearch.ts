const axios = require('axios');

async function webSearch(query: string) {
  try {
    if (!query) {
      throw new Error('검색 쿼리가 제공되지 않았습니다.');
    }

    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_CSE_ID,
        q: query
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'axios/1.7.2',
        'Accept-Encoding': 'gzip, compress, deflate, br'
      }
    });

    return response.data.items ?? [];
  } catch (error) {
    console.error('웹 검색 오류:', error);
    if (axios.isAxiosError(error)) {
      console.error('API 응답 데이터:', (error as any).response?.data);
    }
    throw error;
  }
}

module.exports = webSearch;