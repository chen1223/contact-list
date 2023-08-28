import { Message } from 'common/type/Message';
import React from 'react';
import { Subject } from 'rxjs';

export interface AppContextProps {
  message$: Subject<Message>;
}

const defaultAppValue = {
  message$: new Subject<Message>(),
};

export const AppContext = React.createContext<AppContextProps>({
  message$: new Subject<Message>(),
});

export const AppContextProvider = ({ children }) => {
  return (
    <AppContext.Provider value={defaultAppValue}>
      {children}
    </AppContext.Provider>
  );
};
