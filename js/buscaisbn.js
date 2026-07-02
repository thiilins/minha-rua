const inputIsbn = document.getElementById("isbn");
const errorMsg = document.getElementById("error-msg");
const loading = document.getElementById("loading");
const results = document.getElementById("results");

const bookCoverContainer = document.getElementById("book-cover-container");
const bookCover = document.getElementById("book-cover");
const bookTitle = document.getElementById("book-title");
const bookAuthors = document.getElementById("book-authors");
const bookPublisher = document.getElementById("book-publisher");
const bookYear = document.getElementById("book-year");
const bookFormat = document.getElementById("book-format");
const bookSubjects = document.getElementById("book-subjects");
const bookSynopsis = document.getElementById("book-synopsis");

let debounceTimer;

inputIsbn.addEventListener("input", (e) => {
  let val = e.target.value.replace(/\D/g, "");
  e.target.value = val;

  clearTimeout(debounceTimer);
  
  if (val.length === 10 || val.length === 13) {
    debounceTimer = setTimeout(() => {
      fetchIsbn(val);
    }, 500);
  } else {
    results.classList.add("hidden");
    errorMsg.classList.add("hidden");
  }
});

async function fetchIsbn(isbn) {
  results.classList.add("hidden");
  errorMsg.classList.add("hidden");
  loading.classList.remove("hidden");

  try {
    const response = await fetch(`https://brasilapi.com.br/api/isbn/v1/${isbn}`);
    if (!response.ok) throw new Error("ISBN não encontrado");
    
    const data = await response.json();
    populateData(data);
    results.classList.remove("hidden");
  } catch (error) {
    errorMsg.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

function populateData(data) {
  if (data.cover_url) {
    bookCover.src = data.cover_url;
    bookCoverContainer.style.display = "flex";
  } else {
    bookCoverContainer.style.display = "none";
  }

  bookTitle.textContent = data.title;
  bookAuthors.textContent = data.authors ? data.authors.join(", ") : "Autor desconhecido";
  bookPublisher.value = data.publisher || "Não informado";
  bookYear.value = data.year || "Não informado";
  
  const pages = data.page_count ? `${data.page_count} páginas` : "Páginas N/A";
  const format = data.format || "Físico";
  bookFormat.value = `${pages} • ${format}`;

  bookSubjects.innerHTML = "";
  if (data.subjects && data.subjects.length > 0) {
    data.subjects.forEach(sub => {
      const chip = document.createElement("div");
      chip.className = "chip host";
      chip.textContent = sub;
      bookSubjects.appendChild(chip);
    });
  } else {
    bookSubjects.innerHTML = "<span style='color: var(--text-muted); font-size: 13px;'>Nenhum assunto listado</span>";
  }

  bookSynopsis.textContent = data.synopsis || "Nenhuma sinopse disponível para este livro.";
}
