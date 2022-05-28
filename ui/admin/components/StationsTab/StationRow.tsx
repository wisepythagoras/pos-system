import React from 'react';
import { Td, Tr } from '@chakra-ui/react';
import { StationT } from '../../../app/types';

type PropsT = {
    station: StationT;
};

export const StationRow = (props: PropsT) => {
    return (
        <Tr>
            <Td>
                {props.station.id}
            </Td>
            <Td>
                {props.station.name}
            </Td>
            <Td></Td>
            <Td></Td>
        </Tr>
    );
};
