import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import PublicRoute from "./PublicRoutes";

const HomePage = lazy(() => import("../../pages/HomePage/HomePage"));
const AuthPage = lazy(() => import("../../pages/AuthPage/AuthPage"));
const Login = lazy(() => import("../../components/Auth/Login/Login"));
const Register = lazy(() => import("../../components/Auth/Register/Register"));
const NotFoundPage = lazy(() =>
  import("../../pages/NotFoundPage/NotFoundPage")
);

const UserRoutes = () => {
  return (
    <Suspense>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/*" element={<AuthPage />}>
            <Route path="login" element={<Login />} />
            <Route path="registration" element={<Register />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default UserRoutes;
