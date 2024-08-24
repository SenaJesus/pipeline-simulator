import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { IPipeTableProps } from '../../interfaces/pipeTableInterfaces';

const PipeTable = ({
  firstColumn, secondColumn, rows
}: IPipeTableProps) => {
    return (
      <Table sx={{ width: '300px' }}>
          <TableHead sx={{ bgcolor: '#e87624' }}>
            <TableRow>
              <TableCell sx={{ fontSize: '1.05em', padding: '10px', textAlign: 'center' }}>{ firstColumn }</TableCell>
              <TableCell sx={{ fontSize: '1.05em', padding: '10px', textAlign: 'center' }}>{ secondColumn }</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ bgcolor: 'white' }} >
            {
              rows.map(row => (
                <TableRow>
                  <TableCell sx={{ padding: '5px', textAlign: 'center' }}>{row.code}</TableCell>
                  <TableCell sx={{ padding: '5px', textAlign: 'center' }}>{row.value ?? ''}</TableCell>
                </TableRow>
              ))
            }
          </TableBody>
      </Table>
    );
};

export default PipeTable;