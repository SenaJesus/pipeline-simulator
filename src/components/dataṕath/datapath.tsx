
import PipeTable from '../pipeTable/pipeTable';
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
    INSTRUCTION_DECODE_STAGE_ID
} from '../../constants/datapathConstants';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import Form from '../form/form';
import { toast } from 'react-toastify';
import ToastError from '../toastError/toastError';
import 'react-toastify/dist/ReactToastify.css';


const Datapath = () => {
    const [stages, setStages] = useState<IStage[]>(INITIAL_STAGES);
    const [pc, setPc] = useState<number>(0);
    const [registers, setRegisters] = useState<IRegisterMemory[]>(INITIAL_REGISTERS);
    const [dataMemory, setDataMemory] = useState<IDataMemory[]>(INITIAL_DATA_MEMORY);
    const [instructionMemory, setInstructionMemory] = useState<IInstructionMemory[]>([]); // fazer aqui a listagem das instrucoes
    const [stagesData, setStagesData] = useState<IStageData[]>(INITIAL_STAGES_DATA);
    
    // variavel para dizer se vai mudar ou nao os outros
    const [hasLastStage, setHasLastStage] = useState<IInstruction | null>(null);

    const [instrucao,setInstrucao] = useState<any>(null)
    const [instructionToEnter,setInstructionToEnter] = useState<any>({
        instructionId : null,
        imm:null,
        reg1:null,
        reg2:null,
        regDest:null,
    })
    const [ciclos,setCiclos] = useState<any>([])
  

    const addInstruction = (addInstructionObj: IAddInstruction) => {
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

    const executeNextInstructions = (hazard : boolean) => {
        for (let i = 4; i >= 0; i--)
        {
            const stage = stages[i];
            if ((stage.number === INSTRUCTION_FETCH_STAGE_ID || stage.number === INSTRUCTION_DECODE_STAGE_ID) && hazard) continue;
            console.log('---------', i, stage.instructionAddress)
            if (stage.instructionAddress == null) continue;
            const instructionFromMemory = instructionMemory.find(el => el.address === stage.instructionAddress);
            console.log('---------', instructionFromMemory)
            if (instructionFromMemory == null) return;
            console.log(stage.number);
            if (stage.number === INSTRUCTION_FETCH_STAGE_ID) {
                console.log('a primeira vez eu chego aqui')
                setStagesData(data => data.map(el => {
                    if (el.code === 'if_id_pc') el.value = pc;
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
        toast(message, {
            position: 'top-center',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
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
         // quando vai ser?
         
        const newStages = [...stages];
        
        let pausa=false;
        for(let i = 2;i<=3;i++){
            const instructionFromMemoryI = instructionMemory.find(el => el.address === stages[i].instructionAddress);
            const instructionFromMemory1 = instructionMemory.find(el => el.address === stages[1].instructionAddress);
            if (!instructionFromMemoryI || !instructionFromMemory1) continue;
            if( (instructionFromMemoryI.regDest === instructionFromMemory1.reg1 || instructionFromMemoryI.regDest === instructionFromMemory1.reg2) && instructionFromMemoryI !== null ){
                console.log('pausa true')
                pausa=true;
            }
        }
        if(newStages[0].instructionAddress !== null && !pausa){
            setPc(pc + 4);
            pc_real=pc+4;
        }
        else{
            pc_real=pc;
        }
       
        setCiclos([...ciclos, JSON.parse(JSON.stringify(stagesData))]);
        if(!pausa){
            for (let i = newStages.length - 1; i > 0; i--) {
                newStages[i].instructionAddress = newStages[i - 1].instructionAddress;
            };

            newStages[0].instructionAddress = null;
            console.log('pc: ',pc_real)
            const nova_instrucao = instructionMemory.find( el=> el.address === pc_real )
            console.log('nova instrucao: ',nova_instrucao)
            if (nova_instrucao) {
                newStages[0].instructionAddress = nova_instrucao.address
            }
            setStages(newStages)
        }
        else {
            showErrorToast('Hazard detected, stages 1 and 2 have been frozen!');
            for (let i = newStages.length - 1; i > 2; i--) {
                newStages[i].instructionAddress = newStages[i - 1].instructionAddress;
            };
            newStages[2].instructionAddress = null;
            setStages(newStages);
        };
        console.log(newStages);
        executeNextInstructions(pausa);
    };

    useEffect(()=>{
        console.log(instructionToEnter);
    }, [instructionToEnter])

    return (<>
        <ToastError />
        <Grid container 
            sx={{
                backgroundColor: '#ffdb74',
                padding:'10px',
            }}
            spacing={2}
        >
            <Grid item xs={8}>
                <Grid container spacing={2}>
                    <Grid item xs={3} >
                        <Autocomplete
                            options={BASIC_INSTRUCTIONS}
                            getOptionLabel={(instruction) => instruction.name}
                            size='small'
                            fullWidth
                            renderInput={(params) => <TextField {...params} label="Instruction" />}
                            onChange={(_,newValue) =>{
                                setInstrucao(newValue ? newValue.name :null)
                                console.log(newValue);
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
                        <Form  instrucao={instrucao} instructionToEnter={instructionToEnter} setInstructionToEnter={setInstructionToEnter} />
                    </Grid>
                   
                    <Grid item xs={2}>
                        <Button 
                        onClick={()=> {
                            let ct=0;
                            if(instructionToEnter.instructionId===null)ct+=1
                            if(instructionToEnter.reg1===null)ct+=1
                            if(instructionToEnter.reg2===null)ct+=1
                            if(instructionToEnter.regDest===null)ct+=1
                            if(instructionToEnter.imm===null)ct+=1
                            if(ct>1){
                                showErrorToast('Please fill in all fields to add the instruction.');
                            }
                            else{
                                addInstruction(instructionToEnter)
                            }
                        }}
                         sx={{color:'black',border:'1px solid transparent',backgroundColor:'#e87624'}}
                         >
                            Adicionar
                        </Button>
                    </Grid>
                    <Grid item xs={2}>
                        <Button onClick={()=>handleNext()} sx={{color:'black',border:'1px solid transparent',backgroundColor:'#e87624'}}>Próximo</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', height: '18%', justifyContent: 'center',width:'400px',ml:38 }}>
                            {
                                stages.map((stage: IStage) => (
                                    <img src={getInstructionImage(stage)} style={{ maxWidth: '100%' }}/>
                                ))
                            }
                        </Box>
                    </Grid>

                </Grid>

            </Grid>
            <Grid item xs={4}>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 2 }}>
                    <PipeTable
                        firstColumn='Endereço'
                        secondColumn='Instrução'
                        rows={
                            instructionMemory.map(el => { return { code: String(el.address), value: el.syntax } })
                        }
                    />
                    <PipeTable
                        firstColumn='Endereço'
                        secondColumn='Conteúdo da Memória'
                        rows={
                            dataMemory.map(el => { return { code: String(el.address), value: el.value } })
                        } 
                    />
                    <PipeTable
                        firstColumn='Nome'
                        secondColumn='Conteúdo do Registrador'
                        rows={
                            registers.map(el => { return { code: String(el.name), value: el.value } })
                        } 
                    />
                </Box>         
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
            
            {/* <Grid item xs={12} >
                <Box sx={{ display: 'flex', height: '18%', overflow: 'auto', justifyContent: 'center' }}>
                    {
                        stages.map((stage: IStage) => (
                            <img src={getInstructionImage(stage)} style={{ maxWidth: '100%' }}/>
                        ))
                    }
                </Box>
            </Grid> */}
        
        </Grid>
    </>);
};

export default Datapath;