import React, { useCallback, useRef } from 'react';
import {
    Box,
    Button,
    Dialog,
    NativeSelect,
    Table,
    useDisclosure,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { ApiResponse, ProductT, ProductTypeT, StationT } from '../../../app/types';
import { StationProducts } from './StationProducts';

type PropsT = {
    station: StationT;
    products: ProductT[];
    productTypes: ProductTypeT[];
    deleteStation: (id: number) => Promise<ApiResponse<null>>;
    addProductToStation: (sId: number, pId: number) => Promise<ApiResponse<null>>;
    removeProductFromStation: (sId: number, pId: number) => Promise<ApiResponse<null>>;
};

export const StationRow = (props: PropsT) => {
    const { open: isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<any>();

    const onDelete = useCallback(async () => {
        const res = await props.deleteStation(props.station.id);
        
        if (res.success) {
            onClose();
        }
    }, [props.station]);

    return (
        <Table.Row>
            <Table.Cell width="150px">
                {props.station.id}
            </Table.Cell>
            <Table.Cell width="250px">
                {props.station.name}
            </Table.Cell>
            <Table.Cell>
                <Box>
                    <StationProducts
                        products={props.station.products}
                        productTypes={props.productTypes}
                        onRemove={(productId) => {
                            console.log(props.station);
                            return props.removeProductFromStation(props.station.id, productId);
                        }}
                    />
                </Box>
                <Box>
                    <NativeSelect.Root
                        maxWidth="300px"
                        size="md"
                        // onSelect={useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
                        //     return props.addProductToStation(props.station.id, parseInt(e.target.value, 10));
                        // }, [props.station])}
                    >
                        <NativeSelect.Field
                            placeholder="Select a product"
                            onChange={useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
                                return props.addProductToStation(props.station.id, parseInt(e.target.value, 10));
                            }, [props.station])}
                        >
                            {props.products
                                .filter((p) => {
                                    return props.station.products.findIndex((sp) => {
                                        return sp.id === p.id;
                                    }) < 0 && !p.discontinued;
                                })
                                .map((p) => {
                                    return (
                                        <option value={p.id} key={p.id}>
                                            {p.name}
                                        </option>
                                    );
                                })
                            }
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                    </NativeSelect.Root>
                </Box>
            </Table.Cell>
            <Table.Cell width="136px">
                <Button
                    colorScheme="red"
                    size="sm"
                    onClick={onOpen}
                >
                    <DeleteIcon /> Delete
                </Button>
                <Dialog.Root
                    open={isOpen}
                    onEscapeKeyDown={onClose}
                    onInteractOutside={onClose}
                    onExitComplete={onClose}
                    closeOnInteractOutside
                    closeOnEscape
                >
                    <Dialog.Trigger />
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.CloseTrigger />
                            <Dialog.Header fontSize='lg' fontWeight='bold'>
                                <Dialog.Title>Delete Station</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                Are you sure you want to delete this station?
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Button ref={cancelRef} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button colorScheme='red' onClick={onDelete} ml={3}>
                                    Delete
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Dialog.Root>
            </Table.Cell>
        </Table.Row>
    );
};
