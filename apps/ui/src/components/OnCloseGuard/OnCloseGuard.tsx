import { FunctionComponent, ReactNode, useEffect } from "react";

interface OnCloseGuardProps {
  children: ReactNode;
  active: boolean;
}

export const OnCloseGuard: FunctionComponent<OnCloseGuardProps> = ({ children, active }) => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  };

  useEffect(() => {
    if (active) {
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [active]);
  return <>{children}</>;
};
