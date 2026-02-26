import { ToasterProvider } from "@/components";
import store from "@/global/store";
import { Fragment, type PropsWithChildren } from "react";
import { Provider } from "react-redux";

type GlobalProviderProps = PropsWithChildren & {};

export function GlobalProvider({ children }: GlobalProviderProps) {
  return (
    <Fragment>
      <ToasterProvider />
      <Provider store={store}>{children}</Provider>
    </Fragment>
  );
}
