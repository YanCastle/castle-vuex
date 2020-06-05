import {
    VuexModule,
    Module,
    Action,
    Mutation,
    getModule
} from "vuex-module-decorators";
import User from "@ctsy/api-sdk/dist/modules/User";
import { SearchResult, SearchWhere, LinkType } from "@ctsy/api-sdk/dist/lib";
import hook, { HookWhen } from "@ctsy/hook";
import ClassTags from "@ctsy/api-sdk/dist/modules/task/class/Tag";
import ClassProject from "@ctsy/api-sdk/dist/modules/task/class/Project";
import ClassTask from "@ctsy/api-sdk/dist/modules/task/class/Task";
import ClassTaskGroup from "@ctsy/api-sdk/dist/modules/task/class/TaskGroup";
import ClassTaskMember from "@ctsy/api-sdk/dist/modules/task/class/Member";
import TaskApi from "@ctsy/api-sdk/dist/modules/Task";
import { array_key_set, delay_cb } from "castle-function";
import { uniq, difference } from "lodash";
import Upload from "@ctsy/api-sdk/dist/modules/Upload";
import UploadApi from "@ctsy/api-sdk/dist/modules/Upload";
import ClassTaskFiles from "@ctsy/api-sdk/dist/modules/task/class/Files";
import Comment from "@ctsy/api-sdk/dist/modules/task/class/Comment";
/**
 * 等待需要加载的任务组信息
 */
var WaitingTGIDs: number[] = [];

@Module({})
export default class Task extends VuexModule {
    /**
     * 该UnitID的所有Tags，
     */
    Tags: { [index: string]: ClassTags } = {};
    /**
     * 添加详情Title数组
     * @param d
     */
    TaskTitles: string[] = [];
    @Action({ rawError: true })
    async save_task_title(d: string) {
        this.context.commit("set_task_titles", d);
    }
    /**
     * 清空Title数组
     * @param d
     */
    @Mutation
    clear_task_title() {
        this.TaskTitles = [];
    }
    /**
     * 设置详情Title数组
     * @param d
     */
    @Mutation
    set_task_titles(d: string) {
        this.TaskTitles.push(d);
    }
    /**
     * 修改task的tags
     * @param UnitID
     */
    @Action({ rawError: true })
    async set_task_tsak_link(d: any) {
        d.Type = LinkType.replace;
        let rs = await TaskApi.TagApi.link(d);
        this.context.commit("update_task_task", d.TID);
    }

    /**
     * 获取所有tags
     * @param UnitID
     */
    @Action({ rawError: true })
    async get_all_task_tags(UnitID?: number) {
        let Tags = await TaskApi.TagApi.search({
            W: { UnitID: UnitID || this.UnitID },
            P: 1,
            N: 9999,
            Keyword: "",
            Sort: ""
        });
        if (Tags.L.length > 0) this.context.commit("set_all_task_tags", Tags.L);
    }
    /**
     * 设置所有Tags的对象
     * @param tags
     */
    @Mutation
    set_all_task_tags(tags: ClassTags[]) {
        this.Tags = array_key_set(tags, "TagID");
    }
    /**
     * 批量添加Tag后更新task_tag
     * @param data
     */
    @Action({ rawError: true })
    async add_task_tags(data: ClassTags[]) {
        let Tags = await TaskApi.TagApi.adds(data);
        this.context.commit("set_all_task_tags", [
            ...Object.keys(this.Tags),
            ...Tags
        ]);
    }
    /**
     * 该UnitID的所有Tags，
     */
    Projects: SearchResult<ClassProject> = new SearchResult();

    UnitID: number = 0;
    /**
     * 项目Map
     */
    ProjectMap: { [index: string]: ClassProject } = {};
    /**
     * 进入项目后设置的项目编号
     */
    SelectedPID: number = 0;
    /**
     * 当前选中的项目信息
     */
    Project: ClassProject = new ClassProject();

