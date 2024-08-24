import { Box, Grid, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

const RegisterTable = () => {
    const [registers, setRegisters] = useState<any>([]);

    useEffect(() => {
        const newRegisters = [];
        for (let i = 0; i < 20; i++) {
            newRegisters.push({
                name: `t${i}`,
                value: '0',
            });
        }
        setRegisters(newRegisters);
    }, []); // O array vazio garante que o efeito é executado apenas uma vez, quando o componente é montado

    return (
        <Grid container spacing={0} sx={{ border: '1px solid #000000', backgroundColor: '#e8a726', opacity: 1 }}>
            <Grid item xs={12} sx={{ border: '1px solid #000000', textAlign: 'center', backgroundColor: '#e87624' }}>
                <Typography>Registradores</Typography>
            </Grid>
            {registers.map((register: any, index: any) => (
                <Grid item xs={6} key={index} sx={{ border: '1px solid #000000', padding: '0px 5px' }}>
                    <Typography>{register.name}: {register.value}</Typography>
                </Grid>
            ))}
        </Grid>
    );
};

export default RegisterTable;
