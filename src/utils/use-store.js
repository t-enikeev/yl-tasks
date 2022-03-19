import React, { useContext } from "react";
import { StoreContext } from "../store/provider";
import useServices from "./use-services";

/**
 * Хук для доступа к объекту хранилища
 * @return {Store}
 */
export default function useStore() {
  return useServices().getStore();
}
