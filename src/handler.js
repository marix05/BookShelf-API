const { nanoid } = require('nanoid');
const books = require('./books');

const addNewBookHandler = (request, h) => {
  // body request 
  const { 
    name, 
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // jika nama buku tidak diisi dalam body request
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // jika jumlah halaman yang dibaca lebih besar dari jumlah halaman yang tersedia di buku 
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = (pageCount === readPage);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // membuat variabel objek berisi data buku baru
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // menambahkan data buku baru kedalam bookshelf
  books.push(newBook);

  // mengecek apakah buku yang ditambahkan dengan spesifik id telah berhasil ditambahkan
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  // jika buku berhasil ditambahkan
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  // jika buku tidak berhasil ditambahkan
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBookHandler = (request, h) => {
  // query request
  const { name, reading, finished } = request.query;

  // dideklarasikan dengan let agar variabel searchBooks bisa didefinsikan ulang
  let searchBooks = books;

  // jika query request name terdefinisi
  if (name) {
    // searchBooks akan terdefinisikan buku yang telah disaring sesuai dengan nama buku yang diminta
    searchBooks = searchBooks.filter((book) => book.name.toLowerCase()
      .includes(name.toLowerCase()));
  }

  // jika query request reading terdefinisi
  if (reading) {
    /* searchBooks akan terdefinisikan buku yang telah disaring sesuai dengan permintaan dari 
    buku yang sedang dibaca atau belum [true(1) == sedang dibaca || false(0) == tidak dibaca] */
    searchBooks = searchBooks.filter((book) => Number(book.reading) === Number(reading));
  }

  // jika query reques finished terdefinsi
  if (finished) {
    /* searchBooks akan terdefinisikan buku yang telah disaring sesuai dengan permintaan dari 
    buku yang selesai dibaca atau belum [true(1) == selesai dibaca || false(0) == belum dibaca] */
    searchBooks = searchBooks.filter((book) => Number(book.finished) === Number(finished));
  }

  // memanfaatkan method map, karena map akan menghasilkan array baru
  const response = h.response({
    status: 'success',
    data: {
      books: searchBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  // params request
  const { bookId } = request.params;

  // mendapatkan buku dari array yang telah disaring dengan spesifik id yang diminta 
  const book = books.filter((b) => b.id === bookId)[0];

  // jika buku dengan spesifik id yang diminta ditemukan 
  if (book) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  // jika buku dengan spesifik id yang diminta tidak ditemukan 
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  // params request
  const { bookId } = request.params;

  // body request 
  const { 
    name, 
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // jika nama buku tidak diisi dalam body request
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  // jika jumlah halaman yang dibaca lebih besar dari jumlah halaman yang tersedia di buku 
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const updatedAt = new Date().toISOString();

  // mencari indeks dari buku yang memiliki id yang spesifik sesuai dengan permintaan
  const index = books.findIndex((book) => book.id === bookId);
  
  // jika index dari buku ditemukan
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name, 
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // jika index dari buku tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  // params request
  const { bookId } = request.params;

  // mencari indeks dari buku yang memiliki id yang spesifik sesuai dengan permintaan
  const index = books.findIndex((book) => book.id === bookId);

  // jika index dari buku ditemukan
  if (index !== -1) {
    books.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // jika index dari buku tidak ditemukan
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { 
  addNewBookHandler,
  getAllBookHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
