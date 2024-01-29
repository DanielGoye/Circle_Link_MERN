import { useState } from "react";
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

const emailSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
});

const initialValues = {
  email: "",
};

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ForgotPasswordForm = () => {
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

  const sendResetLink = async (values, onSubmitProps) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/api/auth/forgot-password`,
        values
      );
      setSnackBarState({ message: response.data, severity: "success" });
      setOpen(true);
      setShowMessage(true);
      setLoading(false);
      onSubmitProps.resetForm();
    } catch (error) {
      setSnackBarState({ message: error.response.data, severity: "error" });
      setOpen(true);
      setLoading(false);
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    await sendResetLink(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={emailSchema}
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
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
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
              <span>FORGOT PASSWORD</span>
            </LoadingButton>
            <span style={{ display: showMessage ? "block" : "none" }}>
              We have sent an email to you with the reset link.
            </span>
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

export default ForgotPasswordForm;
