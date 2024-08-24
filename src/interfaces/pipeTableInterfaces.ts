export interface IValue {
    code: string;
    value: number | null | string;
};

export interface IPipeTableProps {
    firstColumn: string;
    secondColumn: string;
    rows: IValue[];
};