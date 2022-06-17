import { Alert, Center } from '@chakra-ui/react';
import React from 'react';
import { UserT } from '../../types';

type PropsT = {
    user: UserT;
};

export const StationHome = (props: PropsT) => {
    const { user } = props;

    if (!user.station) {
        return (
            <Center>
                <Alert status="warning">
                    You are not assigned to any station.
                </Alert>
            </Center>
        );
    }

    return (
        <Center>
            <Alert status="info">
                You are assigned to the station "{user.station.name}".
            </Alert>
        </Center>
    );
};
