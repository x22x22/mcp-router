export interface TableSchema {
    columns: string;
    indexes?: string[];
}
export interface DatabaseTableSchema {
    createSQL: string;
    indexes?: string[];
}
export interface Migration {
    id: string;
    description: string;
    execute: (db: any) => void;
}
//# sourceMappingURL=index.d.ts.map