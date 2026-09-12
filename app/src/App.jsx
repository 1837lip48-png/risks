import { useApp } from './context/AppContext.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import AppShell from './components/AppShell.jsx';

export default function App() {
  const { user } = useApp();
  return user ? <AppShell /> : <LoginScreen />;
}
