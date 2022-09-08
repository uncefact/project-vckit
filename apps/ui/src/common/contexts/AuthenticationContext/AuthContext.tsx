import React, { createContext, ReactChildren, useContext } from "react";
import { magic } from "../helpers";
import { useProviderContext } from "../provider";
interface AuthContextProps {
  isLoggedIn: boolean;
  login: (email: string) => Promise<void | null | string> | ReturnType<typeof magic.auth.loginWithMagicLink>;
  logout: () => Promise<void | boolean> | ReturnType<typeof magic.user.logout>;
}

const AuthContext = createContext<AuthContextProps>({
  isLoggedIn: false,
  login: async () => new Promise((resolve) => resolve()),
  logout: async () => new Promise((resolve) => resolve()),
});

/**
 * note to maintainers:
 * auth provider depends on provider provider
 * so ensure that auth provider sits under provider provider component tree
 */
export const AuthProvider: any = ({ children }: { children: ReactChildren }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const { upgradeToMagicSigner } = useProviderContext();

  const login = async (email: string) => {
    // needs error handling here
    // better to defer error handling to another function
    await magic.auth.loginWithMagicLink({ email });
    await upgradeToMagicSigner();
    setIsLoggedIn(true);
  };

  const logout = async () => {
    // needs error handling
    await magic.user.logout();
    setIsLoggedIn(false);
  };

  React.useLayoutEffect(() => {
    // eagerly check if user is already logged in
    const execute = async () => {
      // needs error handling here
      const status = await magic.user.isLoggedIn();
      if (status) {
        // if logged in, then immediate upgrade to magic signer.
        await upgradeToMagicSigner();
      }
      setIsLoggedIn(status);
    };
    execute();
  }, [upgradeToMagicSigner]);

  return <AuthContext.Provider value={{ isLoggedIn, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextProps => useContext<AuthContextProps>(AuthContext);
