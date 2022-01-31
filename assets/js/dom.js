const UNCOMPLETED_BOOK_LIST = "incompleteBookshelfList";
const COMPLETED_BOOK_LIST = "completeBookshelfList";
const BOOK_ITEMID = "itemId";

function addBook() {
  const uncompletedBook = document.getElementById(UNCOMPLETED_BOOK_LIST);
  const completedBook = document.getElementById(COMPLETED_BOOK_LIST);

  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const checkBookCompleted = document.getElementById("inputBookIsComplete");

  if (checkBookCompleted.checked) {
    const book = makeBook(bookTitle, bookAuthor, bookYear, true);
    //
    const bookObject = composeToObject(bookTitle, bookAuthor, bookYear, true);
    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);
    //
    completedBook.append(book);
    //
    updateDataToStorage();
  } else {
    const book = makeBook(bookTitle, bookAuthor, bookYear, false);
    //
    const bookObject = composeToObject(bookTitle, bookAuthor, bookYear, false);
    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);
    //
    uncompletedBook.append(book);
    //
    updateDataToStorage();
  }
}

function makeBook(title, author, year, isComplete, findBook) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Penulis: " + author;

  const textYear = document.createElement("p");
  textYear.innerText = "Tahun: " + year;

  const buttonList = document.createElement("div");
  buttonList.classList.add("action");

  const bookItem = document.createElement("article");
  bookItem.classList.add("book_item");
  bookItem.append(textTitle, textAuthor, textYear, buttonList);

  //

  if (isComplete) {
    buttonList.append(createUndoButton(), createTrashButton());
  } else {
    buttonList.append(createCheckButton(), createTrashButton());
  }

  return bookItem;
}

//
function createButton(buttonTypeClass, buttonTeks, eventListener, btnRemove) {
  const button = document.createElement("button");
  button.classList.add(buttonTypeClass);
  button.innerText = buttonTeks;
  //untuk memberikan dialogbox saat tombol btn-remove ditekan
  if (btnRemove) {
    button.addEventListener("click", function (e) {
      const confirmDelete = confirm("Hapus list ?");
      if (confirmDelete) {
        eventListener(e);
      }
    });
  } else {
    button.addEventListener("click", function (e) {
      eventListener(e);
    });
  }

  return button;
}

function addBookToCompleted(bookElement) {
  const parent = bookElement.parentElement;
  const contents = parent.querySelectorAll("p");
  const textTitle = parent.querySelector("h3").innerText;
  const textAuthor = contents[0].innerText
    .split(" ")
    .filter((auth) => auth !== "Penulis:")
    .join(" ");
  const textYear = contents[1].innerText
    .split(" ")
    .filter((year) => year !== "Tahun:")
    .join(" ");
  const newBook = makeBook(textTitle, textAuthor, textYear, true);
  //
  const book = findBook(parent[BOOK_ITEMID]);
  book.isComplete = true;
  newBook[BOOK_ITEMID] = book.id;
  //

  const listCompleted = document.getElementById(COMPLETED_BOOK_LIST);
  listCompleted.append(newBook);
  bookElement.parentElement.remove();

  //
  updateDataToStorage();
  //
}

function createCheckButton() {
  return createButton("green", "Selesai dibaca", function (e) {
    addBookToCompleted(e.target.parentElement);
  });
}

function removeBookFromCompleted(bookElement) {
  const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
  books.splice(bookPosition, 1);

  bookElement.remove();
  updateDataToStorage();
}

function createTrashButton() {
  return createButton(
    "red",
    "Hapus buku",
    function (e) {
      removeBookFromCompleted(e.target.parentElement.parentElement);
    },
    //
    true
    //
  );
}

function undoBookFromCompleted(bookElement) {
  const listUncompleted = document.getElementById(UNCOMPLETED_BOOK_LIST);
  const parent = bookElement.parentElement;
  const contents = parent.querySelectorAll("p");
  const textTitle = parent.querySelector("h3").innerText;
  const textAuthor = contents[0].innerText
    .split(" ")
    .filter((auth) => auth !== "Penulis:")
    .join(" ");
  const textYear = contents[1].innerText
    .split(" ")
    .filter((year) => year !== "Tahun:")
    .join(" ");

  const newBook = makeBook(textTitle, textAuthor, textYear, false);

  //
  const book = findBook(parent[BOOK_ITEMID]);
  book.isComplete = false;
  newBook[BOOK_ITEMID] = book.id;
  //

  listUncompleted.append(newBook);
  bookElement.parentElement.remove();

  //
  updateDataToStorage();
  //
}

function createUndoButton() {
  return createButton("green", "Belum selesai di Baca", function (e) {
    undoBookFromCompleted(e.target.parentElement);
  });
}

//pencarian buku
document.getElementById("searchBook").addEventListener("submit", function (e) {
  e.preventDefault();
  const keyword = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const books = document.querySelectorAll("article");
  Array.from(books).forEach(function (book) {
    const title = book.firstElementChild.textContent;
    if (title.toLocaleLowerCase().indexOf(keyword) != -1) {
      book.style.display = "block";
    } else {
      book.style.display = "none";
    }
  });
});
