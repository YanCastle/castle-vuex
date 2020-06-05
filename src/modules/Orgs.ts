import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
// import store from '@/store'
import Org from "@ctsy/api-sdk/dist/modules/Org";
import { SearchResult, SearchWhere } from '@ctsy/api-sdk/dist/lib'
import hook, { HookWhen } from '@ctsy/hook';
import { delay_cb, array_tree } from 'castle-function';
import { uniq } from 'lodash';
var WaitingUnitIDs: number[] = [];
@Module({})
export default class orgs extends VuexModule {
    Result: SearchResult<any> = new SearchResult();
    Where: SearchWhere = new SearchWhere();
    Tree: any[] = []
    /**
     * UID Map
     */
    Map: { [index: string]: any } = {}
    @Mutation
    set_orgs_where(data: any) {
        this.Where = data;
    }
    @Mutation
    set_orgs_map(rs: SearchResult<any>) {
        for (let x of rs.L) {
            this.Map[x.UID] = x;
        }
    }
    @Mutation
    set_orgs_result(data: any) {
        this.Result = data;
    }
    @Mutation
    set_orgs_tree(data: any) {
        // for (let x of data.L) {
        //     x.label = x.Title;
        //     x.id = x.UnitID;
        // }
        this.Tree = Object.values(array_tree(data.L, { pfield: 'PUnitID', ufield: 'UnitID', sub_name: 'children' }))
    }
    get orgs_result() {
        return this.Result;
    }
    @Action({ rawError: true })
    async get_orgs_list(where: SearchWhere) {
        let w = where || this.Where;
        // try {
        this.context.commit('set_orgs_result', await Org.OrganApi.list(w || {}));
        return this.Result;
    }
    @Action({ rawError: true })
    async get_orgs_tree(where: SearchWhere) {
        this.context.commit('set_orgs_tree', await Org.OrganApi.list({ P: 1, N: 9999 }));
        return this.Result;
    }
    /**
     * 获取组织结构，通过循环dispatch来完成堆积后延时20ms后开始读取数据
     * @param UID 
     */
    @Action({ rawError: true })
    async get_orgs_map(UnitID: number | number[]) {
        if (UnitID instanceof Array) {
            WaitingUnitIDs.push(...UnitID)
        } else {
            WaitingUnitIDs.push(UnitID);
        }
        delay_cb('update_get_orgs_map', 20, async () => {
            if (WaitingUnitIDs.length > 0) {
                let UnitIDs = uniq(WaitingUnitIDs)
                try {
                    this.context.commit('set_orgs_map', await Org.OrganApi.list({ W: { UnitID: { in: UnitIDs } }, P: 1, N: UnitIDs.length }))
                } catch (error) {

                }
            }
        })
        return true;
    }

}