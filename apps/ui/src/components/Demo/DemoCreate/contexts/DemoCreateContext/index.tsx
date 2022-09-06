import React, { createContext, ReactChildren, useState } from "react";

type ActiveStep = "start" | "form" | "review" | "issue";

interface DemoCreateContextProps {
  activeStep: ActiveStep;
  setActiveStep: React.Dispatch<React.SetStateAction<ActiveStep>>;
}

export const DemoCreateContext = createContext<DemoCreateContextProps>({
  activeStep: "start",
  setActiveStep: () => null,
});

export const DemoCreateProvider: any = ({ children }: { children: ReactChildren }) => {
  const [activeStep, setActiveStep] = useState<ActiveStep>("start");

  return <DemoCreateContext.Provider value={{ activeStep, setActiveStep }}>{children}</DemoCreateContext.Provider>;
};
