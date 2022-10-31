import React, { useState } from "react";
import { DailyParams } from "@/lib/types";

type ModalType = "idle" | "create" | "update";

interface State {
  url: string | null;
  open: boolean;
  date: Date | null;
  type: ModalType;
}

interface ContextProps extends State {
  changeModalState: (state: State) => void;
  reset: () => void;
}

const initialState: State = {
  url: null,
  type: "idle",
  open: false,
  date: null,
};

export const DailyContext = React.createContext<ContextProps>({
  ...initialState,
  changeModalState: () => {},
  reset: () => {},
});

const DailyProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = React.useState<State>(initialState);

  const changeModalState = (newState: State) => {
    setState({
      ...state,
      ...newState,
    });
  };

  const reset = () => {
    setState(initialState);
  };

  return (
    <DailyContext.Provider value={{ ...state, changeModalState, reset }}>
      {children}
    </DailyContext.Provider>
  );
};

DailyContext.displayName = "DailyContext";

export default DailyProvider;
