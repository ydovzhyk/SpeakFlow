import { useSelector } from "react-redux";
import RecordWindow from "./components/RecordWindow";
import CountdownCircle from "./components/Shared/CountdownCircle/CountdownCircle";
import {
  getNotification,
  getModalWindowStatus,
} from "./redux/technical/technical-selectors";
import ModalWindow from "./components/Shared/ModalWindow";

function App() {
  const isNotification = useSelector(getNotification);
  const isShowModal = useSelector(getModalWindowStatus);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#F4FBF7",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <RecordWindow />
      {isShowModal && <ModalWindow />}
      {isNotification && <CountdownCircle />}
    </div>
  );
}

export default App;
