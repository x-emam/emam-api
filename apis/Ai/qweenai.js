import axios from 'axios';

const client = axios.create({
  baseURL: "https://emam-api.web.id"
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

  try {
    const res = await client.request({
      url: '/home/sections/Ai/api/qwen-chat',
      method: 'POST',
      data: body
    });
    
    return res.data.answer; 
  } catch (error) {
    console.error('Error in qwenChat:', error);
    throw error;
  }
};

export { qwenChat };