    /**
     * 设置选中的项目的PID信息
     * @param PID 
     */
    @Mutation
    set_project(PID: number) {
        this.SelectedPID = PID;
        for (let x of this.Projects.L) {
            if (x.PID == PID) {
                this.Project = this.Project;
                break;
            }
        }
        if (!this.Project.PID) {
            // store.dispatch('get_task_projects', this.UnitID)
        }
    }

    // get Projects() {
    //     return array_key_set(this.Projects.L, "PID");
    // }

    @Mutation
    set_task_unitid(UnitID: number) {
        this.UnitID = UnitID;
    }

    /**
     * 读取项目
     * @param UnitID
     */
    @Action({ rawError: true })
    async get_task_projects(UnitID?: number) {
        let Tags = await TaskApi.ProjectApi.search({
            W: { UnitID: UnitID || this.UnitID },
            P: 1,
            N: 9999,
            Keyword: "",
            Sort: ""
        });
        if (Tags.L.length > 0) this.context.commit("set_task_projects", Tags);
    }
    /**
     * 设置所有Projects的对象
     * @param data
     */
    @Mutation
    set_task_projects(data: SearchResult<ClassProject>) {
        this.Projects = data;
    }
    /**
     * 批量添加projects后更新task_project
     * @param data
     */
    @Action({ rawError: true })
    async add_task_projects(data: ClassProject[]) {
        let Tags = await TaskApi.ProjectApi.adds(data);
        this.context.dispatch("get_task_projects");
    }

    /**
     * 保存项目信息
     * @param data
     */
    @Action({ rawError: true })
    async save_task_project(data: ClassProject) {
        let rs = await TaskApi.ProjectApi.save(data.PID, data);
        this.context.dispatch("update_task_project", data.PID);
    }
    /**
     * 更新某个Project
     * @param PID
     */
    @Action({ rawError: true })
    async update_task_project(PID: number) {
        let Project = await TaskApi.ProjectApi.search({
            W: { PID: PID },
            P: 1,
            N: 1,
            Keyword: "",
            Sort: ""
        });
        this.context.commit("set_task_project", Project.L[0]);
    }
    /**
     * 保存后的更新Project数据
     * @param data
     */
    @Mutation
    set_task_project(data: ClassProject) {
        for (let i in this.Projects.L) {
            let x = this.Projects.L[i];
            if (x.PID == data.PID) {
                this.Projects.L[i] = data;
                return;
            }
        }
    }

    //-----------------
    // 项目成员管理
    //-----------------
    @Action({ rawError: true })
    async get_task_project_member(PID: number) {
        // let rs = await TaskApi.Member.search()
    }
    /**
     * 绑定项目成员
     * @param PID
     */
    @Action({ rawError: true })
    async link_task_project_member(PID: number) {
        this.context.dispatch("update_task_project", PID);
        return true;
    }
    /**
     * 审核受邀请人
     * @param PID
     */
    @Action({ rawError: true })
    async judge_task_project_member(PID: number) {
        this.context.dispatch("update_task_project", PID);
        return true;
    }
    /**
     * 解绑项目成员
     * @param PID
     */
    @Action({ rawError: true })
    async unlink_task_project_member(PID: number) {
        // TODO 执行相关操作
        this.context.dispatch("update_task_project", PID);
        return true;
    }

    //-----------------
    // 任务操作部分
    //-----------------

    Tasks: SearchResult<ClassTask> = new SearchResult();

