import React from 'react';
import { ChakraProvider, Theme } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client'
import { Home } from './components/Home';

// const rootElement = document.getElementById('root') as unknown as Element | DocumentFragment;
// const root = createRoot(rootElement);

// root.render((
//     <Theme appearance="dark">
//         <Home />
//     </Theme>
// ));

export const POSApp = () => {
    return (
        <Theme appearance="dark">
            <Home />
        </Theme>
    );
};
