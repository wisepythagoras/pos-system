import React from 'react';
import { Box } from '@chakra-ui/react';
import styled from 'styled-components';

const RoundBox = styled(Box)`
    border-radius: var(--chakra-radii-full);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    text-transform: uppercase;
    font-weight: var(--chakra-fontWeights-medium);
    position: relative;
    flex-shrink: 0;
    background: var(--avatar-background);
    color: var(--chakra-colors-white);
    border-color: var(--avatar-border-color);
    vertical-align: top;
    width: var(--chakra-sizes-8);
    height: var(--chakra-sizes-8);
    font-size: calc(2rem / 2.5);
    background-color: #2b3141;

    & > .count {
        font-size: 0.9rem;
        color: var(--chakra-colors-gray-500);
    }
`

type PropsT = {
    count: number;
};

export const CountPill = (props: PropsT) => {
    return (
        <RoundBox>
            <div className="count">
                {props.count}
            </div>
        </RoundBox>
    );
};
