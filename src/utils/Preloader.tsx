import React from "react";
import Loader from "../components/loader";
import AlertSnackBar from "../components/alertsnackbar";

const Preloader: React.FC = () => {
  return (
    <>
      <AlertSnackBar />
      <Loader />
    </>
  );
};

export default Preloader; 