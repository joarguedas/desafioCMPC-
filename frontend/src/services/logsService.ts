import api from "@/lib/axios";

export const getLogs = async (params: any) => {
  const response = await api.get("/logs", {
    params: {
      ...params,
      all: false,
    },
  });

  return {
    data: response.data.data || [],
    total: response.data.total || 0,
  };
};

export const exportLogs = async (filters: any) => {
  const response = await api.post(
    "/export",
    {
      type: "logs",
      filters,
    },
    {
      headers: {
        Accept: "text/csv",
      },
      responseType: "blob",
    }
  );


  return response.data;
};