import React from 'react';
import { createRoot } from 'react-dom/client'
import { Main as AdminMain } from './admin/components/Main';
import { Provider } from './components/ui/provider';
import { POSApp } from './app';

const rootElement = document.getElementById('root') as unknown as Element | DocumentFragment;
const root = createRoot(rootElement);

root.render((
    <Provider>
        {window.location.pathname === '/admin'
            ? <AdminMain />
            : <POSApp />}
    </Provider>
));
