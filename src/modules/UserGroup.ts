import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import User from "@ctsy/api-sdk/dist/modules/User";
import { SearchResult, SearchWhere } from '@ctsy/api-sdk/dist/lib'
import hook, { HookWhen } from '@ctsy/hook';
import { array_tree } from 'castle-function';

@Module({})
export default class UserGroup extends VuexModule {
    All: any = {}
    Tree: any = [];
    get UserGroupTree() {
        return this.Tree;
    }
    @Mutation
    set_user_groups(Groups: any) {
        this.All = Groups
        this.Tree = Object.values(array_tree(Groups, { pfield: 'PUGID', ufield: 'UGID', sub_name: 'children' }))
    }
    @Action({ rawError: true })
    async get_user_group({ PUnitID, Force }: any) {
        if (Force == true || Object.keys(this.All).length == 0)
            this.context.commit('set_user_groups', await User.GroupApi.list({}));
        return this.All;
    }
}