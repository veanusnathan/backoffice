import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { ApiClientProvider } from './providers/ApiClientProvider.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosManager } from './lib/axios.ts';
import { Notifications } from '@mantine/notifications';
import '@fontsource/inter/400.css';
import { OverridedComponents } from '../src/theme/overrides';
import { ModalsProvider } from '@mantine/modals';

const queryClient = new QueryClient();
const axiosManager = new AxiosManager();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ApiClientProvider axiosManager={axiosManager}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              fontFamily: 'Inter, sans-serif',
              colors: {
                brand: [
                  '#dafff7',
                  '#adffea',
                  '#7effdd',
                  '#4dffcf',
                  '#24ffc1',
                  '#11e6a7',
                  '#00b382',
                  '#00805d',
                  '#004e37',
                  '#001c12',
                ],
              },
              primaryColor: 'brand',
              components: OverridedComponents,
            }}>
            <ModalsProvider>
              <Notifications />
              <App />
            </ModalsProvider>
          </MantineProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ApiClientProvider>
  </React.StrictMode>,
);
