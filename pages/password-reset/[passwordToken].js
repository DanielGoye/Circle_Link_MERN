import Head from "next/head";
import PasswordResetPage from "../../scenes/loginPage/PasswordResetPage";

const PasswordReset = () => {
  return (
    <>
      <Head>
        <title>Reset Password</title>
      </Head>
      <PasswordResetPage />
    </>
  );
};

export default PasswordReset;
