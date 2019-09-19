import * as vuex from 'vuex';
export declare var exclude: string[];
export interface Request {
    search(Where?: SearchWhere): Promise<SearchResult>;
    add(Data: Object): Promise<Object>;
    save(pk: any, Data: Object): Promise<Object>;
    del(pk: any): Promise<Object>;
    adds(Data: Object): Promise<Object>;
    delW(W: Object): Promise<any>;
    pk: string;
}
export declare class VuexOptions {
    Request?: Request;
    name?: string;
    searchOnChange?: boolean;
}
export default function Vuex(options: VuexOptions): any;
export declare function await_action(name: string, method: string, data: any): Promise<unknown>;
export declare const MapReaderCache: {
    [index: string]: any[];
};
export declare function map_read(name: string, pkey: number | string): any;
export declare function store(modules: any): vuex.Store<any>;
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
    s: Function;
    e: Function;
    Data: Object;
}
export declare function action_success(data: ActionParams, result: any): void;
export declare function action_error(data: ActionParams, result: any): void;
export declare class VuexStore {
    Result: SearchResult;
    Where: SearchWhere;
    AllResult: SearchResult;
    AllowAll: boolean;
    ClassName: string;
    Maps: {
        [index: string]: any;
    };
    __option: VuexOptions;
    A_ALL(ctx: any): void;
    A_SEARCH(context: any, data?: ActionParams): Promise<SearchResult>;
    A_ADD(context: any, data: ActionParams): Promise<Object>;
    A_SAVE(context: any, data: ActionParams): Promise<Object>;
    A_DEL(context: any, data: ActionParams): Promise<Object>;
    A_DEL_W(context: any, data: ActionParams): Promise<any>;
    G_RESULT(state: any): any;
    G_WHERE(state: any): any;
    G_ALL(state: any, store: any): any;
    M_ALL(state: VuexStore, payload: SearchResult): void;
    M_WHERE(state: VuexStore, payload: SearchWhere): void;
    M_MAPS(state: VuexStore, payload: SearchResult): void;
    M_WHERE_W(state: VuexStore, payload: any): void;
    M_WHERE_P(state: VuexStore, p: number): void;
    M_WHERE_N(state: VuexStore, n: number): void;
    M_WHERE_KEYWORD(state: VuexStore, keyword: string): void;
    M_WHERE_SORT(state: VuexStore, sort: string): void;
    M_RESULT(state: VuexStore, rs: SearchResult): void;
}
