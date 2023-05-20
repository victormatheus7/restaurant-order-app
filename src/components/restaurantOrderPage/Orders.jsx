import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function Orders(props) {
    const getInput = (row) => {
        return `${row.timeOfDayName}, ${row.dishTypesRequested.join(', ')}`;
    };

    const getOutput = (row) => {
        if (row.dishesDelivered.some(d => d == null))
        {
            row.dishesDelivered = row.dishesDelivered.filter(n => n);
            row.dishesDelivered.push('error');
        }

        return `${row.dishesDelivered.join(', ')}`;
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Input</TableCell>
                        <TableCell>Output</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{getInput(row)}</TableCell>
                            <TableCell>{getOutput(row)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}