import { Dispatch, SetStateAction } from "react";

export interface IValue {
    code: string;
    value: number | null | string;
};

export interface IInstructionMemoryTableProps {
    firstColumn: string;
    secondColumn: string;
    rows: IValue[];
    programCounter: number | undefined;
};

export interface IEditTableProps {
    firstColumn: string;
    secondColumn: string;
    rows: IValue[];
    setter: Dispatch<SetStateAction<any>>;
    isNumber: boolean;
};