import * as vuex from 'vuex';
export declare const VuexHook: {
    MapUpdate: string;
};
export declare var exclude: string[];
export declare class VuexOptions {
    Request?: Request;
    name?: string;
    searchOnChange?: boolean;
}
export default function Vuex(options: VuexOptions): any;
export declare function await_action(name: string, method: string, data: any): any;
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
