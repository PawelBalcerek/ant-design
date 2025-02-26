import * as React from 'react';

export type DisabledType = true | false | undefined;

const DisabledContext = React.createContext<DisabledType>(false);

export interface DisabledContextProps {
  disabled?: DisabledType;
  children?: React.ReactNode;
}

export const DisabledContextProvider = ({ children, disabled }: DisabledContextProps) => {
  const originDisabled = React.useContext(DisabledContext);
  return (
    <DisabledContext.Provider value={disabled || originDisabled}>
      {children}
    </DisabledContext.Provider>
  );
};

export default DisabledContext;
