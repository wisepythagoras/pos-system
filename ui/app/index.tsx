import React from 'react';
import { render } from 'react-dom';
import { Button } from '@material-ui/core';

const Hello = (props: any) => {
    return (
        <div>
            <h1>
                Hello, world!
            </h1>
            <Button variant="contained" color="primary">Hello</Button>
        </div>
    );
};

const root = document.getElementById('root');

render(<Hello />, root);
