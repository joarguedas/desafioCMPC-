import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  Grid,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { getBooks, exportBooks, createBook, updateBook, deleteBook } from "@/services/booksService";
import { saveAs } from "file-saver";
import type { Book } from "@/types/book";
import GenericFormDialog from "@/components/GenericFormDialog";
import { useAuth } from "@/hooks/useAuth";

const Books = () => {
  const { user } = useAuth();
  const isAdmin = ["admin", "superadmin"].includes(user?.role);

  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [title, setTitle] = useState("");
  const [isbn, setIsbn] = useState("");
  const [genreId, setGenreId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [publisherId, setPublisherId] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const fetchData = async () => {
    try {
      const filters: any = {
        page,
        limit,
        all: false,
        ...(title && { title }),
        ...(isbn && { isbn }),
        ...(genreId && { genreId }),
        ...(authorId && { authorId }),
        ...(publisherId && { publisherId }),
      };

      const response = await getBooks(filters);
      const data = Array.isArray(response.data) ? response.data : [];

      setBooks(data);
      setTotal(response.total || 0);
    } catch (err) {
      console.error("Error al cargar libros:", err);
      setBooks([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit]);

  const handleFilter = () => {
    setPage(1);
    fetchData();
  };

  const handleClearFilters = () => {
    setTitle("");
    setIsbn("");
    setGenreId("");
    setAuthorId("");
    setPublisherId("");
    setPage(1);
    fetchData();
  };

  const handleExport = async () => {
    try {
      const filters: any = {
        ...(title && { title }),
        ...(isbn && { isbn }),
        ...(genreId && { genreId }),
        ...(authorId && { authorId }),
        ...(publisherId && { publisherId }),
      };
      const blob = await exportBooks(filters);
      const csvBlob = new Blob([blob], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, "books.csv");
    } catch (err) {
      console.error("Error al exportar libros:", err);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingBook) {
        await updateBook(editingBook.id, values);
      } else {
        await createBook(values);
      }
      setOpenForm(false);
      setEditingBook(null);
      fetchData();
    } catch (err) {
      console.error("Error al guardar libro:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este libro?")) {
      try {
        await deleteBook(id);
        fetchData();
      } catch (err) {
        console.error("Error al eliminar libro:", err);
      }
    }
  };

  const totalPages = Math.ceil(total / limit);

  const formFields = [
    { name: "title", label: "Título", type: "text", required: true },
    { name: "isbn", label: "ISBN", type: "text", required: true },
    { name: "authorId", label: "Autor ID", type: "number", required: true },
    { name: "genreId", label: "Género ID", type: "number", required: true },
    { name: "publisherId", label: "Editorial ID", type: "number", required: true },
    { name: "description", label: "Descripción", type: "text" },
    { name: "price", label: "Precio", type: "number" },
    { name: "stock", label: "Stock", type: "number" },
    { name: "publishedAt", label: "Fecha de Publicación", type: "date" },
    { name: "imageUrl", label: "URL de la Imagen", type: "text" },
  ];

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Libros</Typography>
        <Box display="flex" gap={2}>
          <Select
            size="small"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            {[10, 20, 50].map((val) => (
              <MenuItem key={val} value={val}>
                {val}
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
          >
            Exportar CSV
          </Button>
          {isAdmin && (
            <Button variant="contained" onClick={() => setOpenForm(true)}>
              Crear libro
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="Título" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField label="ISBN" fullWidth value={isbn} onChange={(e) => setIsbn(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField label="Género ID" fullWidth value={genreId} onChange={(e) => setGenreId(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField label="Autor ID" fullWidth value={authorId} onChange={(e) => setAuthorId(e.target.value)} />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <TextField label="Editorial ID" fullWidth value={publisherId} onChange={(e) => setPublisherId(e.target.value)} />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleFilter}>Filtrar</Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={handleClearFilters}>Limpiar</Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Autor</TableCell>
              <TableCell>Género</TableCell>
              <TableCell>Editorial</TableCell>
              <TableCell>Publicado</TableCell>
              {isAdmin && <TableCell>Acciones</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((book) => (
              <TableRow key={book.id}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.author?.name || "—"}</TableCell>
                <TableCell>{book.genre?.name || "—"}</TableCell>
                <TableCell>{book.publisher?.name || "—"}</TableCell>
                <TableCell>{book.publishedAt}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <Button onClick={() => { setEditingBook(book); setOpenForm(true); }}>Editar</Button>
                    <Button color="error" onClick={() => handleDelete(book.id)}>Eliminar</Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box mt={2} display="flex" justifyContent="center" gap={1}>
          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i + 1}
              variant={page === i + 1 ? "contained" : "outlined"}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </Box>
      )}

      {isAdmin && (
        <GenericFormDialog
          open={openForm}
          onClose={() => { setOpenForm(false); setEditingBook(null); }}
          defaultValues={editingBook || {}}
          onSubmit={handleSubmit}
          title={editingBook ? "Editar Libro" : "Crear Libro"}
          fields={formFields}
        />
      )}
    </Box>
  );
};

export default Books;
