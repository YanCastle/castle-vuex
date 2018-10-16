import * as vuex from 'vuex'
/**
 * 请求库
 */
export interface Request {
    search(Where?:SearchWhere):Promise < SearchResult > , 
    add(Data:Object):Promise < Object > 
    save(pk:any, Data:Object):Promise < Object > 
    del(pk:any):Promise < Object > 
    adds(Data:Object):Promise < Object > 
    delW(W:Object):Promise < any > 
    _pk:string
}
/**
 * Vuex配置
 */
export class VuexOptions {
    /**
     * 请求库
     */
    Request?:Request
    /**
     * module名称，自动追加
     */
    name?:string = ''
    /**
     * 数据变更的时候发起查询
     */
    searchOnChange?:boolean = true
}
export default function Vuex(options:VuexOptions):any {
    return function (store) {
        return vuexFactory(store, options)
    }
}
const classes =  {}; 
function vuexFactory(store, option) {
    if (option === void 0) {
        option =  {}
    }

    option = Object.assign(option, new VuexOptions)

    let name:string = store.name; 
    var sclass = new store()
    if ( ! classes[name])
        classes[name] = sclass
    else {
        console.error('VuexStore:重复的VuexStore定义' + name)
    }
    sclass.__option = option
    sclass.__option.name = name.toUpperCase()
    var s =  {
        state: {}, 
        getters: {}, 
        actions: {}, 
        mutations: {}
    }

    var superProto = Object.getPrototypeOf(store.prototype)
    if (superProto instanceof VuexStore) {
        //需要控制继承关系
    }
    Object.keys(sclass).forEach((k) =>  {
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
            }else {
                console.error('Vuex方法名称不符合规范:' + name + '.' + k)
            }
        }else {
            if (k.substr(0, 2) !== '__')
                s.state[k] = sclass[k]
        }
    })
    let methods = [...Object.getOwnPropertyNames(Object.getPrototypeOf(store.prototype)), ...Object.getOwnPropertyNames(store.prototype)]
    methods.forEach(k =>  {
        if (/^([AGM])_([A-Z_\d]{1,})$/.test(k)) {
            let ks = k.replace(/^([AGM])_/, '$1_' + name.toUpperCase() + '_')
            switch (k.substr(0, 2)) {
                case 'G_':
                    s.getters[ks] = function (state) {
                        return sclass[k].apply(sclass, [state])
                    }
                    break; 
                case 'A_':
                    s.actions[ks] = function (state, data) {
                        return sclass[k].apply(sclass, [state, data])
                    }
                    break; 
                case 'M_':
                    s.mutations[ks] = function (state, payload) {
                        return sclass[k].apply(sclass, [state, payload])
                    }
                    break; 
            }
        }else {
            if (['constructor'].indexOf(k) === -1)
                console.error('Vuex方法名称不符合规范:' + name + '.' + k)
        }
    })
    return s; 
}
/**
 * 
 * @param vue 
 * @param modules 
 */
export function store(vue, modules) {
    vue.use(vuex)
    return new vuex.Store( {
        getters: {}, 
        actions: {}, 
        modules:modules
    })
}
/**
 * 查询条件
 */
export class SearchWhere {
    Keyword:string = ''
    P:number = 1
    N:number = 10
    Sort:string = ''
    W: {[index:string]:any } =  {}
}
/**
 * 查询结果
 */
export class SearchResult {
    L:any[] = []
    P:number = 0
    N:number = 0
    T:number = 0
    R?:any =  {}
}
/**
 * 
 */
export class ActionParams {
    Success:Function
    Error:Function
    Data:Object
}
function action_success(data:ActionParams, result:any) {
    if (data && data.Success instanceof Function) {
        data.Success(result)
    }
}
function action_error(data:ActionParams, result:any) {
    if (data && data.Error instanceof Function) {
        data.Error(result)
    }
}
/**
 * VuexStore类
 */
export class VuexStore {
    Result:SearchResult = new SearchResult()
    Where:SearchWhere = new SearchWhere()
    __option:VuexOptions; 
    A_SEARCH(context:any, data?:ActionParams) {
        if (this.__option.Request && this.__option.Request.search) {
            this.__option.Request.search(context.state.Where).then((rs) =>  {
                if (this.__option.searchOnChange !== false)
                    context.commit('M_' + this.__option.name + '_RESULT', rs)
                action_success(data, rs)
            }).catch((e) =>  {
                action_error(data, e)
            })
        }
    }
    A_ADD(context:any, data:ActionParams) {
        if (this.__option.Request && this.__option.Request.add) {
            this.__option.Request.add(data.Data).then((rs) =>  {
                if (this.__option.searchOnChange !== false)
                    context.dispatch('A_' + this.__option.name + '_SEARCH', rs)
                action_success(data, rs)
            }).catch((e) =>  {
                action_error(data, e)
            })
        }
    }
    A_SAVE(context:any, data:ActionParams) {
        if (this.__option.Request && this.__option.Request.save) {
            this.__option.Request.save(data.Data[this.__option.Request._pk], data.Data).then((rs) =>  {
                if (this.__option.searchOnChange !== false)
                    context.dispatch('A_' + this.__option.name + '_SEARCH', rs)
                action_success(data, rs)
            }).catch((e) =>  {
                action_error(data, e)
            })
        }
    }
    A_DEL(context:any, data:ActionParams) {
        if (this.__option.Request && this.__option.Request.del) {
            this.__option.Request.del(data.Data[this.__option.Request._pk]).then((rs) =>  {
                if (this.__option.searchOnChange !== false)
                    context.dispatch('A_' + this.__option.name + '_SEARCH', rs)
                action_success(data, rs)
            }).catch((e) =>  {
                action_error(data, e)
            })
        }
    }
    A_DEL_W(context:any, data:any) {
        if (this.__option.Request && this.__option.Request.delW) {
            this.__option.Request.delW({W:data.Data}).then((rs)=>{
                if (this.__option.searchOnChange !== false){
                    context.state.Where.W={}
                    context.dispatch('A_' + this.__option.name + '_SEARCH', context.state.Where);
                }
                action_success(data, rs);
            }).catch((e) => {
                action_error(data, e);
            });
        }
    }
    G_RESULT(state:any) {
        return state.Result; 
    }
    G_WHERE(state:any) {
        return state.Where; 
    }
    M_WHERE(state:VuexStore, payload:SearchWhere) {
        state.Where = payload; 
    }
    M_WHERE_W(state:VuexStore, payload:any) {
        state.Where.W = payload; 
    }
    M_WHERE_P(state:VuexStore, p:number) {
        state.Where.P = p; 
    }
    M_WHERE_N(state:VuexStore, n:number) {
        state.Where.N = n; 
    }
    M_WHERE_KEYWORD(state:VuexStore, keyword:string) {
        state.Where.Keyword = keyword
    }
    M_WHERE_SORT(state:VuexStore, sort:string) {
        state.Where.Sort = sort
    }
    M_RESULT(state:VuexStore, rs:SearchResult) {
        state.Result = rs; 
    }
}