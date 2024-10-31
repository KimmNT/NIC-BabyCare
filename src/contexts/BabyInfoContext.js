// StudentInfoContext.js

import {createContext, useContext, useState} from 'react';

const BabyInfoContext = createContext();

export const BabyInfoProvider = ({children}) => {
  const [babyInfoArray, setBabyInfoArray] = useState([]);

  const addBabyInfo = (qrcode, stuId, stuAva, stuName) => {
    setBabyInfoArray([...babyInfoArray, {qrcode, stuId, stuAva, stuName}]);
  };

  const clearBabyInfoArray = () => {
    setBabyInfoArray([]);
  };

  return (
    <BabyInfoContext.Provider
      value={{babyInfoArray, addBabyInfo, clearBabyInfoArray}}>
      {children}
    </BabyInfoContext.Provider>
  );
};

export const useBabyInfo = () => {
  return useContext(BabyInfoContext);
};
