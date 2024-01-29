import React from "react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

const Layout = ({ children }) => {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>{children}</main>
    </ThemeProvider>
  );
};

export default Layout;
