import * as React from 'react';

export type SizeType = 'small' | 'middle' | 'large' | undefined;

const SizeContext = React.createContext<SizeType>(undefined);

export interface SizeContextProps {
  size?: SizeType;
  children?: React.ReactNode;
}

export const SizeContextProvider = ({ children, size }: SizeContextProps) => (
  <SizeContext.Consumer>
    {originSize => (
      <SizeContext.Provider value={size || originSize}>{children}</SizeContext.Provider>
    )}
  </SizeContext.Consumer>
);

export default SizeContext;
