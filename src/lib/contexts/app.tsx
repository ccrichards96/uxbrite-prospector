// contexts/app.ts
'use client';

import React from 'react';
import { createContext, useState, useContext} from 'react';

type Props = {
  children: React.ReactNode;
};

const appContextDefaultValues: AppContextType = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNum: '',
  reportDownloadLink: '',
  domainLink:'',
  setDomainLink:() => {},
  setReportDownloadLink: () => {},
  setFirstName: () => {},
  setLastName: () => {},
  setEmail: () => {},
  setPhoneNum: () => {},
};

export const AppContext = createContext<AppContextType>(appContextDefaultValues);

interface AppContextType {
  firstName: string;
  lastName: string;
  email: string;
  reportDownloadLink: string;
  domainLink:string;
  phoneNum:string;
  setDomainLink: (link: string) => void;
  setReportDownloadLink: (link: string) => void;
  setFirstName: (name: string) => void;
  setLastName: (name: string) => void;
  setEmail: (email: string) => void;
  setPhoneNum: (phone: string) => void;
}

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [reportDownloadLink, setReportDownloadLink] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [domainLink, setDomainLink] = useState('');
  const [phoneNum, setPhoneNum] = useState('');

  const contextValue = {
    firstName,
    lastName,
    email,
    reportDownloadLink,
    domainLink,
    phoneNum,
    setPhoneNum,
    setDomainLink,
    setReportDownloadLink,
    setFirstName,
    setLastName,
    setEmail
  };

  return (
    <>
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    </>
  );
}
// export default useContext(AppContext);

export function useApp() {
  return useContext(AppContext);
}