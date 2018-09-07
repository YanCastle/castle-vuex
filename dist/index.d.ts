export interface Request {
    search(Where?: SearchWhere): Promise<SearchResult>;
    add(Data: Object): Promise<Object>;
    save(Data: Object): Promise<Object>;
    del(Data: Object): Promise<Object>;
    adds(Data: Object): Promise<Object>;
}
export declare class VuexOptions {
    Request?: Request;
    name?: string;
    searchOnChange?: boolean;
}
export default function Vuex(options: VuexOptions): any;
export declare function store(vue: any, modules: any): import("vuex").Store<{}>;
export declare class SearchWhere {
    Keyword: string;
    P: number;
    N: number;
    Sort: string;
    W: {
        [index: string]: any;
    };
}
export declare class SearchResult {
    L: any[];
    P: number;
    N: number;
    T: number;
    R?: any;
}
export declare class ActionParams {
    Success: Function;
    Error: Function;
    Data: Object;
}
export declare class VuexStore {
    Result: SearchResult;
    Where: SearchWhere;
    __option: VuexOptions;
    A_SEARCH(context: any, data?: ActionParams): void;
    A_ADD(context: any, data: ActionParams): void;
    A_SAVE(context: any, data: ActionParams): void;
    A_DEL(context: any, data: ActionParams): void;
    G_RESULT(state: any): any;
    G_WHERE(state: any): any;
    M_WHERE(state: VuexStore, payload: SearchWhere): void;
    M_WHERE_W(state: VuexStore, payload: any): void;
    M_WHERE_P(state: VuexStore, p: number): void;
    M_WHERE_N(state: VuexStore, n: number): void;
    M_WHERE_KEYWORD(state: VuexStore, keyword: string): void;
    M_WHERE_SORT(state: VuexStore, sort: string): void;
    M_RESULT(state: VuexStore, rs: SearchResult): void;
}
