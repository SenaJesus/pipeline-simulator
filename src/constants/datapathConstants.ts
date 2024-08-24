import { IInstruction, IStage, IDataMemory, IRegisterMemory } from '../interfaces/datapathInterfaces';
import Add from '../instructions/add';
import Lw from '../instructions/lw';
import Sw from '../instructions/sw';

export const INITIAL_REGISTERS: IRegisterMemory[] = [
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

export const BASIC_INSTRUCTIONS: IInstruction[] = [
    { id: 1, name: 'Add', fileName: 'add', dataPath: '/assets/datapath/add/', class: Add, getSyntax: (reg1: string | null, reg2: string | null, regDest: string | null, imm: number | null) => `ADD ${regDest} ${reg1} ${reg2}` },
    { id: 2, name: 'Load word', fileName: 'lw', dataPath: '/assets/datapath/lw/', class: Lw, getSyntax: (reg1: string | null, reg2: string | null, regDest: string | null, imm: number | null) => `LW ${regDest} ${reg1} ${imm}`},
    { id: 3, name: 'Store word', fileName: 'sw', dataPath: '/assets/datapath/sw/', class: Sw, getSyntax: (reg1: string | null, reg2: string | null, regDest: string | null, imm: number | null) => `SW ${reg2} ${reg1} ${imm}`}
];

export const INITIAL_STAGES: IStage[] = [
    { number: 1, instructionAddress: null },
    { number: 2, instructionAddress: null },
    { number: 3, instructionAddress: null },
    { number: 4, instructionAddress: null },
    { number: 5, instructionAddress: null }
];

export const INITIAL_DATA_MEMORY: IDataMemory[] = [
    { address: 0, value: 10 },
    { address: 10, value: 20 },
    { address: 20, value: 30 },
    { address: 30, value: 40 },
    { address: 40, value: 50 },
    { address: 50, value: 60 },
    { address: 60, value: 70 },
    { address: 70, value: 71 },
    { address: 80, value: 72 },
    { address: 90, value: 73 },
    { address: 100, value: 74 },
    { address: 110, value: 75 }
];

export const INITIAL_STAGES_DATA = [
    { code: 'if_id_pc', value: null },
    { code: 'if_id_ir', value: null },
    { code: 'id_ex_pc', value: null },
    { code: 'id_ex_a', value: null },
    { code: 'id_ex_b', value: null },
    { code: 'id_ex_imm', value: null },
    { code: 'id_ex_rd', value: null },
    { code: 'ex_mem_branch_target', value: null },
    { code: 'ex_mem_alu_output', value: null },
    { code: 'ex_mem_b', value: null },
    { code: 'ex_mem_rd', value: null },
    { code: 'ex_mem_zero', value: null },
    { code: 'mem_wb_lmd', value: null },
    { code: 'mem_wb_alu_output', value: null },
    { code: 'mem_wb_rd', value: null }
];

export const INSTRUCTION_FETCH_STAGE_ID =  1;
export const INSTRUCTION_DECODE_STAGE_ID = 2;
export const EXECUTION_STAGE_ID = 3;
export const MEMORY_STAGE_ID = 4;
export const WRITE_BACK_STAGE_ID = 5;