import { Navigate, Outlet } from "react-router-dom";

const LawyerRouter = () => {
  if (
    (!localStorage.getItem("user") && !sessionStorage.getItem("user")) ||
    (!localStorage.getItem("userType") && !sessionStorage.getItem("userType"))
  ) {
    return <Navigate to={"/login"} />;
  }
  const userType = JSON.parse(sessionStorage.getItem("userType"));
  return userType === "Lawyer" ? <Outlet /> : <Navigate to={"/login"} />;
};

export default LawyerRouter;
