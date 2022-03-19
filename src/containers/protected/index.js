import React, { useEffect } from "react";
import useSelector from "../../utils/use-selector";
import { Routes, Route } from "react-router-dom";
import useStore from "../../utils/use-store";
import { useNavigate } from "react-router-dom";
import Profile from "../../app/profile";
import ChatPage from "../../app/chat-page";

function Protected({ children }) {
  const navigate = useNavigate();
  const store = useStore();
  const select = useSelector((state) => ({
    profile: state.session.user?.profile,
    waiting: state.session.waiting,
  }));

  useEffect(() => {
    if (!select.profile && !select.waiting) {
      navigate("/login");
    }
  }, [select.profile, select.waiting]);

  return (
    <Routes>
      <Route path={"/profile"} element={<Profile />}></Route>
      <Route path={"/chat"} element={<ChatPage />}></Route>
    </Routes>
  );
}

export default React.memo(Protected);
