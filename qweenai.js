import setting from '../../default.js';

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

  const res = await setting.client('/home/sections/Ai/api/qwen-chat', {
    method: 'POST',
    data: body
  });
  
  return res.answer;
};

export { qwenChat };
