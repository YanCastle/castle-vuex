import * as vuex from 'vuex'
import { delay_cb } from 'castle-function';
import hook, { HookWhen } from '@ctsy/hook';
const vue: any = require('vue')

var Store: vuex.Store<any> | any;

export const VuexHook = {
    MapUpdate: 'MapUpdate',
}
/**
 * 排除这些属性和方法
 */
export var exclude = [
    '__defineGetter__',
    '__defineSetter__',
    'hasOwnProperty',
    '__lookupGetter__',
    '__lookupSetter__',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toString',
    'valueOf',
    '__proto__',
    'toLocaleString',
    'constructor'
]
/**
 * 请求库
 */
export interface Request {
    search(Where?: SearchWhere): Promise<SearchResult>,
    add(Data: Object): Promise<Object>
    save(pk: any, Data: Object): Promise<Object>
    del(pk: any): Promise<Object>
    adds(Data: Object): Promise<Object>
    delW(W: Object): Promise<any>
    pk: string,
}
/**
 * Vuex配置
 */
export class VuexOptions {
    /**
     * 请求库
     */
    Request?: Request
    /**
     * module名称，自动追加
     */
    name?: string = ''
    /**
     * 数据变更的时候发起查询
     */
    searchOnChange?: boolean = true
}
export default function Vuex(options: VuexOptions): any {
    return function (store) {
        return vuexFactory(store, options)
    }
}
const classes = {};
function vuexFactory(store, option) {
    if (option === void 0) {
        option = {}
    }

    option = Object.assign(option, new VuexOptions)
    var sclass = new store()
    let name: string = sclass.ClassName;
    if (!classes[name])
        classes[name] = sclass
    else {
        console.error('VuexStore:重复的VuexStore定义' + name)
    }
    sclass.__option = option
    sclass.__option.name = sclass.ClassName || sclass.constructor.name
    name = sclass.ClassName || sclass.constructor.name
    var s = {
        state: {
            __option: option
        },
        getters: {},
        actions: {},
        mutations: {}
    }

    var superProto = Object.getPrototypeOf(store.prototype)
    if (superProto instanceof VuexStore) {
        //需要控制继承关系
    }
    Object.keys(sclass).forEach((k) => {
        if (typeof sclass[k] == 'function') {
            if (/^([AGM])_([A-Z_\d]{1,})$/.test(k)) {
                let ks = k.replace(/^([AGM])_/, '$1_' + name.toUpperCase() + '_')
                switch (k.substr(0, 2)) {
                    case 'G_':
                        s.getters[ks] = sclass[k]
                        break;
                    case 'A_':
                        s.actions[ks] = sclass[k]
                        break;
                    case 'M_':
                        s.mutations[ks] = sclass[k]
                        break;
                }
            } else {
                // console.error('Vuex方法名称不符合规范:' + name + '.' + k)
            }
        } else {
            if (k.substr(0, 2) !== '__')
                s.state[k] = sclass[k]
        }
    })
    let methods = [...Object.getOwnPropertyNames(Object.getPrototypeOf(store.prototype)), ...Object.getOwnPropertyNames(store.prototype)]
    methods.forEach(k => {
        if (/^([AGM])_([A-Z_\d]{1,})$/.test(k)) {
            let ks = k.replace(/^([AGM])_/, '$1_' + name.toUpperCase() + '_')
            switch (k.substr(0, 2)) {
                case 'G_':
                    s.getters[ks] = function (state) {
                        return sclass[k].apply(sclass, [state, s])
                    }
                    break;
                case 'A_':
                    s.actions[ks] = async function (state, data) {
                        try {
                            let rs = await sclass[k].apply(sclass, [state, data, s])
                            if (data.s instanceof Function) {
                                data.s(rs);
                            }
                            return rs;
                        } catch (error) {
                            if (data.e instanceof Function) {
                                data.e(error);
                            }
                        }
                    }
                    break;
                case 'M_':
                    s.mutations[ks] = function (state, payload) {
                        return sclass[k].apply(sclass, [state, payload, s])
                    }
                    break;
            }
        } else {
            if (exclude.indexOf(k) === -1)
                console.error('Vuex方法名称不符合规范:' + name + '.' + k)
        }
    })
    return s;
}
/**
 * 同步等待执行action方法
 * @param name 
 * @param method 
 * @param data 
 */
export function await_action(name: string, method: string, data: any) {
    let a = ['A', name.toUpperCase(), method.toUpperCase()].join('_');
    if (!Store._actions[a]) {
        throw new Error('Account Not Found:' + a)
        return;
    }
    return new Promise((s, e) => {
        // data.s = s; data.e = j;
        Store.dispatch(a, {
            Data: data,
            s, e
        });
    })
}
export const MapReaderCache: { [index: string]: any[] } = {

}
/**
 * 关联读取
 * @param name 
 * @param pkey 
 */
export function map_read(name: string, pkey: number | string) {
    if (!Store.state[name]) {
        throw new Error('Store State Not Found:' + name);
    }
    if (!(Store.state[name].__option && Store.state[name].__option.Request && Store.state[name].__option.Request.pk)) {
        throw new Error('Store Options pk Not Defined:' + name)
    }
    if (Store.state[name].Maps[pkey]) {
        return Store.state[name].Maps[pkey];
    } else {
        if (!MapReaderCache[name]) {
            MapReaderCache[name] = [];
        }
        MapReaderCache[name].push(pkey);
        delay_cb('map_' + name, (20), () => {
            Store.state[name].__option.Request.search({ [Store.state[name].__option.Request.pk]: { in: MapReaderCache[name] } }, { P: 1, N: MapReaderCache[name].length }).then((rs) => {
                Store.commit(['M', name, 'MAPS'].join('_').toUpperCase(), rs);
            })
            MapReaderCache[name] = [];
        })
        return '加载中'
    }
}
/**
 * store方法
 * @param vue 
 * @param modules 
 */