    /**
     * 获取任务getter
     */
    get TasksMap() {
        return array_key_set(this.Tasks.L, "TID");
    }
    /**
     * 读取任务
     * @param UnitID
     */
    @Action({ rawError: true })
    async get_task_tasks(PID: number) {
        let Tags = await TaskApi.TaskApi.search({
            W: { PID: PID, PTID: 0, Status: { gt: -1 } },
            P: 1,
            N: 9999,
            Keyword: "",
            Sort: ""
        });
        this.context.commit("set_task_tasks", Tags);
    }
    ChlidTasks: SearchResult<ClassTask> = new SearchResult();
    /**
     * 读取子任务
     * @param data
     */
    @Action({ rawError: true })
    async get_task_child_tasks(TID: number) {
        let Tags = await TaskApi.TaskApi.search({
            W: { PTID: TID, Status: { gt: -1 } },
            P: 1,
            N: 9999,
            Keyword: "",
            Sort: ""
        });
        this.context.commit("set_task_child_tasks", Tags);
    }
    /**
     * 设置所有childtasks的对象
     * @param tasks
     */
    @Mutation
    set_task_child_tasks(data: SearchResult<ClassTask>) {
        this.ChlidTasks = data;
    }
    /**
     * 设置所有tasks的对象
     * @param tasks
     */
    @Mutation
    set_task_tasks(data: SearchResult<ClassTask>) {
        this.Tasks = data;
    }
    /**
     * 批量添加Tasks后更新task_task
     * @param data
     */
    @Action({ rawError: true })
    async add_task_tasks(data: ClassTask[]) {
        let Tags = await TaskApi.TaskApi.adds(data);
        this.context.dispatch("get_task_tasks", data[0].PID);
    }
    /**
     * 上传单个附件
     * @param data
     */
    // TaskFiles: SearchResult<any> = new SearchResult
    /**
     * 任务的文件对象字典
     */
    TaskDetailMap: {
        [index: string]: {
            Files: ClassTaskFiles[];
        };
    } = {};

    @Action({ rawError: true })
    async add_task_task_file(file: any) {
        let config: Upload.ClassUploadFileConfig = new Upload.ClassUploadFileConfig();
        config.what = "任务绑定附件";
        config.oname = file.name;
        config.expire = false;
        config.acl = "read";
        let rs = await UploadApi.upload_file(file, config);
        let data: any = {};
        data.Type = LinkType.append;
        data.TID = file.TID;
        data.Files = [
            {
                Path: ":/",
                Name: file.name,
                URL: rs.URL,
                Memo: "123",
                Type: file.name.slice(file.name.indexOf(".")),
                Size: file.size,
                Status: 1
            }
        ];
        this.context.dispatch("link_task_task_files", data);
    }
    /**
     * 任务批量关联files
     * @param d
     */
    @Action({ rawError: true })
    async link_task_task_files(data: any) {
        let rs = await TaskApi.TaskApi.file(data.Type, data.Files, data.TID);
        if (rs) {
            let d = await TaskApi.TaskApi.detail([data.TID]);
        }
    }
    /**
     * 查询关联任务的附件
     * @param TIDs
     */
    @Action({ rawError: true })
    async get_task_task_files(TIDs: number[]) {
        let PenddingTIDs = [];
        for (let x of TIDs) {
            if (!this.TaskDetailMap[x]) {
                PenddingTIDs.push(x);
            }
        }
        if (PenddingTIDs.length > 0) {
            let d = await TaskApi.TaskApi.detail(TIDs);
            this.context.commit("set_task_task_detail_map", d);
        }
    }

