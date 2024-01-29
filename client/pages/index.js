import Head from "next/head";
import HomePage from "../scenes/homePage/HomePage";
import Navbar from "../scenes/navbar/Navbar";

const Home = () => {
  return (
    <>
      <Head>
        <title>Circle Link</title>
      </Head>
      <Navbar />
      <HomePage />
    </>
  );
};

export default Home;
