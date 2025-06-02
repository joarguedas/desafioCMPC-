import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import api from '@/lib/axios';
import GenericFormDialog from '@/components/GenericFormDialog';
import EditUserDialog from '@/components/EditUserDialog';

interface User {
  id: number;
  email: string;
  role: string;
  status: boolean;
  createdAt: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [all, setAll] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get(`/users?page=${page}&limit=${limit}&all=${all}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.data);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  const handleCreate = async (data: any) => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/users', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      setOpenCreate(false);
    } catch (err) {
      console.error('Error al crear usuario:', err);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedUser) return;
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/users/${selectedUser.id}`, { password: data.password }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      setOpenEdit(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error al actualizar usuario:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Usuarios</Typography>
        <Box display="flex" gap={2}>
          <Select
            size="small"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            {[10, 20, 50].map((val) => (
              <MenuItem key={val} value={val}>{val}</MenuItem>
            ))}
          </Select>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
            Crear
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Creado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status ? 'Activo' : 'Inactivo'}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => { setSelectedUser(user); setOpenEdit(true); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

<GenericFormDialog
  title="Crear Usuario"
  open={openCreate}
  onClose={() => setOpenCreate(false)}
  onSubmit={handleCreate}
  fields={[
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'password', label: 'Contraseña', type: 'password', required: true },
    { name: 'role', label: 'Rol', type: 'select', required: true, options: [
        { value: 'user', label: 'Usuario' },
        { value: 'admin', label: 'Administrador' },
      ]},
  ]}
  defaultValues={{}}
/>

{/* Editar Usuario */}
<EditUserDialog
  open={openEdit}
  onClose={() => {
    setOpenEdit(false);
    setSelectedUser(null);
  }}
  onSubmit={handleUpdate}
  user={selectedUser}
/>

    </Box>
  );
};

export default Users;