    @Mutation
    set_task_task_detail_map(data: any) {
        this.TaskDetailMap = data;
    }
    /**
     * 查询关联任务的评论
     * @param TIDs
     */
    get TaskCommentMap() {
        return array_key_set(this.TaskComments, 'CID')
    }
    TaskComments: SearchResult<Comment> = new SearchResult
    @Action({ rawError: true })
    async get_task_task_comments(TID: number) {
        let d = await TaskApi.CommentApi.search({
            W: {},
            P: 1,
            N: 50,
            Keyword: "",
            Sort: ""
        })
        this.context.commit('set_task_task_comments', d.L)
    }
    @Mutation
    set_task_task_comments(d: any) {
        let arr: any = []
        for (let x of d) {
            if (x.Status > -1) {
                arr.push(x)
            }
        }
        this.TaskComments = arr
    }
    /**
     * 添加任务评论
     * @param data 
     */
    @Action({ rawError: true })
    async add_task_task_comments(data: any) {
        let d = await TaskApi.CommentApi.add(data)
        this.context.dispatch('get_task_task_comments', data.TID)
    }
    /**
     * 删除评论
     * @param data 
     */
    @Action({ rawError: true })
    async del_task_task_comments(data: any) {
        let rs: any = {}
        rs.CID = data.CID
        rs.Status = -1
        let d = await TaskApi.CommentApi.save(rs.CID, rs)
        this.context.dispatch('get_task_task_comments', data.TID)
    }
    /**
     * 添加单个task
     * @param data
     */
    @Action({ rawError: true })
    async add_task_task(data: ClassTask) {
        let Tags = await TaskApi.TaskApi.add(data);
        if (data.PTID) {
            this.context.dispatch("get_task_child_tasks", data.PTID);
        } else {
            this.context.dispatch("get_task_tasks", data.PID);
        }
    }
    /**
     * 删除某task
     * @param data
     */
    @Action({ rawError: true })
    async del_task_task(d: any) {
        let data: any = {};
        data.TID = d.TID;
        data.Status = -1;
        let Tags = await TaskApi.TaskApi.save(data.TID, data);
        // let rs = await TaskApi.TaskApi.del(data.TID)
        this.context.dispatch("get_task_tasks", d.PID);
    }
    /**
     * 保存任务信息
     * @param data
     */
    @Action({ rawError: true })
    async save_task_task(data: ClassTask) {
        let rs = await TaskApi.TaskApi.save(data.TID, data);
        this.context.dispatch("update_task_task", data.TID);
    }
    /**
     * 更新某个Task
     * @param PID
     */
    @Action({ rawError: true })
    async update_task_task(TID: number) {
        let Project = await TaskApi.TaskApi.search({
            W: { TID: TID },
            P: 1,
            N: 1,
            Keyword: "",
            Sort: ""
        });
        this.context.commit("set_task_task", Project.L[0]);
    }
    /**
     * 单一保存后的更新Task数据
     * @param data
     */
    @Mutation
    set_task_task(data: ClassTask) {
        for (let i in this.Tasks.L) {
            let x = this.Tasks.L[i];
            if (x.TID == data.TID) {
                this.Tasks.L[i] = data;
                return;
            }
        }
    }
    //-----------------
    // 任务标签管理
    //-----------------

    //-----------------
    // 任务成员管理
    //-----------------

    /**
     * 绑定任务成员
     * @param PID
     */
    @Action({ rawError: true })
    async link_task_task_member(TID: number) {
        this.context.dispatch("update_task_task", TID);
        return true;
    }
    /**
     * 审核任务成员（暂时无用）
     * @param TID
     */
    @Action({ rawError: true })
    async judge_task_task_member(TID: number) {
        this.context.dispatch("update_task_task", TID);
        return true;
    }
    /**
     * 解绑任务成员
     * @param TID
     */
    @Action({ rawError: true })
    async unlink_task_task_member(TID: number) {
        // TODO 执行相关操作
        this.context.dispatch("update_task_task", TID);
        return true;
    }

    //-----------------
    // 任务标签管理
    //-----------------

    //-----------------
    // 任务成员管理
    //-----------------

    /**
     * 解绑任务成员
     * @param TID
     */

    //-----------------
    // 任务组管理
    //-----------------

    TaskGroups: SearchResult<ClassTaskGroup> = new SearchResult();
    /**
     * 任务组字典
     */
    TaskGroupMap: { [index: string]: ClassTaskGroup } = {};

    /**
     * 获取任务组getter
     */
    // get TaskGroup() {
    //     return array_key_set(this.TaskGroups.L, 'TGID');
    // }

