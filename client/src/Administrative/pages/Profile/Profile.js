import "./Profile.css";
import JudgeProfile from "./judge/JudgeProfile";
import EmployeeProfile from "./employee/EmployeeProfile";
import { useFetch } from "../../../shared/hooks/useFetch";
import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../../shared/context/auth";

const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const WithCheck = (InnerJudgeComponent, InnerEmployeeComponent) => {
  return function ProfileTypeChecker() {
    //get the id from the pathname
    const location = useLocation();
    const tmp = location.pathname.split("/");
    const id = tmp[tmp.length - 1];

    //get the context
    const context = useContext(AuthContext);
    console.log(context.user);
    console.log(id);

    const [userJudge, setUserJudge] = useState(null);
    const [userEmployee, setUserEmployee] = useState(null);

    const [judgeData, isJudgeDataLoading] = useFetch(
      "GET",
      `${REACT_APP_API_BASE_URL}/admin/judges/ssid/${id}`
    );

    const [employeeData, isEmployeeLoading] = useFetch(
      "GET",
      `${REACT_APP_API_BASE_URL}/admin/employees/ssid/${id}`
    );

    useEffect(() => {
      if (!isJudgeDataLoading && judgeData) {
        setUserJudge(judgeData);
      }
    }, [judgeData, isJudgeDataLoading]);

    useEffect(() => {
      if (!isEmployeeLoading && employeeData) {
        setUserEmployee(employeeData.employee);
        console.log(employeeData);
      }
    }, [employeeData, isEmployeeLoading]);

    let content = <div style={{ margin: "2rem auto" }}>Not found</div>;
    if (context.isLoggedIn && userJudge) {
      content = (
        <InnerJudgeComponent
          {...userJudge.data}
          judge_photo={userJudge.judge_photo}
        />
      );
    } else if (context.isLoggedIn && userEmployee) {
      content = (
        <InnerEmployeeComponent
          {...userEmployee.data}
          image={userEmployee.employee_photo}
        />
      );
    }

    return <div className="admin-profile-main">{content}</div>;
  };
};

const Profile = WithCheck(JudgeProfile, EmployeeProfile);

export default Profile;
