const axios = require("axios");
const api = axios.create({
  baseURL: "https://brasilapi.com.br/api/cep/",
});

const methods = {
  async getAddress(cep) {
    try {
      const response = await api.get(`v2/${cep}`);
      if (response.status !== 200) {
        throw new Error({
          info: "Ops, A requisição falhou",
          status: response.status,
          message: response.statusText,
        });
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
};
module.exports = methods;