    /**
     * 加载并读取任务组信息
     * @param TGID
     */
    @Action({ rawError: true })
    async get_task_task_group_map(TGID: number | number[]) {
        if (TGID instanceof Array) {
            WaitingTGIDs.push(...TGID);
        } else {
            WaitingTGIDs.push(TGID);
        }
        delay_cb("update_get_task_task_group_map", 20, async () => {
            if (WaitingTGIDs.length > 0) {
                let TGIDs = difference(
                    uniq(WaitingTGIDs),
                    Object.keys(this.TaskGroupMap).map(v => Number(v))
                );
                // debugger
                WaitingTGIDs.length = 0;
                if (TGIDs.length > 0) {
                    try {
                        this.context.commit(
                            "set_task_task_group_map",
                            await TaskApi.TaskGroupApi.search({
                                W: { TGID: { in: TGIDs } },
                                P: 1,
                                N: TGIDs.length
                            })
                        );
                    } catch (error) { }
                }
            }
        });
        return true;
    }
    /**
     * 设置任务组Map对象信息
     * @param data
     */
    @Mutation
    set_task_task_group_map(data: SearchResult<ClassTaskGroup>) {
        this.TaskGroupMap = array_key_set(data.L, "TGID");
        // for (let x of <any>this.Tasks.L) {
        //     x.Group = this.TaskGroupMap[x.TGID];
        // }
    }
    /**
     * 读取任务组
     * @param UnitID
     */
    @Action({ rawError: true })
    async get_task_task_groups(PID: number) {
        let Tags = await TaskApi.TaskGroupApi.search({
            W: { PID: PID },
            P: 1,
            N: 9999,
            Keyword: "",
            Sort: ""
        });
        if (Tags.L.length > 0) {
            this.context.commit("set_task_task_groups", Tags.L);
            this.context.commit("set_task_task_group_map", Tags);
        }
    }
    /**
     * 删除某个任务组
     * @param data
     */
    @Action({ rawError: true })
    async del_task_task_group(d: any) {
        let rs = await TaskApi.TaskGroupApi.del(d.TGID);
        this.context.dispatch("get_task_tasks", d.PID);
    }
    /**
     * 设置所有Task_group的对象
     * @param tags
     */
    @Mutation
    set_task_task_groups(data: SearchResult<ClassTaskGroup>) {
        this.TaskGroups = data;
    }
    /**
     * 批量添加Task_group后更新task_task_group
     * @param data
     */
    @Action({ rawError: true })
    async add_task_task_groups(data: ClassTaskGroup[]) {
        let Tags = await TaskApi.TaskGroupApi.adds(data);
        this.context.dispatch("get_task_task_groups");
    }
    /**
     * 单个添加
     * @param data
     */
    @Action({ rawError: true })
    async add_task_task_group(data: ClassTaskGroup) {
        let Tags: any = await TaskApi.TaskGroupApi.add(data);
        let d: any = {};
        d.PID = Tags.PID;
        d.TGID = Tags.TGID;
        d.TID = 0;
        this.context.dispatch("get_task_task_groups", data.PID);
        this.context.dispatch("add_task_task", d);
    }
    /**
     * 保存Task_group信息
     * @param data
     */
    @Action({ rawError: true })
    async save_task_task_group(data: ClassTaskGroup) {
        let rs = await TaskApi.TaskGroupApi.save(data.TGID, data);
        this.context.dispatch("update_task_task_group", data.TGID);
    }
    /**
     * 更新某个Task_group
     * @param PID
     */
    @Action({ rawError: true })
    async update_task_task_group(TGID: number) {
        let Project = await TaskApi.TaskGroupApi.search({
            W: { TGID: TGID },
            P: 1,
            N: 1,
            Keyword: "",
            Sort: ""
        });
        this.context.commit("set_task_task_group", Project.L[0]);
    }
    /**
     * 单一保存后的更新Task_group数据
     * @param data
     */
    @Mutation
    set_task_task_group(data: ClassProject) {
        for (let i in this.Projects.L) {
            let x = this.Projects.L[i];
            if (x.PID == data.PID) {
                this.Projects.L[i] = data;
                return;
            }
        }
    }

    //-----------------
    // 项目成员管理
    //-----------------
    //   ProjectMember: SearchResult<ClassProject> = new SearchResult();

    /**
     * 给某个项目添加成员
     */
    @Action({ rawError: true })
    async add_project_member(data: any) {
        let arr: Array<any> = [];
        data.Ms.forEach((el: any) => {
            arr.push({
                UID: el.UID,
                Type: 1001,
                Status: el.Status
            });
        });
        await TaskApi.ProjectApi.link(LinkType.replace, arr, data.PID * 1);
    }

    //-----------------
    // 任务详情 开始
    //-----------------

    // @Action
    // async start_task_task_detail(data: any) {
    //     //tid status
    //     await TaskApi.TaskDetailAPi.add(data);
    // }
}
