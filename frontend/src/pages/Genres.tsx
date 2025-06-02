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

interface Genre {
  id: number;
  name: string;
  status: boolean;
  createdAt: string;
}

const Genres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchGenres = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/genres?page=${page + 1}&limit=${limit}&all=false`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGenres(res.data.data);
      setTotal(res.data.total);
    } catch (err: any) {
      setError(err.message || 'Error al cargar géneros');
    }
  };

  useEffect(() => {
    fetchGenres();
  }, [page, limit]);

  const handleCreate = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/genres', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Género creado correctamente');
      fetchGenres();
      setOpenDialog(false);
    } catch (err: any) {
      setError(err.message || 'Error al crear género');
    }
  };

  const handleUpdate = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/genres/${editingGenre?.id}`, { name: data.name }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Género actualizado correctamente');
      fetchGenres();
      setOpenDialog(false);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar género');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/genres/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Género desactivado correctamente');
      fetchGenres();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar género');
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Géneros</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
          setEditingGenre(null);
          setOpenDialog(true);
        }}>
          Crear Género
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
            {genres.map((genre) => (
              <TableRow key={genre.id}>
                <TableCell>{genre.name}</TableCell>
                <TableCell>{genre.status ? 'Activo' : 'Inactivo'}</TableCell>
                <TableCell>{new Date(genre.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => {
                    setEditingGenre(genre);
                    setOpenDialog(true);
                  }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(genre.id)}>
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
        title={editingGenre ? 'Editar Género' : 'Crear Género'}
        open={openDialog}
        onClose={() => { setOpenDialog(false); setEditingGenre(null); }}
        onSubmit={editingGenre ? handleUpdate : handleCreate}
        fields={[
          {
            name: 'name',
            label: 'Nombre',
            type: 'text',
            required: true,
          },
        ]}
        defaultValues={editingGenre || {}}
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

export default Genres;
