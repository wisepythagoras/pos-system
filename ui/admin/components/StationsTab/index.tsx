import React, { useState } from 'react';
import { Box, Button, Container, FormControl, FormHelperText, FormLabel, Heading, Input, Table, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import { useCreateStation, useIsCompactView } from '../../hooks';
import { AddIcon } from '@chakra-ui/icons';

type PropsT = {};

export const StationsTab = (props: PropsT) => {
    const [newStationName, setNewStationName] = useState("");
    const isCompactView = useIsCompactView();
    const { station, createStation } = useCreateStation();

    console.log(station);

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
                        onChange={(e) => setNewStationName(e.target.value)}
                    />
                    <FormHelperText>This needs to be unique.</FormHelperText>
                    <Button
                        leftIcon={<AddIcon />}
                        colorScheme="blue"
                        variant="solid"
                        onClick={() => createStation(newStationName)}
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
                            {/* {orders.map((order, i) => <RichOrder key={i} order={order} />)} */}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};
