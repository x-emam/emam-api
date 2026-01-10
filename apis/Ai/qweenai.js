import axios from 'axios';

const client = axios.create({
  baseURL: 'https://emam-api.web.id',
  headers: {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
  }
});

const qwenChat = async (q, options = {}) => {
  const { 
    image = null, 
    video = null, 
    audio = null, 
    document = null, 
    text2image = false, 
    size = '1:1',
    search = false, 
    thinking = false 
  } = options;

  const body = {
    q,
    text2image,
    size,
    search,
    thinking
  };

  if (image) body.image = image;
  if (video) body.video = video;
  if (audio) body.audio = audio;
  if (document) body.document = document;

  const res = await client.post('/home/sections/Ai/api/qwen-chat', body);
  return res.data.answer;
};

export { qwenChat };