"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vuex = require("vuex");
var castle_function_1 = require("castle-function");
var vue = require('vue');
var Store;
exports.VuexHook = {
    MapUpdate: 'MapUpdate',
};
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
var VuexOptions = (function () {
    function VuexOptions() {
        this.name = '';
        this.searchOnChange = true;
    }
    return VuexOptions;
}());
exports.VuexOptions = VuexOptions;
function Vuex(options) {
    return function (store) {
        return vuexFactory(store, options);
    };
}
exports.default = Vuex;
var classes = {};
function vuexFactory(store, option) {
    if (option === void 0) {
        option = {};
    }
    option = Object.assign(option, new VuexOptions);
    var sclass = new store();
    var name = sclass.ClassName;
    if (!classes[name])
        classes[name] = sclass;
    else {
        console.error('VuexStore:重复的VuexStore定义' + name);
    }
    sclass.__option = option;
    sclass.__option.name = sclass.ClassName || sclass.constructor.name;
    name = sclass.ClassName || sclass.constructor.name;
    var s = {
        state: {
            __option: option
        },
        getters: {},
        actions: {},
        mutations: {}
    };
    var superProto = Object.getPrototypeOf(store.prototype);
    Object.keys(sclass).forEach(function (k) {
        if (typeof sclass[k] == 'function') {
            if (/^([AGM])_([A-Z_\d]{1,})$/.test(k)) {
                var ks = k.replace(/^([AGM])_/, '$1_' + name.toUpperCase() + '_');
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
    var methods = __spreadArrays(Object.getOwnPropertyNames(Object.getPrototypeOf(store.prototype)), Object.getOwnPropertyNames(store.prototype));
    methods.forEach(function (k) {
        if (/^([AGM])_([A-Z_\d]{1,})$/.test(k)) {
            var ks = k.replace(/^([AGM])_/, '$1_' + name.toUpperCase() + '_');
            switch (k.substr(0, 2)) {
                case 'G_':
                    s.getters[ks] = function (state) {
                        return sclass[k].apply(sclass, [state, s]);
                    };
                    break;
                case 'A_':
                    s.actions[ks] = function (state, data) {
                        return sclass[k].apply(sclass, [state, data, s]);
                    };
                    break;
                case 'M_':
                    s.mutations[ks] = function (state, payload) {
                        return sclass[k].apply(sclass, [state, payload, s]);
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
function await_action(name, method, data) {
    var a = ['A', name.toUpperCase(), method.toUpperCase()].join('_');
    if (!Store._actions[a]) {
        throw new Error('Action Not Found:' + a);
        return;
    }
    return Store.dispatch(a, data);
}
exports.await_action = await_action;
exports.MapReaderCache = {};
function map_read(name, pkey) {
    if (!Store.state[name]) {
        throw new Error('Store State Not Found:' + name);
    }
    if (!(Store.state[name].__option && Store.state[name].__option.Request && Store.state[name].__option.Request.pk)) {
        throw new Error('Store Options pk Not Defined:' + name);
    }
    if (Store.state[name].Maps[pkey]) {
        return Store.state[name].Maps[pkey];
    }
    else {
        if (!exports.MapReaderCache[name]) {
            exports.MapReaderCache[name] = [];
        }
        exports.MapReaderCache[name].push(pkey);
        castle_function_1.delay_cb('map_' + name, (20), function () {
            var _a;
            Store.state[name].__option.Request.search((_a = {}, _a[Store.state[name].__option.Request.pk] = { in: exports.MapReaderCache[name] }, _a), { P: 1, N: exports.MapReaderCache[name].length }).then(function (rs) {
                Store.commit(['M', name, 'MAPS'].join('_').toUpperCase(), rs);
            });
            exports.MapReaderCache[name] = [];
        });
        return '加载中';
    }
}
exports.map_read = map_read;
function store(modules) {
    vue.use(vuex);
    Store = new vuex.Store({
        getters: {},
        actions: {},
        modules: modules
    });
    return Store;
}
exports.store = store;
var SearchWhere = (function () {
    function SearchWhere() {
        this.Keyword = '';
        this.P = 1;
        this.N = 10;
        this.Sort = '';
        this.W = {};
    }
    return SearchWhere;
}());
exports.SearchWhere = SearchWhere;
var SearchResult = (function () {
    function SearchResult() {
        this.L = [];
        this.P = 0;
        this.N = 0;
        this.T = 0;
        this.R = {};
    }
    return SearchResult;
}());
exports.SearchResult = SearchResult;
//# sourceMappingURL=index.js.map