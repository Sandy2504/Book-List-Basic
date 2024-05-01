const apiUrl = "http://localhost:4730/books/";
const url = new URL(window.location.href);
const isbn = url.searchParams.get("isbn");
let singleBook;

if (isbn) {
  loadSingleBook();
} else {
  showErrorMessage();
}

async function loadSingleBook() {
  const fetchedBook = await fetch(apiUrl + isbn);
  if (fetchedBook.ok) {
    const bookData = await fetchedBook.json();
    singleBook = bookData;
    renderSingleBook(singleBook);
  } else {
    showErrorMessage();
  }
}

function showErrorMessage() {
  alert("Fml. No. Book. Here.");
}

function renderSingleBook(singleBook) {
  const main = document.querySelector("main");
  main.innerHTML = "";

  const renderImage = document.createElement("img");
  renderImage.src = singleBook.cover;
  main.appendChild(renderImage);

  const renderArticle = document.createElement("article");
  renderArticle.className = "book-information";

  const bookTitle = document.createElement("h2");
  bookTitle.id = "book-title";
  bookTitle.innerText = singleBook.title;
  renderArticle.appendChild(bookTitle);

  const bookAuthor = document.createElement("h3");
  bookAuthor.id = "book-author";
  bookAuthor.innerText = singleBook.author;
  renderArticle.appendChild(bookAuthor);

  const br = document.createElement("br");
  renderArticle.appendChild(br);

  const isbnElement = document.createElement("p");
  isbnElement.id = "book-isbn";
  isbnElement.innerText = "ISBN: " + singleBook.isbn;
  renderArticle.appendChild(isbnElement);

  const details = document.createElement("h3");
  details.innerText = "Ausschnitt";
  renderArticle.appendChild(details);

  const description = document.createElement("p");
  description.className = "book-description";
  description.innerText = singleBook.abstract;
  renderArticle.appendChild(description);

  main.appendChild(renderArticle);
}
