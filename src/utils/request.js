import config from '@/config';
import HttpRequest from '@/utils/axios';

const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro;

const axios = new HttpRequest(baseUrl);

export default axios;
