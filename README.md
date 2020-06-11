# Vuex 辅助类

提供 Vuex 常用辅助方法等

## 1. 安装

```shell
yarn add @ctsy/vuex
```

## 2. 使用

```typescript
// 初始化 vuex
// src/store/index.ts
import { store as Store } from "@ctsy/vuex";
import Auth from "./modules/Auth";

const store = Store({
  Auth,
});

declare let window: any;
window.Store = store;
export default store;

// src/store/modules/class.ts

import CollectionTypeApi from "@/api//CollectionType";
import Vuex, { VuexStore } from "@ctsy/vuex";
@Vuex({
  Request: CollectionTypeApi,
})
export default class CollectionType extends VuexStore {
  ClassName: string = "CollectionType";
}
```

## 自定义正则

###注意：

> 当自定义正则后，基于自定义正则校验将会同时改变

```
1.引用 import PublicReg from  'src/RegExp'
2.初始化 let reg = new PublicReg.Regs()
3.使用  reg.Name('张三') //true

//自定义正则
1.初始化 let custom = new PublicReg.CustomReg()
2.使用 custom.Name =/\d{6,10}/
3.调用  let reg = new PublicReg.Regs()
4.使用   reg.Name('张三') //false



```
