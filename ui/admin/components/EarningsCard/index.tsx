import React from 'react';
import dayjs from 'dayjs';
import {
    Box,
    Stat,
    StatArrow,
    StatHelpText,
    StatLabel,
    StatNumber,
} from '@chakra-ui/react';

export interface IEarningsCardProps {
    day: number;
    amount: number;
    prevAmount: number;
};

/**
 * Renders an earnings card for a specific day.
 * @param props The day and the amount.
 */
export const EarningsCard = (props: IEarningsCardProps) => {
    let date = dayjs();

    if (props.day > 0) {
        date = date.subtract(props.day, 'days');
    }

    const increase = props.amount === props.prevAmount && props.amount === 0 ?
        0 :
        (((props.amount - props.prevAmount) / props.prevAmount) * 100).toFixed(2);

    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            minWidth="200px"
            p="6"
        >
            <Stat>
                <StatLabel>
                    {date.format('dddd, MMMM DD, YYYY')}
                </StatLabel>
                <StatNumber>
                    ${props.amount.toFixed(2)}
                </StatNumber>
                <StatHelpText>
                    {props.amount > props.prevAmount ? (
                        <StatArrow type="increase" />
                    ) : (
                        <StatArrow type="decrease" />
                    )}
                    {props.prevAmount === 0 && props.amount > 0 ? '100%' : `${increase}%`}
                </StatHelpText>
            </Stat>
        </Box>
    );
};
