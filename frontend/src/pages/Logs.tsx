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
  Pagination,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { getLogs, exportLogs } from "@/services/logsService";
import { saveAs } from "file-saver";
import type { Log } from "@/types/log";

const Logs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [tableName, setTableName] = useState("");
  const [action, setAction] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchData = async () => {
    try {
      const filters: any = {
        page,
        limit,
        all: false,
        ...(tableName && { tableName }),
        ...(action && { action }),
        ...(fromDate && { fromDate }),
        ...(toDate && { toDate }),
      };

      const response = await getLogs(filters);
      const data = Array.isArray(response.data) ? response.data : [];

      setLogs(data);
      setTotal(response.total || 0);
    } catch (err) {
      console.error("Error al cargar logs:", err);
      setLogs([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, limit, tableName, action, fromDate, toDate]);

  const handleFilter = () => {
    setPage(1);
  };

  const handleClearFilters = () => {
    setTableName("");
    setAction("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const handleExport = async () => {
    try {
      const filters = {
        all: false,
        ...(tableName && { tableName }),
        ...(action && { action }),
        ...(fromDate && { fromDate }),
        ...(toDate && { toDate }),
      };
      const blob = await exportLogs(filters);
      const csvBlob = new Blob([blob], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, "logs.csv");
    } catch (err) {
      console.error("Error al exportar logs:", err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Logs</Typography>
        <Box display="flex" gap={2}>
          <Select
            size="small"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
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
        </Box>
      </Box>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Tabla"
            fullWidth
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Acción"
            fullWidth
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Desde"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Hasta"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleFilter}>
            Filtrar
          </Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={handleClearFilters}>
            Limpiar
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Tabla</TableCell>
              <TableCell>Acción</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Descripción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{new Date(log.createdAt).toLocaleString()}</TableCell>
                <TableCell>{log.tableName}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.user?.email || "—"}</TableCell>
                <TableCell>{log.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default Logs;
