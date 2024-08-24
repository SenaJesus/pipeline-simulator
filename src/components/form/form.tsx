
import { Grid, TextField, MenuItem, Autocomplete } from '@mui/material';
import { useState,useEffect } from 'react';

const options = [
    { name: 'a0', value: 1 },
    { name: 'a1', value: 1 },
    { name: 'a2', value: 1 },
    { name: 'a3', value: 1 },
    { name: 's0', value: 1 },
    { name: 's1', value: 1 },
    { name: 's2', value: 1 },
    { name: 's3', value: 1 },
    { name: 't0', value: 1 },
    { name: 't1', value: 1 },
    { name: 't2', value: 1 },
    { name: 't3', value: 1 }
];


interface FormProps {
    instrucao: any,
    instructionToEnter: any,
    setInstructionToEnter: any,
    
};

const Form = ({
    instrucao,
    instructionToEnter,
    setInstructionToEnter,
}: FormProps) => {

    const [reg1,setReg1] = useState<any>(null)
    const [reg2,setReg2] = useState<any>(null)
    const [regDest,setRegDest] = useState<any>(null)
    const [imm,setImm] = useState<any>(null)

    useEffect(()=>{
        setReg1(null)
        setReg2(null)
        setRegDest(null)
        setImm(null)
    },[instrucao])

    switch(instrucao){
        case 'Add':
            return (<>
                <Grid container spacing={2}>
                    <Grid item xs={4}>          
                        <Autocomplete
                            options={options}
                            getOptionLabel={(register) => register.name}
                            size='small'
                            fullWidth
                            value={regDest}
                            renderInput={(params) => <TextField {...params} label='Registrador destino' name='regDest' />}
                            onChange={(event,newValue) =>{
                                setRegDest(newValue);
                                if(newValue){
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        regDest : newValue.name
                                    });
                                }else{
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        regDest : null,
                                    });
                                }
                            }}
                            noOptionsText="None instruction is available"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Autocomplete
                            options={options}
                            getOptionLabel={(register) => register.name}
                            size='small'
                            fullWidth
                            value={reg1}
                            renderInput={(params) => <TextField {...params} label='Registrador 1' name='reg1' />}
                            onChange={(event,newValue) =>{
                                setReg1(newValue);
                                if(newValue){
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        reg1 : newValue.name
                                    });
                                }else{
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        reg1 : null,
                                    });
                                }
                            }}
                            noOptionsText="None instruction is available"
                        />         
                    </Grid>
                    <Grid item xs={4}>
                        <Autocomplete
                            options={options}
                            getOptionLabel={(register) => register.name}
                            size='small'
                            fullWidth
                            value={reg2}
                            renderInput={(params) => <TextField {...params} label='Registrador 2' name='reg2' />}
                            onChange={(event,newValue) =>{
                                setReg2(newValue);
                                if(newValue){
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        reg2 : newValue.name
                                    });
                                }
                                else{
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        reg2 : null,
                                    });
                                }
                            }}
                            noOptionsText="None instruction is available"
                        /> 
                    </Grid>
                </Grid>
            </>)
        case 'Load word':
            return (<>
                <Grid container spacing={2}>
                    <Grid item xs={4}>          
                        <Autocomplete
                            options={options}
                            getOptionLabel={(register) => register.name}
                            size='small'
                            fullWidth
                            value={regDest}
                            renderInput={(params) => <TextField {...params} label='Registrador destino' name='regDest' />}
                            onChange={(event,newValue) =>{
                                setRegDest(newValue)
                                if(newValue){
                                    setRegDest(newValue);
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        regDest : newValue.name
                                    });
                                }else{
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        regDest : null,
                                    });
                                }
                            }}
                            noOptionsText="None instruction is available"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Autocomplete
                            options={options}
                            getOptionLabel={(register) => register.name}
                            size='small'
                            fullWidth
                            value={reg1}
                            renderInput={(params) => <TextField {...params} label='Registrador 1' name='reg1' />}
                            onChange={(event,newValue) =>{
                                setReg1(newValue);
                                if(newValue){
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        reg1 : newValue.name
                                    });
                                }
                                else{
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        reg1 : null,
                                    });
                                }
                            }}
                            noOptionsText="None instruction is available"
                        />         
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            size='small'
                            type='number'
                            fullWidth
                            name='imm'
                            value={imm}
                            label='Imediato'
                            onChange={(e)=>{
                                setImm(e.target.value);
                                if(e.target.value){
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        imm : parseInt(e.target.value),
                                    });
                                }else{
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        imm : null,
                                    });
                                }
                            }}
                        />
                    </Grid>
                </Grid>
        
                </>)
        case 'Store word':
            return (<>
                <Grid container spacing={2}>
                    <Grid item xs={4}>          
                        <Autocomplete
                            options={options}
                            getOptionLabel={(register) => register.name}
                            size='small'
                            fullWidth
                            value={reg1}
                            renderInput={(params) => <TextField {...params} label='Registrador 1' name='reg1' />}
                            onChange={(event,newValue) =>{
                                setReg1(newValue)
                                if(newValue){
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        reg1 : newValue.name
                                    });
                                }
                                else{
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        reg1 : null,
                                    });
                                }
                            }}
                            noOptionsText="None instruction is available"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Autocomplete
                            options={options}
                            getOptionLabel={(register) => register.name}
                            size='small'
                            fullWidth
                            value={reg2}
                            renderInput={(params) => <TextField {...params} label='Registrador 2' name='reg2' />}
                            onChange={(event,newValue) =>{
                                setReg2(newValue)
                                if(newValue){
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        reg2 : newValue.name
                                    });
                                }
                                else{
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        reg2 : null,
                                    });
                                }
                            }}
                            noOptionsText="None instruction is available"
                        />         
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            size='small'
                            type='number'
                            fullWidth
                            name='imm'
                            value={imm}
                            label='Imediato'
                            onChange={(e)=>{
                                setImm(e.target.value)
                                if(e.target.value){
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        imm : parseInt(e.target.value),
                                    });
                                }
                                else{
                                    setInstructionToEnter({
                                        ...instructionToEnter,
                                        imm : null,
                                    });
                                }
                            }}
                        />
                    </Grid>
                </Grid>
        
            </>)
        default: return null

    }
}
export default Form;

