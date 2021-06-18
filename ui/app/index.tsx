import React from 'react';
import { render } from 'react-dom';

const Hello = (props: any) => {
    return (
        <h1>
            Hello, world!
        </h1>
    );
};

const root = document.getElementById('root');

render(<Hello />, root);
