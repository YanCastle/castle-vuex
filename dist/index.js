"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vuex = require("vuex");
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
    var name = store.name;
    var sclass = new store();
    if (!classes[name])
        classes[name] = sclass;
    else {
        console.error('VuexStore:重复的VuexStore定义' + name);
    }
    sclass.__option = option;
    sclass.__option.name = name.toUpperCase();
    var s = {
        state: {},
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
                console.error('Vuex方法名称不符合规范:' + name + '.' + k);
            }
        }
        else {
            if (k.substr(0, 2) !== '__')
                s.state[k] = sclass[k];
        }
    });
    var methods = Object.getOwnPropertyNames(Object.getPrototypeOf(store.prototype)).concat(Object.getOwnPropertyNames(store.prototype));
    methods.forEach(function (k) {
        if (/^([AGM])_([A-Z_\d]{1,})$/.test(k)) {
            var ks = k.replace(/^([AGM])_/, '$1_' + name.toUpperCase() + '_');
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
            if (['constructor'].indexOf(k) === -1)
                console.error('Vuex方法名称不符合规范:' + name + '.' + k);
        }
    });
    return s;
}
function store(vue, modules) {
    vue.use(vuex);
    return new vuex.Store({
        getters: {},
        actions: {},
        modules: modules
    });
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
    if (data && data.Success instanceof Function) {
        data.Success(result);
    }
}
function action_error(data, result) {
    if (data && data.Error instanceof Function) {
        data.Error(result);
    }
}
var VuexStore = (function () {
    function VuexStore() {
        this.Result = new SearchResult();
        this.Where = new SearchWhere();
    }
    VuexStore.prototype.A_SEARCH = function (context, data) {
        var _this = this;
        if (this.__option.Request && this.__option.Request.search) {
            this.__option.Request.search(context.state.Where).then(function (rs) {
                if (_this.__option.searchOnChange !== false)
                    context.commit('M_' + _this.__option.name + '_RESULT', rs);
                action_success(data, rs);
            }).catch(function (e) {
                action_error(data, e);
            });
        }
    };
    VuexStore.prototype.A_ADD = function (context, data) {
        var _this = this;
        if (this.__option.Request && this.__option.Request.add) {
            this.__option.Request.add(data.Data).then(function (rs) {
                if (_this.__option.searchOnChange !== false)
                    context.dispatch('A_' + _this.__option.name + '_SEARCH', rs);
                action_success(data, rs);
            }).catch(function (e) {
                action_error(data, e);
            });
        }
    };
    VuexStore.prototype.A_SAVE = function (context, data) {
        var _this = this;
        if (this.__option.Request && this.__option.Request.save) {
            this.__option.Request.save(data.Data[this.__option.Request._pk], data.Data).then(function (rs) {
                if (_this.__option.searchOnChange !== false)
                    context.dispatch('A_' + _this.__option.name + '_SEARCH', rs);
                action_success(data, rs);
            }).catch(function (e) {
                action_error(data, e);
            });
        }
    };
    VuexStore.prototype.A_DEL = function (context, data) {
        var _this = this;
        if (this.__option.Request && this.__option.Request.del) {
            this.__option.Request.del(data.Data[this.__option.Request._pk]).then(function (rs) {
                if (_this.__option.searchOnChange !== false)
                    context.dispatch('A_' + _this.__option.name + '_SEARCH', rs);
                action_success(data, rs);
            }).catch(function (e) {
                action_error(data, e);
            });
        }
    };
    VuexStore.prototype.A_DEL_W = function (context, data) {
        var _this = this;
        if (this.__option.Request && this.__option.Request.delW) {
            this.__option.Request.delW({ W: data.Data }).then(function (rs) {
                if (_this.__option.searchOnChange !== false) {
                    context.state.Where.W = {};
                    context.dispatch('A_' + _this.__option.name + '_SEARCH', context.state.Where);
                }
                action_success(data, rs);
            }).catch(function (e) {
                action_error(data, e);
            });
        }
    };
    VuexStore.prototype.A_IMPORT = function (context, data) {
        if (this.__option.Request && this.__option.Request.add) {
            this.__option.Request.add(data.Data).then(function (rs) {
                action_success(data, rs);
            }).catch(function (e) {
                action_error(data, e);
            });
        }
    };
    VuexStore.prototype.G_RESULT = function (state) {
        return state.Result;
    };
    VuexStore.prototype.G_WHERE = function (state) {
        return state.Where;
    };
    VuexStore.prototype.M_WHERE = function (state, payload) {
        state.Where = payload;
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