import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { useForm } from 'react-hook-form';

interface Field {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: { value: string; label: string }[];
}

interface GenericFormDialogProps {
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  fields: Field[];
  defaultValues?: any;
}

const GenericFormDialog: React.FC<GenericFormDialogProps> = ({
  title,
  open,
  onClose,
  onSubmit,
  fields,
  defaultValues,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const onFormSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (err) {
      console.error('Error al enviar el formulario:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <form id="generic-form" onSubmit={handleSubmit(onFormSubmit)}>
          {fields.map((field) =>
            field.type === 'select' ? (
              <TextField
                key={field.name}
                margin="dense"
                label={field.label}
                select
                fullWidth
                {...register(field.name, { required: field.required })}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message?.toString()}
              >
                {field.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <TextField
                key={field.name}
                margin="dense"
                label={field.label}
                type={field.type}
                fullWidth
                {...register(field.name, { required: field.required })}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message?.toString()}
              />
            ),
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" form="generic-form" variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GenericFormDialog;
