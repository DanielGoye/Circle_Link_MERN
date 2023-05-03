import Head from "next/head";
import { useRouter } from "next/router";
import ProfilePage from "../../scenes/profilePage/ProfilePage";
import Navbar from "../../scenes/navbar/Navbar";

const Profile = () => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Navbar />
      <ProfilePage />
    </>
  );
};

export default Profile;
