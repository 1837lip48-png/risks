import { createContext, useContext, useMemo, useState } from 'react';
import { INITIAL_LESSONS, INITIAL_RISKS } from '../data/mockData';

const AppContext = createContext(null);

let riskCounter = 108;

export function AppProvider({ children }) {
  const [user, setUser] = useState(null); // { firstName, lastName, role, ppNumber }
  const [risks, setRisks] = useState(INITIAL_RISKS);
  const [lessons] = useState(INITIAL_LESSONS);
  const [activeTab, setActiveTab] = useState('dashboard');

  const addRisk = (draft) => {
    const id = `R-${riskCounter++}`;
    const newRisk = {
      id,
      category: draft.category,
      title: draft.title,
      event: draft.event,
      consequence: draft.consequence,
      owner: draft.owner || null,
      status: 'identification',
      p: 2,
      i: 2,
      el: 0,
      isNew: true,
      createdAt: new Date().toISOString().slice(0, 10),
      measures: [],
    };
    setRisks((prev) => [newRisk, ...prev]);
    setActiveTab('risks');
    return newRisk;
  };

  const logout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      logout,
      risks,
      setRisks,
      lessons,
      addRisk,
      activeTab,
      setActiveTab,
    }),
    [user, risks, lessons, activeTab],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
