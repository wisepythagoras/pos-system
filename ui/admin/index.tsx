import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client'
import { Main } from './components/Main';

const rootElement = document.getElementById('root') as unknown as Element | DocumentFragment;
const root = createRoot(rootElement);

root.render((
    <ChakraProvider>
        <Main />
    </ChakraProvider>
));
