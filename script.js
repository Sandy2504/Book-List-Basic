// Globale Variablen für die Buchliste und die Anzahl der Bücher pro Seite
let bookList = [];
let currentPage = 1;
const booksPerPage = 5; // 5 Bücher pro Seite

// URL für die Buchliste
const booklistUrl = "http://localhost:4730/books/";

// Funktion zum Laden der Buchliste beim Start der Anwendung
function loadBookList() {
  fetch(booklistUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Es gibt ein Netzwerkproblem.");
      }
      return response.json();
    })
    .then((booksFromApi) => {
      if (booksFromApi.length > 0) {
        bookList = booksFromApi;
        renderBookList();
      } else {
        alert("Entschuldigung, keine Bücher vorhanden.");
      }
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Funktion zum Rendern der Buchliste für die aktuelle Seite
function renderBookList() {
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const booksOnPage = bookList.slice(startIndex, endIndex);

  const list = document.querySelector("#books-list");
  list.innerHTML = "";
  booksOnPage.forEach((book) => {
    const li = document.createElement("li");
    li.innerHTML = `
            <header>
                <h3>${book.title}</h3>
                <p>${book.author}</p>
            </header>
            <p>ISBN: ${book.isbn}</p>
            <a href="./book.html?isbn=${book.isbn}">Read more...</a>
            <button id="${book.isbn}" onclick="toggleFavorite(this)">${
      book.isFavorite ? "Remove from Favorites" : "Add to Favorites"
    }</button>
        `;
    list.appendChild(li);
  });

  renderPagination(); // Hier wird renderPagination aufgerufen
}

// Funktion zum Rendern der Paginierungssteuerelemente
function renderPagination() {
  const totalPages = Math.ceil(bookList.length / booksPerPage);
  const paginationContainer = document.querySelector(".pagination");

  if (paginationContainer) {
    paginationContainer.innerHTML = "";

    // Next Button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.onclick = function () {
      currentPage++;
      renderBookList();
    };
    paginationContainer.appendChild(nextButton);
  } else {
    console.error("Pagination container not found");
  }
}

// Funktion, um ein Buch zu den Favoriten hinzuzufügen oder zu entfernen
function toggleFavorite(button) {
  const isbn = button.id;
  const bookIndex = bookList.findIndex((book) => book.isbn === isbn);
  const isFavorite = bookList[bookIndex].isFavorite;

  if (!isFavorite) {
    bookList[bookIndex].isFavorite = true;
  } else {
    bookList[bookIndex].isFavorite = false;
  }

  renderBookList();
}

// Buchliste laden, wenn die Seite geladen wird
loadBookList();
