import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserRoutes from "./components/Routes/UserRoutes.jsx";
import { HelmetProvider } from "react-helmet-async";
import CountdownCircle from "./components/Shared/CountdownCircle/CountdownCircle";
import {
  getNotification,
  getModalWindowStatus,
} from "./redux/technical/technical-selectors";
import { getCurrentUser } from "./redux/auth/auth-operations";
import ModalWindow from "./components/Shared/ModalWindow";
import background from "./images/background.webp";
import "./styles/styles.scss"; //файл зі стилями треба підключати у додаток

function App() {
  const dispatch = useDispatch();
  const isNotification = useSelector(getNotification);
  const isShowModal = useSelector(getModalWindowStatus);

  //we return the user from the local storage when the page is reloaded
  useEffect(() => {
    const authData = localStorage.getItem("SpeakFlow.authData");
    if (authData) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <HelmetProvider>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F4FBF7",
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <main>
          <UserRoutes />
        </main>
        {isShowModal && <ModalWindow />}
        {isNotification && <CountdownCircle />}
      </div>
    </HelmetProvider>
  );
}

export default App;
