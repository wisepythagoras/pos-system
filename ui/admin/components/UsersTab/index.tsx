import React, { useRef, useState } from 'react';
import { Box,
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
    Th,
    Thead,
    Tr,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { useStations, useIsCompactView, useUsers } from '../../hooks';
import { AddIcon } from '@chakra-ui/icons';

const stubUserObj = {
    username: '',
    password: '',
    stationId: 0,
};

type PropsT = {};

export const UsersTab = (props: PropsT) => {
    const [newUser, setNewUser] = useState(stubUserObj);
    const isCompactView = useIsCompactView();
    const { stations } = useStations();
    const { createUser } = useUsers();
    const toast = useToast();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const TargetStack = isCompactView ? VStack : HStack;

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
                                    ref={inputRef}
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
                                    The password needs to be 8 characters or more.
                                </FormHelperText>
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
                            >
                                <option value="0">Not assigned</option>
                                {stations.map((station) => {
                                    return (
                                        <option value={station.id}>
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
                        leftIcon={<AddIcon />}
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

                                if (inputRef.current) {
                                    inputRef.current.value = '';
                                }
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
                            newUser.password.length < 8
                        }
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
                                <Th>Username</Th>
                                <Th>Role</Th>
                                <Th></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                        </Tbody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};
