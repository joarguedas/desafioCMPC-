import api from "@/lib/axios";

export const getBooks = async (params: any) => {
  const response = await api.get("/books", {
    params: { ...params, all: false },
  });
  return {
    data: response.data.data || [],
    total: response.data.total || 0,
  };
};

export const exportBooks = async (filters: any) => {
  const response = await api.post(
    "/export",
    { type: "books", filters },
    {
      headers: { Accept: "text/csv" },
      responseType: "blob",
    }
  );
  return response.data;
};

export const createBook = async (data: any) => {
  const response = await api.post("/books", data);
  return response.data;
};

export const updateBook = async (id: number, data: any) => {
  const response = await api.put(`/books/${id}`, data);
  return response.data;
};

export const deleteBook = async (id: number) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};
