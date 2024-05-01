document.body.addEventListener("submit", (event) => {
  event.preventDefault();
});

const booklistUrl = "http://localhost:4730/books/";

const bookList = [];
let favoriteBooks = [];

loadBookList();

function loadBookList() {
  fetch(booklistUrl)
    .then((response) => {
      if (!response.ok) {
        alert("There is a network error");
      }
      return response.json();
    })
    .then((booksFromApi) => {
      const favoriteBooksFromApi = booksFromApi.filter(
        (book) => book.isFavorite
      );
      if (favoriteBooksFromApi.length > 0) {
        bookList.push(...favoriteBooksFromApi);
        renderBookList(bookList);
      } else {
        if (bookList.length === 0) {
          alert("Sorry, no favorites for you.");
        }
      }
    });
}

function renderBookList(randomList) {
  const list = document.querySelector("#books-list");
  list.innerHTML = "";
  randomList.forEach((book) => {
    const wrapperLi = document.createElement("li");

    const wrapHeader = document.createElement("header");

    const bookTitle = document.createElement("h3");
    bookTitle.innerText = book.title;
    wrapHeader.appendChild(bookTitle);

    const author = document.createElement("p");
    author.innerText = book.author;
    wrapHeader.appendChild(author);

    wrapperLi.appendChild(wrapHeader);

    const isbn = document.createElement("p");
    isbn.innerText = "ISBN: " + book.isbn;
    wrapperLi.appendChild(isbn);

    const bookLink = document.createElement("a");
    bookLink.innerText = "Read more...";
    bookLink.href = "./book.html?isbn=" + book.isbn;
    wrapperLi.appendChild(bookLink);

    const favoBtn = document.createElement("button");
    if (book.isFavorite === true) {
      favoBtn.innerText = "Remove from Favorites";
    } else {
      favoBtn.innerText = "Add to Favorites";
    }
    favoBtn.id = book.isbn;
    wrapperLi.appendChild(favoBtn);

    list.appendChild(wrapperLi);

    favoBtn.addEventListener("click", addToFavorites);
  });
}

function addToFavorites(event) {
  const addedBook = event.target.id;
  const bookIndex = bookList.findIndex((book) => book.isbn === addedBook);

  if (event.target.innerText === "Add to Favorites") {
    favoriteBooks.push(bookList[bookIndex]);
    event.target.innerText = "Remove from Favorites";
  } else if (event.target.innerText === "Remove from Favorites") {
    favoriteBooks = favoriteBooks.filter(
      (favorite) => favorite.isbn !== addedBook
    );
    event.target.innerText = "Add to Favorites";
  }

  updateBookList(bookIndex);
}

function updateBookList(bookIndex) {
  const updatedBook = bookList[bookIndex];
  const updateUrl = booklistUrl + updatedBook.isbn;
  updatedBook.isFavorite = !updatedBook.isFavorite;

  fetch(updateUrl, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedBook),
  })
    .then((response) => {
      if (!response.ok) {
        alert("Failed to update book.");
      }
      return response.json();
    })
    .then((updatedBookFromApi) => {
      bookList[bookIndex] = updatedBookFromApi;
      renderBookList(bookList);
    });
}
