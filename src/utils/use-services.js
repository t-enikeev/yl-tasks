import React, { useContext } from "react";
import { ServicesContext } from "../provider";

/**
 * Хук для доступа к объекту
 * @return {ServicesContext}
 */
export default function useServices() {
  return useContext(ServicesContext);
}
