import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';

import Route_ from '#browser/Route_';
import Home from '#browser/Route_/Home';
import { ContextProvider } from '#browser/store';
import '#browser/index.scss';

createRoot(document.body).render(
  <StrictMode>
    <ContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Route_ />}>
            <Route index element={<Navigate to='/Home' />} />

            <Route path='Home' element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ContextProvider>
  </StrictMode>
);
