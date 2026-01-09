import axios from "axios"
const setting = {
  domain: "emam-api.web.id", // api domain 
  version: "1.0.0", // libraries version 
  name: "emam-apis", // The name of the Creator 
  createor_nums: {
  main: "+201144480436", // my num 
  bot: "+201275544569" // my bot num (if you want to test it content with me)
  },
  description: "emam API libraries i make it To collect all api in one Place",
  client: async function(endpoint, options = {}) {
    const baseURL = `https://${this.domain}`; // Build Url
    
    const $client = axios.create({
      baseURL: baseURL,
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        ...options.headers
      },
      ...options
    });
    
    try {
      const response = await $client.request({
        url: endpoint,
        method: options.method || 'GET',
        data: options.data || null,
        params: options.params || null,
        ...options
      });
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
 
export default setting;
