const DIGILOCKER_TXN_KEY = "DIGILOCKER_TXN_ID";

export const saveDigilockerTxnId = (txnId: string) => {
  sessionStorage.setItem(DIGILOCKER_TXN_KEY, txnId);
};

export const getDigilockerTxnId = (): string | null => {
  return sessionStorage.getItem(DIGILOCKER_TXN_KEY);
};

export const clearDigilockerTxnId = () => {
  sessionStorage.removeItem(DIGILOCKER_TXN_KEY);
};
