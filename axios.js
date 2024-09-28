const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const imageFilePath = "";
const apiKey = 'your-api-key';

const formData = new FormData();
formData.append('file', fs.createReadStream(imageFilePath));
formData.append('prompt', 'Describe this image in detail.');

axios.post('https://api.openai.com/v1/chat/completions', formData, {
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    ...formData.getHeaders()
  }
})
.then(response => {
  console.log('Response from API:', response.data);
})
.catch(error => {
  console.error('Error:', error);
});