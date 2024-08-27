
import InstructionMemoryTable from '../instructionMemoryTable/instructionMemoryTable';
import { Box, Grid, Typography, Button, TextField, Autocomplete } from '@mui/material';
import { useState, useEffect } from 'react';
import { IInstruction, IStage, IInstructionMemory, IDataMemory, IRegisterMemory, IStageData, IAddInstruction } from '../../interfaces/datapathInterfaces';
import {
    INITIAL_REGISTERS,
    BASIC_INSTRUCTIONS,
    INITIAL_STAGES,
    INITIAL_DATA_MEMORY,
    INITIAL_STAGES_DATA,
    INSTRUCTION_FETCH_STAGE_ID,
    INSTRUCTION_DECODE_STAGE_ID,
    LOAD_WORD_ID,
    STORE_WORD_ID
} from '../../constants/datapathConstants';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Form from '../form/form';
import EditTable from '../editTable/editTable';
import { useSnackbar } from 'notistack';
import DataMemoryTable from '../dataMemoryTable/dataMemoryTable';


const Datapath = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [stages, setStages] = useState<IStage[]>(INITIAL_STAGES);
    const [pc, setPc] = useState<number>(0);
    const [registers, setRegisters] = useState<IRegisterMemory[]>(INITIAL_REGISTERS);
    const [dataMemory, setDataMemory] = useState<IDataMemory[]>(INITIAL_DATA_MEMORY);
    const [instructionMemory, setInstructionMemory] = useState<IInstructionMemory[]>([]);
    const [stagesData, setStagesData] = useState<IStageData[]>(INITIAL_STAGES_DATA);
    const [ciclos, setCiclos] = useState<any>([]);
    const [disableNext,setDisableNext] = useState<boolean>(false);
    
    // variavel para dizer se vai mudar ou nao os outros
    const [hasLastStage, setHasLastStage] = useState<IInstruction | null>(null);

    const [instrucao,setInstrucao] = useState<any>(null)
    const [instructionToEnter,setInstructionToEnter] = useState<any>({
        instructionId : null,
        imm:null,
        reg1:null,
        reg2:null,
        regDest:null,
    });

    const verifyDataMemoryAddressLimit = (addInstructionObj: IAddInstruction) => {
        const regValue = addInstructionObj.instructionId === LOAD_WORD_ID ?
            registers.find(el => el.name === addInstructionObj.reg1)?.value :
            registers.find(el => el.name === addInstructionObj.reg2)?.value;
        return ((regValue ?? 0) + (addInstructionObj.imm ?? 0)) > 1000;
    };

    const addInstruction = (addInstructionObj: IAddInstruction) => {
        if (
            (addInstructionObj.instructionId === LOAD_WORD_ID || addInstructionObj.instructionId === STORE_WORD_ID) &&
            verifyDataMemoryAddressLimit(addInstructionObj)
        ) return showErrorToast("O último endereço da memória é 1000!");
        const instruction = BASIC_INSTRUCTIONS.find(el => el.id === addInstructionObj.instructionId);
        if (instruction === undefined) return;
        setInstructionMemory(data =>
            [
                ...data,
                {
                    address: instructionMemory.length * 4,
                    instruction,
                    syntax: instruction.getSyntax(addInstructionObj.reg1, addInstructionObj.reg2, addInstructionObj.regDest, addInstructionObj.imm),
                    reg1: addInstructionObj.reg1,
                    reg2: addInstructionObj.reg2,
                    regDest: addInstructionObj.regDest,
                    imm: addInstructionObj.imm
                }
            ]
        );
    };

    const resetSimulatorData = () => {
        setStages(INITIAL_STAGES);
        setRegisters(INITIAL_REGISTERS);
        setDataMemory(INITIAL_DATA_MEMORY);
        setStagesData(INITIAL_STAGES_DATA);
        setCiclos([]);
    };

    const resetInstructions = () => setInstructionMemory([]);
    const resetProgramCounter = () => setPc(0);
    const resetCiclos = () => setCiclos([]);

    const executeNextInstructions = (hazard : boolean) => {
        for (let i = 4; i >= 0; i--)
        {
            const stage = stages[i];
            if ((stage.number === INSTRUCTION_FETCH_STAGE_ID || stage.number === INSTRUCTION_DECODE_STAGE_ID) && hazard) continue;
            if (stage.instructionAddress == null) continue;
            const instructionFromMemory = instructionMemory.find(el => el.address === stage.instructionAddress);
            if (instructionFromMemory == null) return;
            if (stage.number === INSTRUCTION_FETCH_STAGE_ID) {
               
                setStagesData(data => data.map(el => {
                    if (el.code === 'if_id_pc'){ 
                        el.value = pc;
                    }
                    if (el.code === 'if_id_ir') el.value = instructionFromMemory.syntax;
                    return el;
                }));
                continue;
            };
            instructionFromMemory.instruction.class.Execute(
                stage.number,
                stagesData,
                setStagesData,
                registers,
                setRegisters,
                dataMemory,
                setDataMemory,
                instructionFromMemory.reg1,
                instructionFromMemory.reg2,
                instructionFromMemory.regDest,
                instructionFromMemory.imm
            );
        };
    };

    const showErrorToast = (message: string) => {
        enqueueSnackbar(message, { variant: 'error' });
    };

    const showInfoToast = (message: string) => {
        enqueueSnackbar(message, { variant: 'info' });
    };

    const getInstructionFromStage = (stage: IStage | undefined): IInstruction | null => {
        if (!stage) return null;
        return instructionMemory.find(el => el.address === stage.instructionAddress)?.instruction ?? null;
    };

    useEffect(() => {
        const lastStage = stages.find((stage: IStage) => stage.number === 5);
        const instructionAtLastStage = getInstructionFromStage(lastStage);
        if (
            hasLastStage != null && 
            (lastStage == null || instructionAtLastStage == null || instructionAtLastStage.id == null || instructionAtLastStage.id == 3)
        ) return setHasLastStage(null);
        
        setHasLastStage(
            instructionAtLastStage ?? null
        );
    }, [stages]);

    const getInstructionImage = (currentStage: IStage) => {
        const instructionFromStage = getInstructionFromStage(currentStage);
        if (instructionFromStage?.id == null) {
            if (currentStage.number == 1 || hasLastStage == null || hasLastStage.id === 3) return `./assets/datapath/initial/pb${currentStage.number}.png`;
            return `./assets/datapath/initial/pb_${hasLastStage.fileName}${currentStage.number}.png`;
        };
        if (hasLastStage == null || hasLastStage.id === 3) return '.' + instructionFromStage.dataPath + instructionFromStage.fileName + `_${currentStage.number}.png`;
        return '.' + instructionFromStage.dataPath + instructionFromStage.fileName + `_${hasLastStage.fileName}_${currentStage.number}.png`;
    };

    const handleNext = () =>{
        let pc_real: number;
         
        const newStages = [...stages];
      
        
        let pausa=false;
        for(let i = 2;i<=3;i++){
            const instructionFromMemoryI = instructionMemory.find(el => el.address === stages[i].instructionAddress);
            const instructionFromMemory1 = instructionMemory.find(el => el.address === stages[1].instructionAddress);
            if (!instructionFromMemoryI || !instructionFromMemory1) continue;
            if( (instructionFromMemoryI.regDest === instructionFromMemory1.reg1 || instructionFromMemoryI.regDest === instructionFromMemory1.reg2) && instructionFromMemoryI !== null ){
            
                pausa=true;
            }
        }
        
        executeNextInstructions(pausa);

        if(newStages[0].instructionAddress !== null && !pausa){
            setPc(pc + 4);
            pc_real=pc+4;
        }
        else{
            pc_real=pc;
        }
        
        if(!pausa){
            for (let i = newStages.length - 1; i > 0; i--) {
                newStages[i].instructionAddress = newStages[i - 1].instructionAddress;
            };

            newStages[0].instructionAddress = null;
           
            const nova_instrucao = instructionMemory.find( el=> el.address === pc_real )
           
            if (nova_instrucao) {
                newStages[0].instructionAddress = nova_instrucao.address
            }
            setStages(newStages)
        }
        else {
            showInfoToast('Hazard detectado, estágios 1 e 2 foram congelados!');
            for (let i = newStages.length - 1; i > 2; i--) {
                newStages[i].instructionAddress = newStages[i - 1].instructionAddress;
            };
            newStages[2].instructionAddress = null;
            setStages(newStages);
        };
        setHandleNextButton(true);
    };

    const [handleNextButton, setHandleNextButton] = useState<boolean>(false);

    useEffect(()=>{
        if (!handleNextButton) return;
        setCiclos([...ciclos, JSON.parse(JSON.stringify(stagesData))]);
        setHandleNextButton(false);
    }, [handleNextButton]);
    const [ad,setAd] = useState<boolean>(false);
    useEffect(()=>{
        setDisableNext(handleDisabledNextClock());
    }, [handleNextButton,ad]);

    const handleDisabledNextClock = () => stages.every(el => el.instructionAddress === null) && !instructionMemory.find(el => el.address === pc);

    return (
        <Box sx={{ height:'100%', backgroundColor: '#ffdb74',padding:'20px 50px', maxWidth: '100vw', overflowX: 'hidden'}}>
            
            <Grid container 
                sx={{
                    padding:'10px',
                }}
                spacing={2}
            >
                <Grid item xs={12}>
                    <Grid container spacing={2} >
                       
                        <Grid item xs={12}>
                            <Box sx={{  display: 'flex', gap: '10px',height:'730px' }}>
                                <Box >
                                    <Grid container spacing={2}>
                                        <Grid item xs={3} >
                                            <Autocomplete
                                                options={BASIC_INSTRUCTIONS}
                                                getOptionLabel={(instruction) => instruction.name}
                                                size='small'
                                                fullWidth
                                                renderInput={(params) => 
                                                <TextField
                                                 {...params} 
                                                 label="Instrução"
                                                 sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                      '& fieldset': {
                                                        borderColor: '#e87624',
                                                      },
                                                      '&:hover fieldset': {
                                                        borderColor: '#e87624',
                                                      },
                                                      '&.Mui-focused fieldset': {
                                                        borderColor: '#e87624',
                                                        borderWidth: '2px',
                                                      },
                                                      '& input': {
                                                        color: '#330708',
                                                      }
                                                    },
                                                    '& .MuiInputLabel-root': {
                                                      color: '#e87624',
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': {
                                                      color: '#e87624',
                                                    }
                                                  }}
                                                
                                                
                                                />}
                                                onChange={(_,newValue) =>{
                                                    setInstrucao(newValue ? newValue.name :null)
                                                
                                                    if(newValue){
                                                        setInstructionToEnter({
                                                            instructionId : newValue.id,
                                                            imm:null,
                                                            reg1:null,
                                                            reg2:null,
                                                            regDest:null,
                                                        });
                                                    }
                                                }}
                                                noOptionsText="None instruction is available"
                                            />
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Box sx={{display:'flex',gap:2}}>
                                                <Button onClick={()=>resetSimulatorData()} sx={{
                                                    color:'black',border:'1px solid transparent',
                                                    backgroundColor:'#e87624',
                                                    padding:'5px 20px',
                                                    transition: 'transform 0.3s ease-in-out',
                                                    '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    backgroundColor: '#e87624',
                                                    }
                                                }}>
                                                    Apagar dados
                                                </Button>

                                                < Button onClick={()=>resetInstructions()} sx={{
                                                    color:'black',border:'1px solid transparent',
                                                    backgroundColor:'#e87624',
                                                    padding:'5px 20px',
                                                    transition: 'transform 0.3s ease-in-out',
                                                    '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    backgroundColor: '#e87624',
                                                    }
                                                }}>
                                                    Apagar Instruções
                                                </Button>

                                                <Button onClick={()=>resetProgramCounter()} sx={{
                                                    color:'black',border:'1px solid transparent',
                                                    backgroundColor:'#e87624',
                                                    padding:'5px 20px',
                                                    transition: 'transform 0.3s ease-in-out',
                                                    '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    backgroundColor: '#e87624',
                                                    }
                                                }}>
                                                    Resetar PC
                                                </Button>

                                                <Button onClick={()=>resetCiclos()} sx={{
                                                    color:'black',border:'1px solid transparent',
                                                    backgroundColor:'#e87624',
                                                    padding:'5px 20px',
                                                    transition: 'transform 0.3s ease-in-out',
                                                    '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    backgroundColor: '#e87624',
                                                    }
                                                }}>
                                                    Apagar ciclos
                                                </Button>
                                            </Box>
                                        </Grid>
                                        
                                     
                                        { instrucao!==null && instrucao!==undefined && <>
                                            <Grid item xs={7}>
                                                <Form  instrucao={instrucao} instructionToEnter={instructionToEnter} setInstructionToEnter={setInstructionToEnter} />
                                            </Grid>
                                
                                            <Grid item xs={5}>
                                                <Box sx={{width:'100%',display:'flex',gap:2}}>
                                                    <Button 
                                                        onClick={()=> {
                                                            let ct=0;
                                                            if(instructionToEnter.instructionId===null)ct+=1
                                                            if(instructionToEnter.reg1===null)ct+=1
                                                            if(instructionToEnter.reg2===null)ct+=1
                                                            if(instructionToEnter.regDest===null)ct+=1
                                                            if(instructionToEnter.imm===null)ct+=1
                                                            if(ct>1){
                                                                showErrorToast('Por favor, preencha todos os campos da instrução!');
                                                            }
                                                            else{
                                                                setAd(!ad);
                                                                addInstruction(instructionToEnter)
                                                            }
                                                        }}
                                                        sx={{color:'black',
                                                            border:'1px solid transparent',
                                                            backgroundColor:'#e87624',
                                                            padding:'5px 20px',
                                                            transition: 'transform 0.3s ease-in-out',
                                                            '&:hover': {
                                                            transform: 'scale(1.05)',
                                                            backgroundColor: '#e87624',
                                                            }
                                                        }}
                                                    >
                                                        Adicionar
                                                    </Button>
                                                    <Button 
                                                        onClick={()=>handleNext()} 
                                                        sx={{
                                                            color:'black',border:'1px solid transparent',
                                                            backgroundColor:'#e87624',
                                                            padding:'5px 20px',
                                                            transition: 'transform 0.3s ease-in-out',
                                                            '&:hover': {
                                                                transform: 'scale(1.05)',
                                                                backgroundColor: '#e87624',
                                                            }
                                                            
                                                        }}
                                                        disabled={disableNext}
                                                    >
                                                        Próximo Ciclo
                                                    </Button>
                                                </Box>
                                            </Grid>
                                        </>
                                        }
                                    </Grid>
                                    <Box sx={{height:'615px',mt:2}}>
                                        <Box sx={{ display: 'flex', height: '100%' }}>
                                            {
                                                stages.map((stage: IStage,index:number) => (
                                                    <img key={index} src={getInstructionImage(stage)} />
                                                ))
                                            }
                                        </Box>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <InstructionMemoryTable
                                        firstColumn='PC'
                                        secondColumn='Instrução'
                                        rows={
                                            instructionMemory.map(el => { return { code: String(el.address), value: el.syntax } })
                                        }
                                        programCounter={
                                            stages.find(el => el.instructionAddress !== null)?.instructionAddress ?? undefined
                                        }
                                    />
                                    <DataMemoryTable
                                        firstColumn='Endereço'
                                        secondColumn='Conteúdo da Memória'
                                        rows={
                                            dataMemory.map(el => { return { code: String(el.address), value: el.value } })
                                        }
                                        setter={setDataMemory}
                                        isNumber={true}
                                    />
                                    <EditTable
                                        firstColumn='Nome'
                                        secondColumn='Conteúdo do Registrador'
                                        rows={
                                            registers.map(el => { return { code: String(el.name), value: el.value } })
                                        }
                                        setter={setRegisters}
                                        isNumber={false}
                                    />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                {ciclos.map((data: any,index: number)=>(                    
                    <Grid key={index} item xs={4}>
                        <Typography sx={{fontWeight:600}}>Ciclo {index}</Typography>
                        <Table>
                            <TableHead sx={{ bgcolor: '#e87624' }}>
                                <TableRow>
                                    <TableCell sx={{ fontSize: '1.05em', padding: '10px', textAlign: 'center' }}>Registrador</TableCell>
                                    <TableCell sx={{ fontSize: '1.05em', padding: '10px', textAlign: 'center' }}>Valor</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{ bgcolor: 'white' }} >
                                {
                                    data.map((registrador: any,index:number)=>(
                                        <TableRow key={index}>
                                            <TableCell sx={{ padding: '5px', textAlign: 'center' }}>{(registrador.code).toUpperCase().replace('_','/').replace(/_/g, " ")}</TableCell>
                                            <TableCell sx={{ padding: '5px', textAlign: 'center' }}>{registrador.value !== null ? registrador.value : "Don't Care"}</TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </Grid>
                ))}
            </Grid>
            
        </Box>
    );
};

export default Datapath;