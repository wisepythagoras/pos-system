import React from 'react';
import {
    Box,
    Button,
    Center,
    Container,
    Heading,
    HStack,
    IconButton,
    Input,
    InputGroup,
    Separator,
    Spinner,
    Table,
} from '@chakra-ui/react';
import {
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
import { LuSearch } from 'react-icons/lu';

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
                    <InputGroup height="100%" startElement={<LuSearch />}>
                        <Input
                            placeholder="Search order id"
                            variant="outline"
                            onChange={onSearchChange}
                            width="300px"
                            borderRadius="5px"
                        />
                    </InputGroup>
                </Box>
                <Separator orientation="vertical" height="100%" className="divider" />
                <Button
                    onClick={() => exportTotals()}
                    variant="solid"
                    colorPalette="teal"
                >
                    <DownloadIcon />
                    <Box paddingTop="4px">
                        Export Sales YTD
                    </Box>
                </Button>
                <Button
                    onClick={() => exportTotals(true)}
                    variant="solid"
                    colorPalette="teal"
                >
                    <DownloadIcon />
                    <Box paddingTop="4px">
                        Export Sales Past Day
                    </Box>
                </Button>
            </ControlContainer>
            <div>
                {!!error ? (
                    <Heading size="xl" as="h4">
                        {error}
                    </Heading>
                ) : null}

                {loading ? (
                    <Center>
                        <Spinner size="lg" color='#1a90ff' />
                    </Center>
                ) : (
                    <Box>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>#</Table.ColumnHeader>
                                    <Table.ColumnHeader>Purchased Items</Table.ColumnHeader>
                                    <Table.ColumnHeader></Table.ColumnHeader>
                                    <Table.ColumnHeader>Total</Table.ColumnHeader>
                                    <Table.ColumnHeader>Date Placed</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {orders.map((order, i) => <RichOrder key={i} order={order} />)}
                            </Table.Body>
                        </Table.Root>
                        <HStack marginTop="15px">
                            <Box w="40px">
                                <IconButton
                                    variant="ghost"
                                    aria-label="Previous page"
                                    disabled={page === 1}
                                    onClick={() => onPageChange(page - 1)}
                                >
                                    <ChevronLeftIcon />
                                </IconButton>
                            </Box>
                            <Box width="100%">
                                <Center>
                                    Page {page}
                                </Center>
                            </Box>
                            <Box w="40px">
                                <IconButton
                                    variant="ghost"
                                    aria-label="Next page"
                                    disabled={orders.length < 50}
                                    onClick={() => onPageChange(page + 1)}
                                >
                                    <ChevronRightIcon />
                                </IconButton>
                            </Box>
                        </HStack>
                    </Box>
                )}
            </div>
            <br />
        </Container>
    );
};
