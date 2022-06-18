const { 
  addNewBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

const routes = [
  // route menambahkan buku
  {
    method: 'POST',
    path: '/books',
    handler: addNewBookHandler,
  },

  // route mengambil data keseluruhan buku
  {
    method: 'GET',
    path: '/books',
    handler: getAllBookHandler,
  },

  // route mengambil data buku dengan id yang spesifik
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },

  // route mengedit data buku dengan id yang spesifik
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },

  // route menghapus data buku dengan id yang spesifik
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;
