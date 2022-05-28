import React, { useCallback, useRef } from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
    Td,
    Tr,
    useDisclosure,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { ApiResponse, StationT } from '../../../app/types';
import { useStations } from '../../hooks';

type PropsT = {
    station: StationT;
    deleteStation: (id: number) => Promise<ApiResponse<null>>;
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
            <Td>
                {props.station.id}
            </Td>
            <Td>
                {props.station.name}
            </Td>
            <Td></Td>
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
