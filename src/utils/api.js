import axios from "axios";

const api = async (
  addPath,
  method,
  data = null,
  params = {},
  headers = {},
  contentType = "application/json",
  responseType = "json"
) => {
  axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
  const baseUrl = 'https://hm2.ir/'


  return await new Promise((resolve, reject) => {
    axios({
      baseURL: baseUrl,
      url: addPath,
      method,
      responseType,
      contentType,
      headers,
      params,
      data,
    })
      .then((res) => {
        resolve(res)
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export default api;