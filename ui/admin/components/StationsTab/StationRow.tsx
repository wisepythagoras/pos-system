import React, { useCallback, useRef } from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Select,
    Td,
    Tr,
    useDisclosure,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { ApiResponse, ProductT, StationT } from '../../../app/types';
import { StationProducts } from './StationProducts';

type PropsT = {
    station: StationT;
    products: ProductT[];
    deleteStation: (id: number) => Promise<ApiResponse<null>>;
    addProductToStation: (sId: number, pId: number) => Promise<ApiResponse<null>>;
    removeProductFromStation: (sId: number, pId: number) => Promise<ApiResponse<null>>;
};

export const StationRow = (props: PropsT) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<any>();

    const onDelete = useCallback(async () => {
        const res = await props.deleteStation(props.station.id);
        
        if (res.success) {
            onClose();
        }
    }, [props.station]);

    return (
        <Tr>
            <Td width="150px">
                {props.station.id}
            </Td>
            <Td width="250px">
                {props.station.name}
            </Td>
            <Td>
                <Box marginBottom="10px">
                    <StationProducts products={props.station.products} />
                </Box>
                <Box>
                    <Select
                        maxWidth="300px"
                        placeholder="Select a product"
                        size="md"
                        onChange={useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
                            return props.addProductToStation(props.station.id, parseInt(e.target.value, 10));
                        }, [])}
                    >
                        {props.products
                            .filter((p) => {
                                return props.station.products.findIndex((sp) => {
                                    return sp.id === p.id;
                                }) < 0;
                            })
                            .map((p) => {
                                return (
                                    <option value={p.id} key={p.id}>
                                        {p.name}
                                    </option>
                                );
                            })
                        }
                    </Select>
                </Box>
            </Td>
            <Td>
                <Button
                    leftIcon={<DeleteIcon />}
                    colorScheme="red"
                    size="sm"
                    onClick={onOpen}
                >
                    Delete
                </Button>
                <AlertDialog
                    isOpen={isOpen}
                    onClose={onClose}
                    leastDestructiveRef={cancelRef}
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent>
                            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                Delete Station
                            </AlertDialogHeader>
                            <AlertDialogBody>
                                Are you sure you want to delete this station?
                            </AlertDialogBody>
                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button colorScheme='red' onClick={onDelete} ml={3}>
                                    Delete
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </Td>
        </Tr>
    );
};
