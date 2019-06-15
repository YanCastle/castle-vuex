"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vuex = require("vuex");
const vue = require("vue");
exports.exclude = [
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
];
class VuexOptions {
    constructor() {
        this.name = '';
        this.searchOnChange = true;
    }
}
exports.VuexOptions = VuexOptions;
function Vuex(options) {
    return function (store) {
        return vuexFactory(store, options);
    };
}
exports.default = Vuex;
const classes = {};
function vuexFactory(store, option) {
    if (option === void 0) {
        option = {};
    }
    option = Object.assign(option, new VuexOptions);
    var sclass = new store();
    let name = sclass.ClassName;
    if (!classes[name])
        classes[name] = sclass;
    else {
        console.error('VuexStore:重复的VuexStore定义' + name);
    }
    sclass.__option = option;
    sclass.__option.name = sclass.ClassName || sclass.constructor.name;
    name = sclass.ClassName || sclass.constructor.name;
    var s = {
        state: {},
        getters: {},
        actions: {},
        mutations: {}
    };
    var superProto = Object.getPrototypeOf(store.prototype);
    if (superProto instanceof VuexStore) {
    }
    Object.keys(sclass).forEach((k) => {
        if (typeof sclass[k] == 'function') {
            if (/^([AGM])_([A-Z_\d]{1,})$/.test(k)) {
                let ks = k.replace(/^([AGM])_/, '$1_' + name.toUpperCase() + '_');
                switch (k.substr(0, 2)) {
                    case 'G_':
                        s.getters[ks] = sclass[k];
                        break;
                    case 'A_':
                        s.actions[ks] = sclass[k];
                        break;
                    case 'M_':
                        s.mutations[ks] = sclass[k];
                        break;
                }
            }
            else {
            }
        }
        else {
            if (k.substr(0, 2) !== '__')
                s.state[k] = sclass[k];
        }
    });
    let methods = [...Object.getOwnPropertyNames(Object.getPrototypeOf(store.prototype)), ...Object.getOwnPropertyNames(store.prototype)];
    methods.forEach(k => {
        if (/^([AGM])_([A-Z_\d]{1,})$/.test(k)) {
            let ks = k.replace(/^([AGM])_/, '$1_' + name.toUpperCase() + '_');
            switch (k.substr(0, 2)) {
                case 'G_':
                    s.getters[ks] = function (state) {
                        return sclass[k].apply(sclass, [state]);
                    };
                    break;
                case 'A_':
                    s.actions[ks] = function (state, data) {
                        return sclass[k].apply(sclass, [state, data]);
                    };
                    break;
                case 'M_':
                    s.mutations[ks] = function (state, payload) {
                        return sclass[k].apply(sclass, [state, payload]);
                    };
                    break;
            }
        }
        else {
            if (exports.exclude.indexOf(k) === -1)
                console.error('Vuex方法名称不符合规范:' + name + '.' + k);
        }
    });
    return s;
}
function store(modules) {
    vue.use(vuex);
    return new vuex.Store({
        getters: {},
        actions: {},
        modules: modules
    });
}
exports.store = store;
class SearchWhere {
    constructor() {
        this.Keyword = '';
        this.P = 1;
        this.N = 10;
        this.Sort = '';
        this.W = {};
    }
}
exports.SearchWhere = SearchWhere;
class SearchResult {
    constructor() {
        this.L = [];
        this.P = 0;
        this.N = 0;
        this.T = 0;
        this.R = {};
    }
}
exports.SearchResult = SearchResult;
class ActionParams {
}
exports.ActionParams = ActionParams;
function action_success(data, result) {
    if (data && data.Success instanceof Function) {
        data.Success(result);
    }
}
exports.action_success = action_success;
function action_error(data, result) {
    if (data && data.Error instanceof Function) {
        data.Error(result);
    }
}
exports.action_error = action_error;
class VuexStore {
    constructor() {
        this.Result = new SearchResult();
        this.Where = new SearchWhere();
        this.ClassName = "";
    }
    A_SEARCH(context, data) {
        if (this.__option.Request && this.__option.Request.search) {
            this.__option.Request.search(context.state.Where).then((rs) => {
                if (this.__option.searchOnChange !== false)
                    context.commit('M_' + this.__option.name.toLocaleUpperCase() + '_RESULT', rs);
                action_success(data, rs);
            }).catch((e) => {
                action_error(data, e);
            });
        }
    }
    A_ADD(context, data) {
        if (this.__option.Request && this.__option.Request.add) {
            this.__option.Request.add(data.Data).then((rs) => {
                if (this.__option.searchOnChange !== false)
                    context.dispatch('A_' + this.__option.name.toLocaleUpperCase() + '_SEARCH', rs);
                action_success(data, rs);
            }).catch((e) => {
                action_error(data, e);
            });
        }
    }
    A_SAVE(context, data) {
        if (this.__option.Request && this.__option.Request.save) {
            this.__option.Request.save(data.Data[this.__option.Request.pk], data.Data).then((rs) => {
                if (this.__option.searchOnChange !== false)
                    context.dispatch('A_' + this.__option.name.toLocaleUpperCase() + '_SEARCH', rs);
                action_success(data, rs);
            }).catch((e) => {
                action_error(data, e);
            });
        }
    }
    A_DEL(context, data) {
        if (this.__option.Request && this.__option.Request.del) {
            this.__option.Request.del(data.Data[this.__option.Request.pk]).then((rs) => {
                if (this.__option.searchOnChange !== false)
                    context.dispatch('A_' + this.__option.name.toLocaleUpperCase() + '_SEARCH', rs);
                action_success(data, rs);
            }).catch((e) => {
                action_error(data, e);
            });
        }
    }
    A_DEL_W(context, data) {
        if (this.__option.Request && this.__option.Request.delW) {
            this.__option.Request.delW({ W: data.Data }).then((rs) => {
                if (this.__option.searchOnChange !== false) {
                    context.state.Where.W = {};
                    context.dispatch('A_' + this.__option.name.toLocaleUpperCase() + '_SEARCH', context.state.Where);
                }
                action_success(data, rs);
            }).catch((e) => {
                action_error(data, e);
            });
        }
    }
    G_RESULT(state) {
        return state.Result;
    }
    G_WHERE(state) {
        return state.Where;
    }
    M_WHERE(state, payload) {
        state.Where = payload;
    }
    M_WHERE_W(state, payload) {
        state.Where.W = payload;
    }
    M_WHERE_P(state, p) {
        state.Where.P = p;
    }
    M_WHERE_N(state, n) {
        state.Where.N = n;
    }
    M_WHERE_KEYWORD(state, keyword) {
        state.Where.Keyword = keyword;
    }
    M_WHERE_SORT(state, sort) {
        state.Where.Sort = sort;
    }
    M_RESULT(state, rs) {
        state.Result = rs;
    }
}
exports.VuexStore = VuexStore;
//# sourceMappingURL=index.js.map