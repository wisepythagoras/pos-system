import React, { useRef, useState } from 'react';
import { Box,
    Button,
    Container,
    Field,
    Heading,
    Input,
    Table,
} from '@chakra-ui/react';
import { useStations, useIsCompactView, useGetProductsList, useProductTypes } from '../../hooks';
import { AddIcon } from '@chakra-ui/icons';
import { StationRow } from './StationRow';
import { toaster } from '../../../components/ui/toaster';

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
    const { productTypes } = useProductTypes();

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
                <Field.Root>
                    <Field.Label>Station Name</Field.Label>
                    <Input
                        id="station-name"
                        type="text"
                        maxWidth="400px"
                        placeholder="Enter here"
                        value={newStationName}
                        onChange={(e) => setNewStationName(e.target.value)}
                    />
                    <Field.HelperText>This needs to be unique.</Field.HelperText>
                    <Button
                        colorScheme="blue"
                        variant="solid"
                        onClick={async () => {
                            const res = await createStation(newStationName);

                            if (res.success && res.data) {
                                setNewStationName('');
                                toaster.create({
                                    title: 'Created new station',
                                    description: `Station "${res.data.name}" with id ${res.data.id}`,
                                    type: 'success',
                                    duration: 5000,
                                    closable: true,
                                });
                            } else {
                                toaster.create({
                                    title: 'Uh, oh!',
                                    description: 'Unable to create station',
                                    type: 'error',
                                    duration: 5000,
                                    closable: true,
                                });
                            }
                        }}
                        disabled={!newStationName}
                        marginTop="10px"
                    >
                        <AddIcon /> Create 
                    </Button>
                </Field.Root>
            </Box>
            <Box>
                <Table.Root>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>#</Table.ColumnHeader>
                            <Table.ColumnHeader>Name</Table.ColumnHeader>
                            <Table.ColumnHeader>Products</Table.ColumnHeader>
                            <Table.ColumnHeader></Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {stations.map((station, i) => {
                            return (
                                <StationRow
                                    key={i}
                                    station={station}
                                    products={products}
                                    deleteStation={deleteStation}
                                    addProductToStation={addProductToStation}
                                    removeProductFromStation={removeProductFromStation}
                                    productTypes={productTypes}
                                />
                            );
                        })}
                    </Table.Body>
                </Table.Root>
            </Box>
        </Container>
    );
};
