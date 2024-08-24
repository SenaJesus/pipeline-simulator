import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { IEditTableProps } from '../../interfaces/pipeTableInterfaces';

const EditTable = ({
  firstColumn,
  secondColumn,
  rows,
  setter,
  isNumber
}: IEditTableProps) => {
    const handleChangeInput = (code: string, newValue: string) => {
        if (isNumber) {
            setter(
                (values: any) => values.map((el: any) => 
                    {
                        if (el.address === Number(code)) el.value = Number(newValue);
                        return el;
                    }
                )
            );
        };
        setter(
            (values: any) => values.map((el: any) => {
                if (el.name === code) el.value = Number(newValue);
                return el;
            })
        );
    };

    return (
        <TableContainer 
            component={Paper} 
            sx={{
                width: '300px',
              
                overflowY: 'auto',
                maxHeight:'236px',
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
            <Table stickyHeader aria-label="sticky table">
                <TableHead sx={{ bgcolor: '#e87624' }}>
                <TableRow>
                    <TableCell sx={{ fontSize: '1.05em', padding: '10px', textAlign: 'center', bgcolor: '#e87624' }}>{ firstColumn }</TableCell>
                    <TableCell sx={{ fontSize: '1.05em', padding: '10px', textAlign: 'center', bgcolor: '#e87624' }}>{ secondColumn }</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {
                    rows.map((row, index) => (
                        <TableRow key={index}>
                            <TableCell sx={{ padding: '0px', textAlign: 'center' }}>{row.code}</TableCell>
                            <TableCell sx={{ padding: '0px', textAlign: 'center' }}>
                                <TextField
                                    size='small'
                                    fullWidth
                                    variant="outlined"
                                    InputProps={{
                                        sx: {
                                          height: '24px', // Define a altura do TextField
                                          padding: '0 14px', // Ajusta o padding interno
                                        }
                                      }}
                                    sx={{
                                        '& .MuiFormHelperText-root': { color: '#e87624' },
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                              borderColor: '#e87624',
                                              borderWidth: '1px'
                                            }
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'rgba(0, 0, 0, 0.23)',
                                        }
                                    }}
                                    value={row.value}
                                    onChange={(event) => handleChangeInput(row.code, event.target.value)}
                                />
                            </TableCell>
                        </TableRow>
                    ))
                }
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default EditTable;