import HttpRequest from '@/utils/axios'

import defaultSettings from '@/config/defaultSettings'

const baseUrl = process.env.NODE_ENV === 'development' ? defaultSettings.baseUrl.dev : defaultSettings.baseUrl.pro

const axios = new HttpRequest(baseUrl)

export default axios
