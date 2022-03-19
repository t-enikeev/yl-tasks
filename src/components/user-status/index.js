import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "antd/lib/avatar/avatar";
import { UserOutlined } from "@ant-design/icons";
import UserAvatar from "../user-avatar";

function UserStatus({ user, onLogoutClick, getImageUrl }) {
  return (
    <>
      {user?.profile ? (
        <div className={"LoginWrapper"}>
          {user.profile?.avatar?._id ? (
            <img src={user.profile.avatar.url} className={"Avatar"} />
          ) : (
            <Avatar size={40} icon={<UserOutlined />} />
          )}
          <Link to="/private/profile">{user?.profile?.name}</Link>
          <a onClick={onLogoutClick}>Выйти</a>
        </div>
      ) : (
        <div className={"LoginWrapper"}>
          <Link to="/login">Войти</Link>
        </div>
      )}
    </>
  );
}

export default React.memo(UserStatus);
