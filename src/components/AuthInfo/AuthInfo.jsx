import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { PiLineVertical } from "react-icons/pi";

import s from "./AuthInfo.module.scss";

import { getLogin, getUser } from "../../redux/auth/auth-selectors";

import { logout } from "../../redux/auth/auth-operations";
import Button from "../Shared/Button/Button";

const AuthInfo = () => {
  const dispatch = useDispatch();
  const isUserLogin = useSelector(getLogin);
  const user = useSelector(getUser);

  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      {!isUserLogin && (
        <div className={s.userInfoSide}>
          <div className={s.userWrapper}>
            <div className={s.wrapper}>
              <NavLink className={s.userText} to="/auth/login">
                <span style={{ marginRight: "-5px" }}>Login</span>
              </NavLink>
            </div>
            <PiLineVertical size={24} color="var(--accent-color)" />
            <div className={s.wrapper}>
              <NavLink className={s.userText} to="/auth/registration">
                <span style={{ marginLeft: "-5px" }}>Register</span>
              </NavLink>
            </div>
          </div>
        </div>
      )}
      {isUserLogin && (
        <div className={s.userInfoSide}>
          <div className={s.userBlock}>
            {user.userAvatar !== null && (
              <img
                src={user.userAvatar}
                alt="Userphoto"
                className={s.userPhoto}
              />
            )}
          </div>
          <span className={s.userName}>{user.username}</span>
          <PiLineVertical
            size={24}
            color="var(--accent-color)"
            style={{ marginLeft: "-10px", marginRight: "-10px" }}
          />
          <Button
            text={"logout"}
            type="button"
            onClick={onLogout}
            btnClass={"exitHeader"}
          />
        </div>
      )}
    </>
  );
};

export default AuthInfo;
