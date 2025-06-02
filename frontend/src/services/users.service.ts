import api from '@/lib/axios';

export const getUsers = async (page = 1, limit = 10, all = false) => {
  const res = await api.get(`/users?page=${page}&limit=${limit}&all=${all}`);
  return res.data;
};

export const createUser = async (data: { email: string; password: string; role: string }) => {
  const res = await api.post('/users', data);
  return res.data;
};

export const updateUser = async (id: number, data: { password: string }) => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: number) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
