import { Dispatch, SetStateAction } from 'react';
import { IRegisterMemory, IStageData, IDataMemory } from '../interfaces/datapathInterfaces';
import {
    INSTRUCTION_DECODE_STAGE_ID,
    EXECUTION_STAGE_ID,
    MEMORY_STAGE_ID,
    WRITE_BACK_STAGE_ID
} from '../constants/datapathConstants';

const Lw =
{
    IdToEx: (
        stagesData: IStageData[],
        setStagesData: Dispatch<SetStateAction<IStageData[]>>,
        registers: IRegisterMemory[],
        reg1: string,
        imm: number,
        regDest: string
    ) => {
        const if_id_pc = stagesData.find(el => el.code === 'if_id_pc')?.value;
        const reg1Value = registers.find(el => el.name === reg1)?.value;
        if (if_id_pc === undefined || reg1Value === undefined) return;
        setStagesData(data =>
            data.map(el => {
                if (el.code === 'id_ex_pc') el.value = if_id_pc;
                if (el.code === 'id_ex_a') el.value = reg1Value;
                if (el.code === 'id_ex_b') el.value = null;
                if (el.code === 'id_ex_imm') el.value = imm;
                if (el.code === 'id_ex_rd') el.value = regDest;
                return el;
            })
        );
    },
    ExToMem: (
        stagesData: IStageData[],
        setStagesData: Dispatch<SetStateAction<IStageData[]>>
    ) => {
        const id_ex_imm = stagesData.find(el => el.code === 'id_ex_imm')?.value;
        const id_ex_a = stagesData.find(el => el.code === 'id_ex_a')?.value;
        const id_ex_b = stagesData.find(el => el.code === 'id_ex_b')?.value;
        const id_ex_rd = stagesData.find(el => el.code === 'id_ex_rd')?.value;
        if (id_ex_imm === undefined || id_ex_a === undefined || id_ex_b === undefined || id_ex_rd === undefined) return;
        setStagesData(data =>
            data.map(el => {
                if (el.code === 'ex_mem_branch_target') el.value = null;
                if (el.code === 'ex_mem_alu_output') el.value = (id_ex_a === null || id_ex_imm === null) ? null : Number(id_ex_a) + Number(id_ex_imm);
                if (el.code === 'ex_mem_b') el.value = id_ex_b;
                if (el.code === 'ex_mem_rd') el.value = id_ex_rd;
                if (el.code === 'ex_mem_zero') el.value = null;
                return el;
            })
        );
    },
    MemToWb: (
        stagesData: IStageData[],
        setStagesData: Dispatch<SetStateAction<IStageData[]>>,
        dataMemory: IDataMemory[],
        setRegisters: Dispatch<SetStateAction<IRegisterMemory[]>>
    ) => {
        const ex_mem_rd = stagesData.find(el => el.code === 'ex_mem_rd')?.value;
        const ex_mem_alu_output = stagesData.find(el => el.code === 'ex_mem_alu_output')?.value;
        if (ex_mem_rd === undefined || ex_mem_alu_output === undefined) return;
        const memoryData = dataMemory.find(el => el.address === ex_mem_alu_output)?.value;
        if (memoryData === undefined) return;
        setStagesData(data =>
            data.map(el => {
                if (el.code === 'mem_wb_lmd') el.value = memoryData;
                if (el.code === 'mem_wb_alu_output') el.value = null;
                if (el.code === 'mem_wb_rd') el.value = ex_mem_rd;
                return el;
            })
        );
        setRegisters(data =>
            data.map(el => {
                if (el.name === ex_mem_rd) el.value = Number(memoryData);
                return el;
            })
        );
    },
    Execute: (
        stageNumber: number,
        stagesData: IStageData[],
        setStagesData: Dispatch<SetStateAction<IStageData[]>>,
        registers: IRegisterMemory[],
        setRegisters: Dispatch<SetStateAction<IRegisterMemory[]>>,
        dataMemory: IDataMemory[],
        setDataMemory: Dispatch<SetStateAction<IDataMemory[]>>,
        reg1: string,
        reg2: string,
        regDest: string,
        imm: number
    ) => {
        if (stageNumber === INSTRUCTION_DECODE_STAGE_ID) {
            Lw.IdToEx(
                stagesData,
                setStagesData,
                registers,
                reg1,
                imm,
                regDest
            );
        };
        if (stageNumber === EXECUTION_STAGE_ID) {
            Lw.ExToMem(
                stagesData,
                setStagesData
            );
        }
        if (stageNumber === MEMORY_STAGE_ID) {
            Lw.MemToWb(
                stagesData,
                setStagesData,
                dataMemory,
                setRegisters
            );
        };
    }
};

export default Lw;