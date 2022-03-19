import React, { useEffect } from "react";

function UserAvatar({ user, getImageUrl }) {
  const avatarUrl = user?.profile?.avatar.url;

  return <img src={avatarUrl} className={"Avatar"} />;
}

export default UserAvatar;
