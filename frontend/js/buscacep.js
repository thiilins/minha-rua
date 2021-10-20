let cep = document.querySelector("#cep");
let rua = document.querySelector("#rua");
let cidade = document.querySelector("#cidade");
let bairro = document.querySelector("#bairro");
let UF = document.querySelector("#UF");

cep.onkeyup = async (event) => {
  if (cep.value.length == 8) {
    console.log("Faz a pesquisa na api");
    let resposta = await fetch(`http://localhost:8000/cep/${cep.value}`);
    let dadosDoCep = await resposta.json();

    rua.value = dadosDoCep.rua;
    cidade.value = dadosDoCep.cidade;
    bairro.value = dadosDoCep.bairro;
    UF.value = dadosDoCep.uf;
  }
};
