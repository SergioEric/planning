import React from "react";
import { DailyContext } from "../contexts/DailyContext";

const useDaily = ()=> React.useContext(DailyContext);

export default useDaily;