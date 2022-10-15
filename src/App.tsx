import { Typography } from "@mui/material";
import { Box, ThemeProvider } from "@mui/system";
import { SnackbarProvider } from "notistack";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components/Header";
import { Layout } from "./components/Layout";
import { appTheme } from "./config/theme";
import { CreateCastMember } from "./features/cast/CreateCastMembers";
import { EditCastMember } from "./features/cast/EditCastMember";
import { ListCastmembers } from "./features/cast/ListCastmembers";
import { CategoryCreate } from "./features/categories/CreateCategory";
import { CategoryEdit } from "./features/categories/EditCategory";
import { CategoryList } from "./features/categories/ListCaegory";

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <SnackbarProvider
        autoHideDuration={2000}
        maxSnack={3}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          component="main"
          sx={{
            height: "100vh",
            backgroundColor: (theme) => theme.palette.grey[900],
          }}
        >
          <Header />
          <Layout>
            <Routes>
              <Route path="/" element={<CategoryList />} />
              {/* Category */}
              <Route path="/categories" element={<CategoryList />} />
              <Route path="/categories/create" element={<CategoryCreate />} />
              <Route path="/categories/edit/:id" element={<CategoryEdit />} />

              {/* Cast members */}
              <Route path="/cast-members" element={<ListCastmembers />} />
              <Route
                path="/cast-members/create"
                element={<CreateCastMember />}
              />
              <Route
                path="cast-members/edit/:id"
                element={<EditCastMember />}
              />

              <Route
                path="*"
                element={
                  <Box sx={{ color: "white" }}>
                    <Typography variant="h1">404</Typography>
                    <Typography variant="h2">Page not found</Typography>
                  </Box>
                }
              />
            </Routes>
          </Layout>
        </Box>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
