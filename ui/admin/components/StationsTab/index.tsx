import React, { useState } from 'react';
import { Box, Button, Container, FormControl, FormHelperText, FormLabel, Heading, Input, Table, TableContainer, Tbody, Th, Thead, Tr, useToast } from '@chakra-ui/react';
import { useCreateStation, useGetStations, useIsCompactView } from '../../hooks';
import { AddIcon } from '@chakra-ui/icons';
import { StationRow } from './StationRow';

type PropsT = {};

export const StationsTab = (props: PropsT) => {
    const [newStationName, setNewStationName] = useState("");
    const isCompactView = useIsCompactView();
    const { station, createStation } = useCreateStation();
    const { stations, getStations } = useGetStations();
    const toast = useToast();

    console.log(stations);

    return (
        <Container
            maxWidth="170ch"
            overflowX="auto"
            paddingInlineStart={isCompactView ? 0 : undefined}
            paddingInlineEnd={isCompactView ? 0 : undefined}
        >
            <Box marginBottom="25px">
                <Heading as='h3' size='lg' marginBottom="15px">
                    Create a station
                </Heading>
                <FormControl>
                    <FormLabel htmlFor="station-name">
                        Station Name
                    </FormLabel>
                    <Input
                        id="station-name"
                        type="text"
                        maxWidth="400px"
                        placeholder="Enter here"
                        onChange={(e) => setNewStationName(e.target.value)}
                    />
                    <FormHelperText>This needs to be unique.</FormHelperText>
                    <Button
                        leftIcon={<AddIcon />}
                        colorScheme="blue"
                        variant="solid"
                        onClick={async () => {
                            const res = await createStation(newStationName);

                            if (res.success && res.data) {
                                toast({
                                    title: 'Created new station',
                                    description: `Station "${res.data.name}" with id ${res.data.id}`,
                                    status: 'success',
                                    duration: 5000,
                                    isClosable: true,
                                });
                                getStations();
                                setNewStationName('');
                            } else {
                                toast({
                                    title: 'Uh, oh!',
                                    description: 'Unable to create station',
                                    status: 'error',
                                    duration: 5000,
                                    isClosable: true,
                                });
                            }
                        }}
                        disabled={!newStationName}
                        marginTop="10px"
                    >
                        Create 
                    </Button>
                </FormControl>
            </Box>
            <Box>
                <TableContainer>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>#</Th>
                                <Th>Name</Th>
                                <Th>Products</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {stations.map((station, i) => <StationRow key={i} station={station} />)}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};
