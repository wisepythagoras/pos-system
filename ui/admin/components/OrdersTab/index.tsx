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
    earnings: number;
    earningsPerDay: number[];
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
        earnings,
        earningsPerDay,
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
            <Heading variant="h3" as="h3" marginBottom="10px">
                Total Earnings: ${earnings.toFixed(2)}
            </Heading>
            <Grid templateColumns='repeat(4, 1fr)' gap={5} minWidth="400px" overflowX="auto">
                <GridItem>
                    <EarningsCard day={0} amount={earningsPerDay[0]} />
                </GridItem>
                <GridItem>
                    <EarningsCard day={1} amount={earningsPerDay[1]} />
                </GridItem>
                <GridItem>
                    <EarningsCard day={2} amount={earningsPerDay[2]} />
                </GridItem>
                <GridItem>
                    <EarningsCard day={3} amount={earningsPerDay[3]} />
                </GridItem>
            </Grid>
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
                    leftIcon={<DownloadIcon />}
                    onClick={() => exportTotals()}
                    variant="solid"
                    color="teal"
                >
                    <Box paddingTop="4px">
                        Export Sales YTD
                    </Box>
                </Button>
                <Button
                    leftIcon={<DownloadIcon />}
                    onClick={() => exportTotals(true)}
                    variant="solid"
                    color="teal"
                >
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
                            {/* <PaginationContainer>
                                <Pagination
                                    defaultPage={1}
                                    count={Math.round(lastOrder / 50)}
                                    page={page}
                                    onChange={(_, page) => {
                                        onPageChange(page);
                                    }}
                                    hideNextButton={orders.length < 50}
                                    size="large"
                                    showFirstButton
                                    showLastButton
                                />
                            </PaginationContainer> */}
                        </TableContainer>
                    </Box>
                )}
            </div>
            <br />
        </Container>
    );
};
