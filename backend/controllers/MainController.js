const CepByApi = require("../services/CepApi");
const MainController = {
  async getAddressByCep(req, res) {
    try {
      const { number } = req.params;
      const address = await CepByApi.getAddress(number);
      const { cep, state, city, neighborhood, street } = address;
      const response = {
        cep,
        uf: state,
        cidade: city,
        bairro: neighborhood,
        rua: street,
      };
      return res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error:
          "Não foi possível atender sua requisição nesse momento, tente novamente mais tarde",
      });
    }
  },
};

module.exports = MainController;
