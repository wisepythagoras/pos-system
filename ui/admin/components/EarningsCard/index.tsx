import React from 'react';
import dayjs from 'dayjs';
import { Card, CardContent, Typography } from '@material-ui/core';

export interface IEarningsCardProps {
    day: number;
    amount: number;
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

    return (
        <Card>
            <CardContent>
                <Typography color="textSecondary" gutterBottom>
                    {date.format('dddd, MMMM DD, YYYY')}
                </Typography>
                <Typography variant="h5" component="h2">
                    ${props.amount.toFixed(2)}
                </Typography>
            </CardContent>
        </Card>
    );
};
