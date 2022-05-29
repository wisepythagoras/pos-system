import React, { useRef, useState } from 'react';
import { Box,
    Button,
    Container,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Input,
    Table,
    TableContainer,
    Tbody,
    Th,
    Thead,
    Tr,
    useToast,
} from '@chakra-ui/react';
import { useStations, useIsCompactView, useGetProductsList } from '../../hooks';
import { AddIcon } from '@chakra-ui/icons';
import { StationRow } from './StationRow';

type PropsT = {};

export const StationsTab = (props: PropsT) => {
    const [newStationName, setNewStationName] = useState("");
    const isCompactView = useIsCompactView();
    const { products } = useGetProductsList();
    const {
        stations,
        createStation,
        deleteStation,
        addProductToStation,
        removeProductFromStation,
    } = useStations();
    const toast = useToast();
    const inputRef = useRef<HTMLInputElement | null>(null);

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
                        ref={inputRef}
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
                                setNewStationName('');
                                toast({
                                    title: 'Created new station',
                                    description: `Station "${res.data.name}" with id ${res.data.id}`,
                                    status: 'success',
                                    duration: 5000,
                                    isClosable: true,
                                });

                                if (inputRef.current) {
                                    inputRef.current.value = '';
                                }
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
                            {stations.map((station, i) => {
                                return (
                                    <StationRow
                                        key={i}
                                        station={station}
                                        products={products}
                                        deleteStation={deleteStation}
                                        addProductToStation={addProductToStation}
                                        removeProductFromStation={removeProductFromStation}
                                    />
                                );
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};
