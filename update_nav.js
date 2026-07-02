const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

const newNavTemplate = `      <nav class="sidebar-nav">
        <label class="nav-label">Consultas</label>
        <a href="cep.html" class="nav-item"><i class="ph ph-map-pin-line"></i> Busca CEP</a>
        <a href="cnpj.html" class="nav-item"><i class="ph ph-buildings"></i> Busca CNPJ</a>
        <a href="ddd.html" class="nav-item"><i class="ph ph-phone"></i> DDD Cidades</a>
        
        <label class="nav-label">Finanças</label>
        <a href="taxas.html" class="nav-item"><i class="ph ph-trend-up"></i> Taxas (Selic)</a>
        <a href="cambio.html" class="nav-item"><i class="ph ph-currency-circle-dollar"></i> Câmbio</a>
        <a href="pix.html" class="nav-item"><i class="ph ph-qr-code"></i> Bancos PIX</a>
        <a href="bancos.html" class="nav-item"><i class="ph ph-bank"></i> Cód. Bancos</a>
        
        <label class="nav-label">Serviços</label>
        <a href="index.html" class="nav-item"><i class="ph ph-cloud-sun"></i> Clima & Tempo</a>
        <a href="rastreio.html" class="nav-item"><i class="ph ph-package"></i> Rastreio</a>
        
        <label class="nav-label">Geral</label>
        <a href="ncm.html" class="nav-item"><i class="ph ph-barcode"></i> Busca NCM</a>
        <a href="feriados.html" class="nav-item"><i class="ph ph-calendar-blank"></i> Feriados</a>
        <a href="dominio.html" class="nav-item"><i class="ph ph-globe"></i> Domínios BR</a>
        <a href="isbn.html" class="nav-item"><i class="ph ph-book"></i> ISBN Livros</a>
        
        <div style="margin-top: auto;`;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/<nav class="sidebar-nav">[\s\S]*?<div style="margin-top: auto;/m, newNavTemplate);
  content = content.replace(/class="nav-item active"/g, 'class="nav-item"');
  const regex = new RegExp(`href="${file}" class="nav-item"`);
  content = content.replace(regex, `href="${file}" class="nav-item active"`);
  fs.writeFileSync(file, content);
}
console.log("Updated HTML files.");
