import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { BsEscape } from "react-icons/bs";
import { RxDividerVertical } from "react-icons/rx";

import s from "./AuthInfo.module.scss";

import {
  getLogin,
  //   getUserName,
  //   getUser,
  //   getUserAvatar,
} from "../../redux/auth/auth-selectors";

import { logout } from "../../redux/auth/auth-operations";
import Button from "../Shared/Button/Button";

const AuthInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isUserLogin = useSelector(getLogin);
  //   const userName = useSelector(getUserName);
  //   const userAvatar = useSelector(getUserAvatar);
  //   const user = useSelector(getUser);

  const onLogout = async () => {
    console.log("Тисну на вихід");
    navigate("/");
    await dispatch(logout());
    const authData = {
      accessToken: null,
      refreshToken: null,
      sid: null,
    };
    await localStorage.setItem("SpeakFlow.authData", JSON.stringify(authData));
  };

  const getClassName = ({ isActive }) => {
    return isActive
      ? `${s.link} ${s.active} ${s.custom}`
      : `${s.link} ${s.custom}`;
  };

  if (!isUserLogin) {
    return (
      <div className={s.userInfoSide}>
        <div className={s.userWrapper}>
          <div className={s.wrapper}>
            <NavLink className={getClassName} to="/auth/login">
              <span className={s.userText} style={{ marginRight: "-5px" }}>
                Login
              </span>
            </NavLink>
          </div>
          <svg width="30" height="30">
            <line
              x1={15}
              y1={5}
              x2={15}
              y2={35}
              stroke="#414141"
              strokeWidth={1}
            />
          </svg>
          <div className={s.wrapper}>
            <NavLink className={getClassName} to="/auth/registration">
              <span className={s.userText} style={{ marginLeft: "-5px" }}>
                Register
              </span>
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  if (isUserLogin) {
    return (
      <div className={s.userInfoSide}>
        <div className={s.userWrapper}>
          <RxDividerVertical
            size={40}
            style={{
              color: "var(--border-color)",
            }}
          />
          <div className={s.wrapper}>
            <BsEscape
              size={25}
              style={{
                marginRight: "10px",
                color: "var(--icons-color)",
              }}
            />
            <Button
              text="Вихід"
              type="button"
              onClick={onLogout}
              btnClass="exitHeaderBtn"
            />
          </div>
        </div>
      </div>
    );
  }
};

export default AuthInfo;
