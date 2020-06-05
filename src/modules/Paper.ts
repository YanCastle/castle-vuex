import { Module, VuexModule, Action, Mutation } from "vuex-module-decorators";
import { SearchResult, SearchWhere } from "@ctsy/api-sdk/dist/lib";
import Paper from "@ctsy/api-sdk/dist/modules/Paper";
import { array_tree, array_key_set, delay_cb } from "castle-function";

@Module({})
export default class paper extends VuexModule {
  QResult: SearchResult<Paper.ClassQuestion> = new SearchResult();
  QWhere: SearchWhere = new SearchWhere();
  QGroups: { [index: string]: Paper.ClassQuestionGroup } = {};
  PResult: SearchResult<Paper.ClassPaper> = new SearchResult();
  PWhere: SearchWhere = new SearchWhere();

  @Mutation
  set_paper_where(w: SearchWhere) {
    this.PWhere = w;
  }

  @Mutation
  set_paper_list(d: SearchResult<Paper.ClassPaper>) {
    this.PResult = d;
  }

  /**
   * 开始处理题组树
   */
  Tree: any[] = [];
  @Mutation
  set_question_group_tree(d: SearchResult<Paper.ClassQuestionGroup>) {
    this.QGroups = array_key_set(
      [...d.L, { QGID: 0, Title: "未选择/未设定", Memo: "" }],
      "QGID"
    );
    this.Tree = array_tree(d.L, {
      pfield: "PQGID",
      ufield: "QGID",
      sub_name: "children"
    });
  }
  get QuestionGroupMap() {
    return this.QGroups;
  }
  @Action({ rawError: true })
  async get_question_group_tree() {
    this.context.commit(
      "set_question_group_tree",
      await Paper.QuestionGroupApi.search({
        W: {},
        Keyword: "",
        Sort: "",
        P: 1,
        N: 99999
      })
    );
    return true;
  }
  @Action({ rawError: true })
  async adds_question_group(groups: Paper.ClassQuestionGroup[]) {
    await Paper.QuestionGroupApi.adds(groups);
    this.context.dispatch("get_question_group_tree");
  }
  @Action({ rawError: true })
  async save_question_group(d: Paper.ClassQuestionGroup) {
    await Paper.QuestionGroupApi.save(d.QGID, d);
    this.context.dispatch("get_question_group_tree");
  }
  // 题组树处理完成
  @Mutation
  set_question_list(v: SearchResult<Paper.ClassQuestion>) {
    this.QResult = v;
  }
  @Mutation
  set_question_where(w: SearchWhere) {
    this.QWhere = w;
  }
  get QuestionResult() {
    return this.QResult;
  }
  @Action({ rawError: true })
  async get_question_list(where: SearchWhere) {
    if (where) {
      this.context.commit("set_question_where", where);
    }
    delay_cb('question_list', 100, async () => {
      this.context.commit(
        "set_question_list",
        await Paper.QuestionApi.search(where || this.QWhere)
      );
    })
    return this.QResult;
  }
  /**
   *
   * @param data
   */
  @Action({ rawError: true })
  async adds_question(data: Paper.ClassQuestion[]) {
    let rs = await Paper.QuestionApi.adds(data);
    this.context.dispatch("get_question_list");
    return rs;
  }
  /**
   * 保存
   * @param data
   */
  @Action({ rawError: true })
  async save_question(data: Paper.ClassQuestion) {
    let rs = await Paper.QuestionApi.save(data.QID, data);
    if (rs instanceof Array) {
      this.context.dispatch("get_question_list");
    }
    return rs;
  }

  @Action({ rawError: true })
  async get_paper_list(w: SearchWhere) {
    if (w) {
      this.context.commit("set_paper_where", w);
    }
    delay_cb('paper_list', 100, async () => {
      this.context.commit(
        "set_paper_list",
        await Paper.PaperApi.search(w || this.PWhere)
      );
    })
    return this.QResult;
  }

  @Action({ rawError: true })
  async save_paper(data: Paper.ClassPaper) {
    await Paper.PaperApi.save(data.PID, data);
    this.context.dispatch("get_paper_list");
    return;
  }
  @Action({ rawError: true })
  async adds_paper(data: Paper.ClassPaper[]) {
    await Paper.PaperApi.adds(data);
    this.context.dispatch("get_paper_list");
    return;
  }

  @Action({ rawError: true })
  async paper_test() {
    // let p = new Paper.ClassPaper;
    // let pc = new Paper.ClassPaperConfig
    // pc.Source = [1, 2]
    // pc.QGID = 11;
    // pc.Title = '测试组'
    // pc.Score = 1;
    // pc.Use = 2
    // p.Total = 100;
    // p.Title = '哈哈测试试卷'
    // p.Configs.push(pc)
    // Paper.PaperApi.adds([p])
    Paper.PaperApi.get(3);
    return true;
  }
}
