import { LoadingOverlay } from '@mantine/core';
import { MainRouter } from './components/router/MainRouter';
import { useHydration } from './hooks/useHydration';
import { AuthRouter } from './components/router/AuthRouter';

const App = () => {
  const { authenticated, hydrated } = useHydration();

  if (!hydrated) {
    return <LoadingOverlay visible overlayBlur={2} />;
  }

  if (authenticated) return <MainRouter />;

  return <AuthRouter />;
};

export default App;
