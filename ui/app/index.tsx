import React from 'react';
import { createRoot } from 'react-dom/client'
import { Home } from './components/Home';

const rootElement = document.getElementById('root') as unknown as Element | DocumentFragment;
const root = createRoot(rootElement);

root.render(<Home />);
