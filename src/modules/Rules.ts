import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import User from "@ctsy/api-sdk/dist/modules/User";
import { SearchResult, SearchWhere } from '@ctsy/api-sdk/dist/lib'
import hook, { HookWhen } from '@ctsy/hook';

@Module({})
export default class Rules extends VuexModule {
    All: any = {}
    @Mutation
    set_rules(Rules: any) {
        this.All = Rules
    }
    @Action({ rawError: true })
    async get_rules(force: boolean = false) {
        if (force == true || Object.keys(this.All).length == 0)
            this.context.commit('set_rules', await User.RuleApi.all());
        return this.All;
    }
}