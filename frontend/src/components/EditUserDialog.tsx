import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { useForm } from 'react-hook-form';

interface EditUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  user: {
    id: number;
    email: string;
    role: string;
  } | null;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({ open, onClose, onSubmit, user }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      email: user?.email || '',
      role: user?.role || '',
      password: '',
    },
  });

  React.useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        role: user.role,
        password: '',
      });
    }
  }, [user, reset]);

  const handleFormSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Editar Usuario</DialogTitle>
      <DialogContent>
        <form id="edit-user-form" onSubmit={handleSubmit(handleFormSubmit)}>
          <TextField
            fullWidth
            label="Email"
            margin="dense"
            disabled
            {...register('email')}
          />
          <TextField
            fullWidth
            label="Rol"
            margin="dense"
            disabled
            {...register('role')}
          />
          <TextField
            fullWidth
            label="Nueva Contraseña"
            type="password"
            margin="dense"
            required
            {...register('password')}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" form="edit-user-form" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
