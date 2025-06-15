import React, { useCallback, useRef, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Input,
    Table,
    useDisclosure,
    VStack,
    NativeSelect,
    Field,
    Dialog,
} from '@chakra-ui/react';
import { useStations, useIsCompactView, useUsers } from '../../hooks';
import { AddIcon } from '@chakra-ui/icons';
import { toaster } from '../../../components/ui/toaster';

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
    const { open: isOpen, onOpen, onClose } = useDisclosure();
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

            toaster.create({
                title: 'Success',
                description: `User ${userIdToDeleteRef.current} was deleted`,
                type: 'success',
                duration: 5000,
                closable: true,
            });
        } else {
            toaster.create({
                title: 'Error',
                description: `Error: ${res.error}`,
                type: 'error',
                duration: 5000,
                closable: true,
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
                <Field.Root>
                    <Field.Label>User details</Field.Label>
                    <VStack id="user-form" spaceY={3} align={isCompactView ? 'stretch' : 'start'}>
                        <TargetStack
                            spaceX={!isCompactView ? 3 : undefined}
                            spaceY={isCompactView ? 3 : undefined}
                            align={isCompactView ? 'stretch' : 'start'}
                        >
                            <Box flex={1}>
                                <Input
                                    type="text"
                                    maxWidth="400px"
                                    placeholder="Username"
                                    value={newUser.username}
                                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                />
                                <Field.HelperText>This needs to be unique.</Field.HelperText>
                            </Box>
                            <Box flex={1}>
                                <Input
                                    type="password"
                                    maxWidth="400px"
                                    placeholder="Password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                />
                                <Field.HelperText>
                                    Passwords should be 8 characters or more.
                                </Field.HelperText>
                            </Box>
                            <Box flex={1}>
                                <Input
                                    type="password"
                                    maxWidth="400px"
                                    minWidth={!isCompactView ? '260px' : undefined}
                                    placeholder="Confirm password"
                                    value={newUser.confirmPassword}
                                    onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                                />
                                {newUser.password !== newUser.confirmPassword ? (
                                    <Field.HelperText>The passwords need to match.</Field.HelperText>
                                ) : undefined}
                            </Box>
                        </TargetStack>
                        <Box>
                            <NativeSelect.Root>
                                <NativeSelect.Field
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
                                </NativeSelect.Field>
                                <NativeSelect.Indicator />
                            </NativeSelect.Root>
                            <Field.HelperText>
                                Select a station name, if you need to assign your user to one.
                            </Field.HelperText>
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
                                toaster.create({
                                    title: 'Created new station',
                                    description: `User "${newUser.username}" was created`,
                                    type: 'success',
                                    duration: 5000,
                                    closable: true,
                                });
                                setNewUser(stubUserObj);
                            } else {
                                toaster.create({
                                    title: 'Uh, oh!',
                                    description: 'Unable to create user',
                                    type: 'error',
                                    duration: 5000,
                                    closable: true,
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
                </Field.Root>
            </Box>
            <Box>
                <Box>
                    <Table.Root>
                        <Table.Header>
                            <Table.Row>
                                <Table.ColumnHeader>#</Table.ColumnHeader>
                                <Table.ColumnHeader>Username</Table.ColumnHeader>
                                <Table.ColumnHeader>Role</Table.ColumnHeader>
                                <Table.ColumnHeader></Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {users.map((user) => {
                                return (
                                    <Table.Row key={user.id}>
                                        <Table.Cell>{user.id}</Table.Cell>
                                        <Table.Cell>{user.username}</Table.Cell>
                                        <Table.Cell>
                                            {user.station?.name || 'Not assigned'}
                                        </Table.Cell>
                                        <Table.Cell>
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
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table.Root>
                </Box>
                <Dialog.Root
                    role='alertdialog'
                    open={isOpen}
                    closeOnInteractOutside
                    closeOnEscape
                    onEscapeKeyDown={onClose}
                    onExitComplete={onClose}
                    onInteractOutside={onClose}
                >
                    <Dialog.Trigger />
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.CloseTrigger />
                            <Dialog.Header fontSize='lg' fontWeight='bold'>
                                Delete Station
                            </Dialog.Header>
                            <Dialog.Body>
                                Are you sure you want to delete this user?
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Button ref={cancelRef} onClick={onClose}>
                                    Cancel
                                </Button>
                                <Button colorPalette='red' onClick={onDelete} ml={3}>
                                    Delete
                                </Button>
                            </Dialog.Footer>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Dialog.Root>
            </Box>
        </Container>
    );
};
