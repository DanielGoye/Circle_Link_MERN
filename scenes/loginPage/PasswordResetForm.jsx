import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { forwardRef } from "react";
import { useRouter } from "next/router";

const resetPasswordSchema = yup.object().shape({
  password: yup.string().required("required"),
});

const initialValues = {
  password: "",
};

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PasswordResetForm = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [snackbarState, setSnackBarState] = useState({
    message: "",
    severity: "",
  });
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const resetPassword = async (values, onSubmitProps) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/api/auth/reset-password/${router.query.passwordToken}`,
        values
      );
      setSnackBarState({ message: response.data.message, severity: "success" });
      setOpen(true);
      setShowMessage(true);
      setLoading(false);
      onSubmitProps.resetForm();
      router.push("/login");
    } catch (error) {
      setSnackBarState({ message: error.response.data, severity: "error" });
      setOpen(true);
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    await resetPassword(values, onSubmitProps);
  };
  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={resetPasswordSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              label="Enter new Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <LoadingButton
              loading={loading}
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              <span>RESET PASSWORD</span>
            </LoadingButton>
          </Box>
          <Snackbar
            anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity={snackbarState.severity}
              sx={{ width: "100%" }}
            >
              {snackbarState.message}
            </Alert>
          </Snackbar>
        </form>
      )}
    </Formik>
  );
};

export default PasswordResetForm;
