import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IInstructionMemoryTableProps } from '../../interfaces/pipeTableInterfaces';

const InstructionMemoryTable = ({
  firstColumn, secondColumn, rows, programCounter
}: IInstructionMemoryTableProps) => {
  return (
    <TableContainer 
        component={Paper} 
        sx={{
            width: '300px',
            overflowY: 'auto',
            minHeight:'237px',
            '::-webkit-scrollbar': {
                width: '5px'
            },
            '::-webkit-scrollbar-track': {
                background: '#f1f1f1'
            },
            '::-webkit-scrollbar-thumb': {
                background: '#e87624',
                borderRadius: '4px',
                '&:hover': {
                background: '#e87624'
                }
            }
        }}
    >
      <Table stickyHeader sx={{ width: '300px', }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: '1.05em', padding: '10px', textAlign: 'center', bgcolor: '#e87624' }}>
              {firstColumn}
            </TableCell>
            <TableCell sx={{ fontSize: '1.05em', padding: '10px', textAlign: 'center', bgcolor: '#e87624' }}>
              {secondColumn}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ bgcolor: 'white' }}>
          {
            rows.length > 0 ? (
              rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ padding: '5px', textAlign: 'center' }}>
                    {
                      Number(row.code) === programCounter &&
                      <div style={{ height: '10px', width: '10px', borderRadius: '50%', backgroundColor: '#330708' }} />
                    }
                    {row.code}
                  </TableCell>
                  <TableCell sx={{ padding: '5px', textAlign: 'center' }}>{row.value ?? ''}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} sx={{ padding: '10px', textAlign: 'center', bgcolor: 'white' }}>
                  Adicione alguma instrução para iniciar a simulação!
                </TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InstructionMemoryTable;