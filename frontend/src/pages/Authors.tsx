import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
  TablePagination,
  Snackbar,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '@/lib/axios';
import GenericFormDialog from '@/components/GenericFormDialog';

interface Author {
  id: number;
  name: string;
  status: boolean;
  createdAt: string;
}

const Authors = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAuthors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/authors?page=${page + 1}&limit=${limit}&all=false`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuthors(res.data.data);
      setTotal(res.data.total);
    } catch (err: any) {
      setError(err.message || 'Error al cargar autores');
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, [page, limit]);

  const handleCreate = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/authors', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Autor creado correctamente');
      fetchAuthors();
      setOpenDialog(false);
    } catch (err: any) {
      setError(err.message || 'Error al crear autor');
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/authors/${editingAuthor?.id}`, { name: data.name }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Autor actualizado correctamente');
      fetchAuthors();
      setOpenDialog(false);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar autor');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/authors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Autor eliminado correctamente');
      fetchAuthors();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar autor');
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Autores</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
          setEditingAuthor(null);
          setOpenDialog(true);
        }}>
          Crear Autor
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Fecha de Creación</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {authors.map((author) => (
              <TableRow key={author.id}>
                <TableCell>{author.name}</TableCell>
                <TableCell>{author.status ? 'Activo' : 'Inactivo'}</TableCell>
                <TableCell>{new Date(author.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => {
                    setEditingAuthor(author);
                    setOpenDialog(true);
                  }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(author.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={limit}
          onRowsPerPageChange={(e) => {
            setLimit(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </TableContainer>

      <GenericFormDialog
        title={editingAuthor ? 'Editar Autor' : 'Crear Autor'}
        open={openDialog}
        onClose={() => { setOpenDialog(false); setEditingAuthor(null); }}
        onSubmit={editingAuthor ? handleUpdate : handleCreate}
        fields={[
          {
            name: 'name',
            label: 'Nombre',
            type: 'text',
            required: true,
          },
        ]}
        defaultValues={editingAuthor || {}}
      />

      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={3000} onClose={() => setSuccess('')}>
        <Alert severity="success">{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Authors;
