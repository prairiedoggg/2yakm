const axios = require('axios');
require('dotenv').config();

async function webSearch(query: string) {
  try {
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_CSE_ID,
        q: query
      }
    });
    return response.data.items;
  } catch (error) {
    console.error('웹 검색 오류:', error);
    throw error;
  }
}

module.exports = webSearch;