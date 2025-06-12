import React, { useCallback, useRef, useState } from 'react';
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    Container,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    HStack,
    Input,
    Select,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { useStations, useIsCompactView, useUsers } from '../../hooks';
import { AddIcon } from '@chakra-ui/icons';

const stubUserObj = {
    username: '',
    password: '',
    confirmPassword: '',
    stationId: 0,
};

type PropsT = {};

export const UsersTab = (props: PropsT) => {
    const [newUser, setNewUser] = useState(stubUserObj);
    const isCompactView = useIsCompactView();
    const { stations } = useStations();
    const { createUser, deleteUser, users } = useUsers();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const userIdToDeleteRef = useRef<number | undefined>();
    const cancelRef = useRef<any>();

    const TargetStack = isCompactView ? VStack : HStack;

    const onDelete = useCallback(async () => {
        if (!userIdToDeleteRef.current) {
            return;
        }

        const res = await deleteUser(userIdToDeleteRef.current);

        if (res.success) {
            onClose();

            toast({
                title: 'Success',
                description: `User ${userIdToDeleteRef.current} was deleted`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'Error',
                description: `Error: ${res.error}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }

        userIdToDeleteRef.current = undefined;
    }, []);

    return (
        <Container
            maxWidth="170ch"
            overflowX="auto"
            paddingInlineStart={isCompactView ? 0 : undefined}
            paddingInlineEnd={isCompactView ? 0 : undefined}
        >
            <Box marginBottom="25px">
                <Heading as='h3' size='lg' marginBottom="15px">
                    Create a User
                </Heading>
                <FormControl>
                    <FormLabel htmlFor="user-form">
                        User details
                    </FormLabel>
                    <VStack id="user-form" spacing={3} align={isCompactView ? 'stretch' : 'start'}>
                        <TargetStack spacing={3} align={isCompactView ? 'stretch' : 'start'}>
                            <Box>
                                <Input
                                    type="text"
                                    maxWidth="400px"
                                    placeholder="Username"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                />
                                <FormHelperText>This needs to be unique.</FormHelperText>
                            </Box>
                            <Box>
                                <Input
                                    type="password"
                                    maxWidth="400px"
                                    placeholder="Password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                />
                                <FormHelperText>
                                    Passwords should be 8 characters or more.
                                </FormHelperText>
                            </Box>
                            <Box>
                                <Input
                                    type="password"
                                    maxWidth="400px"
                                    minWidth={!isCompactView ? '260px' : undefined}
                                    placeholder="Confirm password"
                                    value={newUser.confirmPassword}
                                    onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                                />
                                {newUser.password !== newUser.confirmPassword ? (
                                    <FormHelperText textColor="red">
                                        The passwords need to match.
                                    </FormHelperText>
                                ) : undefined}
                            </Box>
                        </TargetStack>
                        <Box>
                            <Select
                                onChange={(e) => {
                                    setNewUser({
                                        ...newUser,
                                        stationId: parseInt(e.target.value, 10),
                                    });
                                }}
                                value={newUser.stationId}
                            >
                                <option value="0">Not assigned</option>
                                {stations.map((station) => {
                                    return (
                                        <option value={station.id} key={`station_${station.id}`}>
                                            {station.name}
                                        </option>
                                    );
                                })}
                            </Select>
                            <FormHelperText>
                                Select a station name, if you need to assign your user to one.
                            </FormHelperText>
                        </Box>
                    </VStack>
                    <Button
                        colorScheme="blue"
                        variant="solid"
                        onClick={async () => {
                            const res = await createUser(
                                newUser.username,
                                newUser.password,
                                newUser.stationId
                            );

                            if (res.success) {
                                toast({
                                    title: 'Created new station',
                                    description: `User "${newUser.username}" was created`,
                                    status: 'success',
                                    duration: 5000,
                                    isClosable: true,
                                });
                                setNewUser(stubUserObj);
                            } else {
                                toast({
                                    title: 'Uh, oh!',
                                    description: 'Unable to create user',
                                    status: 'error',
                                    duration: 5000,
                                    isClosable: true,
                                });
                            }
                        }}
                        disabled={
                            !newUser.username ||
                            !newUser.password ||
                            newUser.password.length < 8 ||
                            newUser.password !== newUser.confirmPassword
                        }
                        marginTop="10px"
                    >
                        <AddIcon /> Create 
                    </Button>
                </FormControl>
            </Box>
            <Box>
                <TableContainer>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>#</Th>
                                <Th>Username</Th>
                                <Th>Role</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {users.map((user) => {
                                return (
                                    <Tr key={user.id}>
                                        <Td>{user.id}</Td>
                                        <Td>{user.username}</Td>
                                        <Td>
                                            {user.station?.name || 'Not assigned'}
                                        </Td>
                                        <Td>
                                            <Button
                                                colorScheme='red'
                                                ml={3}
                                                onClick={() => {
                                                    userIdToDeleteRef.current = user.id;
                                                    onOpen();
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
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
                                Are you sure you want to delete this user?
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
            </Box>
        </Container>
    );
};
