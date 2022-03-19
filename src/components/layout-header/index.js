import React, { useCallback } from "react";
import useSelector from "../../utils/use-selector";
import useStore from "../../utils/use-store";
import { Link } from "react-router-dom";
import { cn } from "@bem-react/classname";
import "./styles.css";
import UserStatus from "../user-status";

function LayoutHeader({ children }) {
  const store = useStore();
  const className = cn("LayoutHeader");

  const select = useSelector((state) => ({
    session: state.session,
  }));
  const callbacks = {
    onLogoutClick: useCallback(
      (e) => {
        e.preventDefault();
        store.session.logout();
        store.catalog.cleanFavorites();
      },
      [select.session]
    ),
  };

  return (
    <div className={className()}>
      {children}
      <UserStatus user={select.session.user} onLogoutClick={callbacks.onLogoutClick} />
    </div>
  );
}

export default React.memo(LayoutHeader);
