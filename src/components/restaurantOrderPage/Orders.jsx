import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, tableCellClasses, styled } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function Orders(props) {
    const getInput = (row) => {
        return `${row.timeOfDayName}, ${row.dishTypesRequested.join(', ')}`;
    };

    const getOutput = (row) => {
        if (row.dishesDelivered.some(d => d == null)) {
            row.dishesDelivered = row.dishesDelivered.filter(n => n);
            row.dishesDelivered.push('error');
        }

        return `${row.dishesDelivered.join(', ')}`;
    };

    return (
        <TableContainer component={Paper} sx={ props.sx }>
            <Table sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Input</StyledTableCell>
                        <StyledTableCell>Output</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.map((row) => (
                        <StyledTableRow key={row.id}>
                            <StyledTableCell>{getInput(row)}</StyledTableCell>
                            <StyledTableCell>{getOutput(row)}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}