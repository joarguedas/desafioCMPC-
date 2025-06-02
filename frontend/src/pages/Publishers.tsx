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

interface Publisher {
  id: number;
  name: string;
  status: boolean;
  createdAt: string;
}

const Publishers = () => {
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPublishers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/publishers?page=${page + 1}&limit=${limit}&all=false`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPublishers(res.data.data);
      setTotal(res.data.total);
    } catch (err: any) {
      setError(err.message || 'Error al cargar editoriales');
    }
  };

  useEffect(() => {
    fetchPublishers();
  }, [page, limit]);

  const handleCreate = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/publishers', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Editorial creada correctamente');
      fetchPublishers();
      setOpenDialog(false);
    } catch (err: any) {
      setError(err.message || 'Error al crear editorial');
    }
  };

const handleUpdate = async (data: any) => {
  try {
    const token = localStorage.getItem('token');

    // Solo enviar los campos válidos
    const cleanedData = { name: data.name };

    await api.patch(`/publishers/${editingPublisher?.id}`, cleanedData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSuccess('Editorial actualizada correctamente');
    fetchPublishers();
    setOpenDialog(false);
  } catch (err: any) {
    setError(err.message || 'Error al actualizar editorial');
  }
};

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/publishers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Editorial desactivada correctamente');
      fetchPublishers();
    } catch (err: any) {
      setError(err.message || 'Error al eliminar editorial');
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Editoriales</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => {
          setEditingPublisher(null);
          setOpenDialog(true);
        }}>
          Crear Editorial
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
            {publishers.map((publisher) => (
              <TableRow key={publisher.id}>
                <TableCell>{publisher.name}</TableCell>
                <TableCell>{publisher.status ? 'Activa' : 'Inactiva'}</TableCell>
                <TableCell>{new Date(publisher.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => {
                    setEditingPublisher(publisher);
                    setOpenDialog(true);
                  }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(publisher.id)}>
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
  title={editingPublisher ? 'Editar Editorial' : 'Crear Editorial'}
  open={openDialog}
  onClose={() => { setOpenDialog(false); setEditingPublisher(null); }}
  onSubmit={editingPublisher ? handleUpdate : handleCreate}
  fields={[
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
    },
  ]}
  defaultValues={editingPublisher || {}}
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

export default Publishers;