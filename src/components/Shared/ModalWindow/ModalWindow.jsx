import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setModalWindowStatus,
  clearTechnicalMessage,
  clearTechnicalError,
} from "../../../redux/technical/technical-slice";
import {
  clearUserMessage,
  clearUserError,
} from "../../../redux/auth/auth-slice";
import {
  getMessageAuth,
  getErrorAuth,
} from "../../../redux/auth/auth-selectors";
import {
  getMessageTechnical,
  getErrorTechnical,
} from "../../../redux/technical/technical-selectors";
import { TfiClose } from "react-icons/tfi";
import s from "./ModalWindow.module.scss";

const ModalWindow = () => {
  const modalRef = useRef();
  const dispatch = useDispatch();
  const messageAuth = useSelector(getMessageAuth);
  const messageTechnical = useSelector(getMessageTechnical);
  const errorAuth = useSelector(getErrorAuth);
  const errorTechnical = useSelector(getErrorTechnical);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        dispatch(setModalWindowStatus(false));
        dispatch(clearTechnicalError());
        dispatch(clearTechnicalMessage());
        dispatch(clearUserError());
        dispatch(clearUserMessage());
      }
    };

    const timeoutId = setTimeout(() => {
      dispatch(setModalWindowStatus(false));
      dispatch(clearTechnicalError());
      dispatch(clearTechnicalMessage());
      dispatch(clearUserError());
      dispatch(clearUserMessage());
    }, 10000);

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      clearTimeout(timeoutId);
    };
  }, [dispatch]);

  const closeModal = () => {
    dispatch(setModalWindowStatus(false));
    dispatch(clearTechnicalError());
    dispatch(clearTechnicalMessage());
    dispatch(clearUserError());
    dispatch(clearUserMessage());
  };

  return (
    <div className={s.window} ref={modalRef}>
      <button className={s.window__closeButton} onClick={closeModal}>
        <TfiClose color="#017683" size={15} />
      </button>
      <div className={s.boo}>
        <div className={s.face} id="face"></div>
      </div>
      <div className={s.shadow}></div>
      {(errorAuth || errorTechnical) && (
        <>
          <p className={s.window__title}>Ox...</p>
          <p className={s.window__text}>
            {`${errorAuth ? errorAuth : errorTechnical}`}
          </p>
        </>
      )}
      {(messageAuth || messageTechnical) && (
        <p className={s.window__text}>
          {`${messageAuth ? messageAuth : messageTechnical}`}
        </p>
      )}
    </div>
  );
};

export default ModalWindow;
