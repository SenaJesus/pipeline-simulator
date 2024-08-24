export interface IInstruction {
    id: number;
    name: string;
    fileName: string;
    dataPath: string;
    class: any;
    getSyntax: (reg1: string | null, reg2: string | null, regDest: string | null, imm: number | null) => string;
};

export interface IStage {
    number: number;
    instructionAddress: number | null;
};

export interface IInstructionMemory {
    address: number;
    instruction: IInstruction;
    syntax: string;
    reg1: string | null;
    reg2: string | null;
    regDest: string | null;
    imm: number | null;
};

export interface IDataMemory {
    address: number;
    value: number | null;
};

export interface IRegisterMemory {
    name: string;
    value: number | null;
};

export interface IStageData {
    code: string;
    value: string | number | null;
};

export interface IAddInstruction {
    instructionId: number,
    reg1: string | null,
    reg2: string | null,
    regDest: string | null,
    imm: number | null
};