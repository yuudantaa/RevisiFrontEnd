
/**
 * [
 *    {
 *      id: <int>
 *      task: <string>
 *      timestamp: <string>
 *      isCompleted: <boolean>
 *    }
 * ]
 */

const books = [];
const RENDER_EVENT = 'render-books';

function generateId() {
  return +new Date();
}

function generateTodoObject(id, title, author,year, isCompleted) {
  return {
    id, title, author,year, isCompleted
  }
}

function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function makeBook(bookObject) {
  const {id, title, author,year, isCompleted} = bookObject;

  const textTitle = document.createElement('h3');
  textTitle.innerText = title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = author;

  const textYear = document.createElement('p');
  textYear.innerText = year;

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textAuthor,textYear);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute("data-tesid",id);

  if (isCompleted) {
    const checkButton = document.createElement('button');
    checkButton.classList.add('btnComplete');
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });

    const undoButton = document.createElement('button');
    undoButton.classList.add('btnEdit');
    undoButton.addEventListener('click', function () {
      editTask(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('btnDelete');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    container.append(checkButton,undoButton, trashButton);

  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('btnComplete');
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });

    const undoButton = document.createElement('button');
    undoButton.classList.add('btnEdit');
    undoButton.addEventListener('click', function () {
      editTask(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('btnDelete');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    container.append(checkButton,undoButton, trashButton);
  }

  return container;
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKS_APP';
 
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function saveData(){
  if(isStorageExist()){
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function addBook() {
  const textTitle = document.getElementById('bookFormTitle').value;
  const textAuthor = document.getElementById('bookFormAuthor').value;
  const textYear = document.getElementById('bookFormYear').value;
  const isComplete = document.getElementById('bookFormIsComplete').checked;

  const generatedID = generateId();
  const bookObject = generateTodoObject(generatedID, textTitle, textAuthor,textYear, isComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = !bookTarget.isCompleted; // Toggle completion state
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = !bookTarget.isCompleted; // Toggle completion state
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeTaskFromCompleted(bookId /* HTMLELement */) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  books.splice(bookTarget, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function editTask(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  const newTitle = prompt("Enter the new title:", bookTarget.title);
  const newAuthor = prompt("Enter the new author:", bookTarget.author);
  const newYear = prompt("Enter the new year:", bookTarget.year);

  if (newTitle !== null && newAuthor !== null && newYear !== null) {
    bookTarget.title = newTitle;
    bookTarget.author = newAuthor;
    bookTarget.year = newYear;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function () {
  const submitForm /* HTMLFormElement */ = document.getElementById('bookForm');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});


document.addEventListener(RENDER_EVENT, function () {
  const uncompleteBookList = document.getElementById('incompleteBookList');
  const listCompleted = document.getElementById('completeBookList');

  // clearing list item
  uncompleteBookList.innerHTML = '';
  listCompleted.innerHTML = '';

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompleteBookList.append(bookElement);
    }
  }

  document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
  });
  
});