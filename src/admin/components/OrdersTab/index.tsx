import React from 'react';
import {
    Box,
    Button,
    Center,
    Container,
    Divider,
    Grid,
    GridItem,
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Spinner,
    Table,
    TableContainer,
    Tbody,
    Th,
    Thead,
    Tr,
} from '@chakra-ui/react';
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    DownloadIcon,
    SearchIcon,
} from '@chakra-ui/icons';
import { DebouncedFunc } from 'lodash';
import { RichOrder } from '../RichOrder';
import { EarningsCard } from '../EarningsCard';
import { ControlContainer } from './styled';
import { RichOrderT } from '../../../app/types';
import { useIsCompactView } from '../../hooks';

type PropsT = {
    error: string | null;
    exportTotals: (pastDay?: boolean) => void;
    lastOrder: number;
    loading: boolean;
    onPageChange: (page: number) => void;
    onSearchChange: DebouncedFunc<(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void>;
    orders: RichOrderT[];
    page: number;
};

/**
 * Displays the tab containing all the orders and metrics.
 * @param props
 * @returns
 */
export const OrdersTab = (props: PropsT) => {
    const {
        error,
        exportTotals,
        lastOrder,
        loading,
        onPageChange,
        onSearchChange,
        orders,
        page,
    } = props;
    const isCompactView = useIsCompactView();

    return (
        <Container
            maxWidth="170ch"
            overflowX="auto"
            paddingInlineStart={isCompactView ? 0 : undefined}
            paddingInlineEnd={isCompactView ? 0 : undefined}
        >
            <Heading as='h3' size='lg' marginBottom="15px">
                Orders History
            </Heading>
            <ControlContainer>
                <Box>
                    <InputGroup height="100%">
                        <InputLeftElement
                            pointerEvents="none"
                            children={<SearchIcon />}
                        />
                        <Input
                            placeholder="Search order id"
                            variant="outline"
                            onChange={onSearchChange}
                            size="small"
                            width="300px"
                            borderRadius="5px"
                        />
                    </InputGroup>
                </Box>
                <Divider className="divider" orientation="vertical" height="100%" />
                <Button
                    onClick={() => exportTotals()}
                    variant="solid"
                    color="teal"
                >
                    <DownloadIcon />
                    <Box paddingTop="4px">
                        Export Sales YTD
                    </Box>
                </Button>
                <Button
                    onClick={() => exportTotals(true)}
                    variant="solid"
                    color="teal"
                >
                    <DownloadIcon />
                    <Box paddingTop="4px">
                        Export Sales Past Day
                    </Box>
                </Button>
            </ControlContainer>
            <div>
                {!!error ? (
                    <Heading variant="h4" as="h4">
                        {error}
                    </Heading>
                ) : null}

                {loading ? (
                    <Center>
                        <Spinner size="lg" color='#1a90ff' />
                    </Center>
                ) : (
                    <Box>
                        <TableContainer>
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>#</Th>
                                        <Th>Purchased Items</Th>
                                        <Th></Th>
                                        <Th>Total</Th>
                                        <Th>Date Placed</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {orders.map((order, i) => <RichOrder key={i} order={order} />)}
                                </Tbody>
                            </Table>
                            <HStack marginTop="15px">
                                <Box w="40px">
                                    <IconButton
                                        variant="ghost"
                                        icon={<ChevronLeftIcon />}
                                        aria-label="Previous page"
                                        disabled={page === 1}
                                        onClick={() => onPageChange(page - 1)}
                                    />
                                </Box>
                                <Box width="100%">
                                    <Center>
                                        Page {page}
                                    </Center>
                                </Box>
                                <Box w="40px">
                                    <IconButton
                                        variant="ghost"
                                        icon={<ChevronRightIcon />}
                                        aria-label="Next page"
                                        disabled={orders.length < 50}
                                        onClick={() => onPageChange(page + 1)}
                                    />
                                </Box>
                            </HStack>
                        </TableContainer>
                    </Box>
                )}
            </div>
            <br />
        </Container>
    );
};