export function store(modules): vuex.Store<any> {
    vue.use(vuex)
    Store = new vuex.Store({
        getters: {},
        actions: {},
        modules: modules
    })
    return Store;
}
/**
 * 查询条件
 */
export class SearchWhere {
    Keyword: string = ''
    P: number = 1
    N: number = 10
    Sort: string = ''
    W: { [index: string]: any } = {}
}
/**
 * 查询结果
 */
export class SearchResult {
    L: any[] = []
    P: number = 0
    N: number = 0
    T: number = 0
    R?: any = {}
}
/**
 * 
 */
export class ActionParams {
    s: Function
    e: Function
    Data: Object
}
export function action_success(data: ActionParams, result: any) {
    if (data && data.s instanceof Function) {
        data.s(result)
    }
}
export function action_error(data: ActionParams, result: any) {
    if (data && data.e instanceof Function) {
        data.e(result)
    }
}
/**
 * VuexStore类
 */
export class VuexStore {
    Result: SearchResult = new SearchResult()
    Where: SearchWhere = new SearchWhere()
    AllResult: SearchResult = new SearchResult();
    AllowAll: boolean = false;
    ClassName: string = "";
    Maps: { [index: string]: any } = {};
    __option: VuexOptions;
    A_ALL(ctx: any) {
        if (this.AllowAll) {
            this.__option.Request.search({ N: 999999, P: 1, Keyword: '', W: {}, Sort: '' }).then((rs) => {
                ctx.commit('M_' + this.__option.name.toLocaleUpperCase() + '_ALL', rs)
            })
        }
    }
    A_SEARCH(context: any, data?: ActionParams) {
        if (this.__option.Request && this.__option.Request.search) {
            return this.__option.Request.search(data.Data || context.state.Where).then((rs) => {
                if (this.__option.searchOnChange !== false)
                    context.commit('M_' + this.__option.name.toLocaleUpperCase() + '_RESULT', rs)
                // action_success(data, rs)
                return rs;
            })
        }
    }
    A_ADD(context: any, data: ActionParams) {
        if (this.__option.Request && this.__option.Request.add) {
            return this.__option.Request.add(data.Data).then((rs) => {
                if (this.__option.searchOnChange !== false)
                    context.dispatch('A_' + this.__option.name.toLocaleUpperCase() + '_SEARCH', rs)
                // action_success(data, rs)
                return rs;
            })
        }
    }
    A_SAVE(context: any, data: ActionParams) {
        if (this.__option.Request && this.__option.Request.save) {
            return this.__option.Request.save(data.Data[this.__option.Request.pk], data.Data).then((rs) => {
                if (this.__option.searchOnChange !== false)
                    context.dispatch('A_' + this.__option.name.toLocaleUpperCase() + '_SEARCH', rs)
                // action_success(data, rs)
                return rs;
            })
        }
    }
    A_DEL(context: any, data: ActionParams) {
        if (this.__option.Request && this.__option.Request.del) {
            return this.__option.Request.del(data.Data[this.__option.Request.pk]).then((rs) => {
                if (this.__option.searchOnChange !== false)
                    context.dispatch('A_' + this.__option.name.toLocaleUpperCase() + '_SEARCH', rs)
                // action_success(data, rs)
                return rs;
            })
        }
    }
    A_DEL_W(context: any, data: ActionParams) {
        if (this.__option.Request && this.__option.Request.delW) {
            return this.__option.Request.delW({ W: data.Data }).then((rs) => {
                if (this.__option.searchOnChange !== false) {
                    context.state.Where.W = {}
                    context.dispatch('A_' + this.__option.name.toLocaleUpperCase() + '_SEARCH', context.state.Where);
                }
                return rs;
            })
        }
    }
    G_RESULT(state: any) {
        return state.Result;
    }
    G_WHERE(state: any) {
        return state.Where;
    }
    G_ALL(state: any, store: any) {
        if (state.AllResult.T <= 0) {
            Store.dispatch(['A', state.ClassName.toUpperCase(), 'ALL'].join('_'), {})
        }
        return state.AllResult;
    }
    M_ALL(state: VuexStore, payload: SearchResult) {
        state.AllResult = payload;
    }
    M_WHERE(state: VuexStore, payload: SearchWhere) {
        state.Where = payload;
    }
    M_MAPS(state: VuexStore, payload: SearchResult) {
        if (payload.L && payload.L.length > 0) {
            for (let x of payload.L) {
                state.Maps[x[this.__option.Request.pk]] = x;
            }
            hook.emit(VuexHook.MapUpdate, HookWhen.After, state, payload);
        }
    }
    M_WHERE_W(state: VuexStore, payload: any) {
        state.Where.W = payload;
    }
    M_WHERE_P(state: VuexStore, p: number) {
        state.Where.P = p;
    }
    M_WHERE_N(state: VuexStore, n: number) {
        state.Where.N = n;
    }
    M_WHERE_KEYWORD(state: VuexStore, keyword: string) {
        state.Where.Keyword = keyword
    }
    M_WHERE_SORT(state: VuexStore, sort: string) {
        state.Where.Sort = sort
    }
    M_RESULT(state: VuexStore, rs: SearchResult) {
        state.Result = rs;
    }
}
