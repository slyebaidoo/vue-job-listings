// Dynamic API URL based on environment
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://my-json-server.typicode.com/slyebaidoo/vue-jobs-json-server' 
  : 'http://localhost:5000/api';

export default API_BASE_URL;