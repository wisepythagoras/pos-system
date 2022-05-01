import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { render } from 'react-dom';
import { Main } from './components/Main';

const root = document.getElementById('root');

render((
    <ChakraProvider>
        <Main />
    </ChakraProvider>
), root);
