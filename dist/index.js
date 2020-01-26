"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var hook_1 = require("@ctsy/hook");
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
    if (superProto instanceof VuexStore) {
    }
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
                        return __awaiter(this, void 0, void 0, function () {
                            var rs, error_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 5, , 6]);
                                        rs = {};
                                        if (!(data.s instanceof Function && data.e instanceof Function)) return [3, 2];
                                        return [4, sclass[k].apply(sclass, [state, data.d, s])];
                                    case 1:
                                        rs = _a.sent();
                                        if (data.s instanceof Function) {
                                            data.s(rs);
                                        }
                                        return [3, 4];
                                    case 2: return [4, sclass[k].apply(sclass, [state, data, s])];
                                    case 3:
                                        rs = _a.sent();
                                        _a.label = 4;
                                    case 4: return [2, rs];
                                    case 5:
                                        error_1 = _a.sent();
                                        if (data.e instanceof Function) {
                                            data.e(error_1);
                                        }
                                        return [3, 6];
                                    case 6: return [2];
                                }
                            });
                        });
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
    return new Promise(function (s, e) {
        Store.dispatch(a, {
            d: data,
            s: s, e: e
        });
    });
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
var ActionParams = (function () {
    function ActionParams() {
    }
    return ActionParams;
}());
exports.ActionParams = ActionParams;
function action_success(data, result) {
    if (data && data.s instanceof Function) {
        data.s(result);
    }
}
exports.action_success = action_success;
function action_error(data, result) {
    if (data && data.e instanceof Function) {
        data.e(result);
    }
}
exports.action_error = action_error;
var VuexStore = (function () {
    function VuexStore() {
        this.Result = new SearchResult();
        this.Where = new SearchWhere();
        this.AllResult = new SearchResult();
        this.AllowAll = false;
        this.ClassName = "";
        this.Maps = {};
    }
    VuexStore.prototype.A_ALL = function (ctx) {
        var _this = this;
        if (this.AllowAll) {
            this.__option.Request.search({ N: 999999, P: 1, Keyword: '', W: {}, Sort: '' }).then(function (rs) {
                ctx.commit('M_' + _this.__option.name.toLocaleUpperCase() + '_ALL', rs);
            });
        }
    };
    VuexStore.prototype.A_SEARCH = function (context, data) {
        var _this = this;
        if (this.__option.Request && this.__option.Request.search) {
            return this.__option.Request.search((data.Data && data.Data.W) || context.state.Where, data.Data).then(function (rs) {
                if (_this.__option.searchOnChange !== false)
                    context.commit('M_' + _this.__option.name.toLocaleUpperCase() + '_RESULT', rs);
                return rs;
            });
        }
    };
    VuexStore.prototype.A_ADD = function (context, data) {
        var _this = this;
        if (this.__option.Request && this.__option.Request.add) {
            return this.__option.Request.add(data.Data).then(function (rs) {
                if (_this.__option.searchOnChange !== false)
                    context.dispatch('A_' + _this.__option.name.toLocaleUpperCase() + '_SEARCH', rs);
                return rs;
            });
        }
    };
    VuexStore.prototype.A_SAVE = function (context, data) {
        var _this = this;
        if (this.__option.Request && this.__option.Request.save) {
            return this.__option.Request.save(data.Data[this.__option.Request.pk], data.Data).then(function (rs) {
                if (_this.__option.searchOnChange !== false)
                    context.dispatch('A_' + _this.__option.name.toLocaleUpperCase() + '_SEARCH', rs);
                return rs;
            });
        }
    };
    VuexStore.prototype.A_DEL = function (context, data) {
        var _this = this;
        if (this.__option.Request && this.__option.Request.del) {
            return this.__option.Request.del(data.Data[this.__option.Request.pk]).then(function (rs) {
                if (_this.__option.searchOnChange !== false)
                    context.dispatch('A_' + _this.__option.name.toLocaleUpperCase() + '_SEARCH', rs);
                return rs;
            });
        }
    };
    VuexStore.prototype.A_DEL_W = function (context, data) {
        var _this = this;
        if (this.__option.Request && this.__option.Request.delW) {
            return this.__option.Request.delW({ W: data.Data }).then(function (rs) {
                if (_this.__option.searchOnChange !== false) {
                    context.state.Where.W = {};
                    context.dispatch('A_' + _this.__option.name.toLocaleUpperCase() + '_SEARCH', context.state.Where);
                }
                return rs;
            });
        }
    };
    VuexStore.prototype.G_RESULT = function (state) {
        return state.Result;
    };
    VuexStore.prototype.G_WHERE = function (state) {
        return state.Where;
    };
    VuexStore.prototype.G_ALL = function (state, store) {
        if (state.AllResult.T <= 0) {
            Store.dispatch(['A', state.ClassName.toUpperCase(), 'ALL'].join('_'), {});
        }
        return state.AllResult;
    };
    VuexStore.prototype.M_ALL = function (state, payload) {
        state.AllResult = payload;
    };
    VuexStore.prototype.M_WHERE = function (state, payload) {
        state.Where = payload;
    };
    VuexStore.prototype.M_MAPS = function (state, payload) {
        if (payload.L && payload.L.length > 0) {
            for (var _i = 0, _a = payload.L; _i < _a.length; _i++) {
                var x = _a[_i];
                state.Maps[x[this.__option.Request.pk]] = x;
            }
            hook_1.default.emit(exports.VuexHook.MapUpdate, hook_1.HookWhen.After, state, payload);
        }
    };
    VuexStore.prototype.M_WHERE_W = function (state, payload) {
        state.Where.W = payload;
    };
    VuexStore.prototype.M_WHERE_P = function (state, p) {
        state.Where.P = p;
    };
    VuexStore.prototype.M_WHERE_N = function (state, n) {
        state.Where.N = n;
    };
    VuexStore.prototype.M_WHERE_KEYWORD = function (state, keyword) {
        state.Where.Keyword = keyword;
    };
    VuexStore.prototype.M_WHERE_SORT = function (state, sort) {
        state.Where.Sort = sort;
    };
    VuexStore.prototype.M_RESULT = function (state, rs) {
        state.Result = rs;
    };
    return VuexStore;
}());
exports.VuexStore = VuexStore;
//# sourceMappingURL=index.js.map