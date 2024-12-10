import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
} from "react-router-dom";
import UserRouter from "./UserRouter";
import AdminRouter from "./AdminRouter";

import React from "react";
import Administrative from "../Administrative/superPage/Administrative";
import Dashboard from "../dashboard/components/Dashboard";
import Login from "../Authentication/pages/Login";
import MainLayout from "../layout/MainLayout";
import Signup from "../Authentication/pages/Signup";
import LandingPage from "../Landing/pages/LandingPage";
import LawyerRouter from "./LawyerRouter";
import CasesPage from "../Cases/pages/CasePage";
import MainFeed from "../dashboard/components/MainFeed/MainFeed";
import HireLawyer from "../dashboard/components/HireLawyer";
import LawyerPage from "../lawyer/pages/LawyerPage";
import CaseCard from "../Cases/components/CaseCard";
import ProfileSettings from "../dashboard/components/ProfileSettings";
import PendingCases from "../lawyer/components/PendingCases";
import LawyerCases from "../lawyer/components/LawyerCases";
import LawyerCaseDetail from "../lawyer/components/LawyerCaseDetails";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        {/* Default Route based on Authentication */}
        {/* User Routes */}
        <Route element={<UserRouter />}>
          <Route path={"/user"} element={<Dashboard />}>
            <Route path={"/user/hire-lawyer"} element={<HireLawyer />} />
            <Route path={"/user/main-feed"} index element={<MainFeed />} />
            <Route path={"/user/my-cases"} element={<CaseCard />} />
            <Route path={"/user/my-cases/:id"} element={<CasesPage />} />
            <Route
              path={"/user/profile-settings"}
              element={<ProfileSettings />}
            />
          </Route>
        </Route>

        {/* Lawyer Routes */}
        <Route element={<LawyerRouter />}>
          <Route path={"/lawyer"} element={<LawyerPage />}>
            <Route path={"/lawyer/main-feed"} element={<MainFeed />} />
            <Route path={"/lawyer/pending-cases"} element={<PendingCases />} />
            <Route path={"/lawyer/my-cases"} element={<LawyerCases />} />
            <Route path={"/lawyer/cases/:id"} element={<LawyerCaseDetail />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRouter />}>
          <Route path={"/admin/*"} element={<Administrative />} />
        </Route>

        {/* Public Routes */}
        <Route
          path={"/login"}
          element={
            localStorage.getItem("user") || sessionStorage.getItem("user") ? (
              <Navigate to={"/"} />
            ) : (
              <Login />
            )
          }
        />
        <Route path={"/signup"} element={<Signup />} />
        <Route path="*" element={<p>Not Found</p>} />
      </Route>
    </Route>
  )
);

export default router;
