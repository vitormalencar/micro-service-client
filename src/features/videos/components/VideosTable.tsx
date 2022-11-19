import { IconButton, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { Results } from "../../../types/Videos";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { Box } from "@mui/system";

type Props = {
  data: Results | undefined;
  perPage: number;
  isFetching: boolean;
  rowsPerPage?: number[];
  handleOnPageChange: (page: number) => void;
  handleFilterChange: (filterModel: GridFilterModel) => void;
  handleOnPageSizeChange: (perPage: number) => void;
  handleDelete: (id: string) => void;
};

export function VideosTable({
  data,
  perPage,
  isFetching,
  rowsPerPage,
  handleOnPageChange,
  handleFilterChange,
  handleOnPageSizeChange,
  handleDelete,
}: Props) {
  const componentProps = {
    toolbar: {
      showQuickFilter: true,
      quickFilterProps: { debounceMs: 500 },
    },
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1, renderCell: renderNameCell },
    {
      field: "id",
      headerName: "Actions",
      type: "string",
      flex: 1,
      renderCell: renderActionsCell,
    },
  ];

  function mapDataToGridRows(data: Results) {
    const { data: videos } = data;
    return videos.map((video) => ({
      id: video.id,
      name: video.title,
    }));
  }

  function renderActionsCell(params: GridRenderCellParams) {
    return (
      <IconButton
        color="secondary"
        onClick={() => handleDelete(params.value)}
        aria-label="delete"
        data-testid="delete-button"
      >
        <DeleteIcon />
      </IconButton>
    );
  }

  function renderNameCell(rowData: GridRenderCellParams) {
    return (
      <Link
        style={{ textDecoration: "none" }}
        to={`/videos/edit/${rowData.id}`}
      >
        <Typography color="primary">{rowData.value}</Typography>
      </Link>
    );
  }

  const rows = data ? mapDataToGridRows(data) : [];
  const rowCount = data?.meta.total || 0;

  return (
    <Box sx={{ display: "flex", height: 600 }}>
      <DataGrid
        rows={rows}
        pagination={true}
        columns={columns}
        pageSize={perPage}
        filterMode="server"
        rowCount={rowCount}
        loading={isFetching}
        paginationMode="server"
        checkboxSelection={false}
        disableColumnFilter={true}
        disableColumnSelector={true}
        disableDensitySelector={true}
        rowsPerPageOptions={rowsPerPage}
        componentsProps={componentProps}
        onPageChange={handleOnPageChange}
        components={{ Toolbar: GridToolbar }}
        onFilterModelChange={handleFilterChange}
        onPageSizeChange={handleOnPageSizeChange}
      />
    </Box>
  );
}
