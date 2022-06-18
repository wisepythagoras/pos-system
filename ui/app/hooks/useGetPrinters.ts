import { useEffect, useState } from 'react';
import { PrinterT } from '../types';

/**
 * This custom hook retrieves the list of printers.
 * @returns The printers and a function to manually get them.
 */
 export const useGetPrinters = () => {
    const [printers, setPrinters] = useState<PrinterT[]>([]);

    const getPrinters = async () => {
        const req = await fetch('/api/printers');
        const resp = await req.json();

        setPrinters(resp.data);
    };

    useEffect(() => {
        getPrinters();
    }, []);

    return { printers, getPrinters };
};
