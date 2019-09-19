# Vuex 辅助类
提供Vuex常用辅助方法等

## 1. 安装
```shell
yarn add @ctsy/vuex
```

## 2. 使用
```typescript
// 初始化 vuex
// src/store/index.ts
import { store as Store } from "@ctsy/vuex";
import Auth from './modules/Auth';

const store = Store({
    Auth
});


declare let window: any;
window.Store = store;
export default store;


// src/store/modules/class.ts

import CollectionTypeApi from '@/api//CollectionType';
import Vuex, {
    VuexStore
} from '@ctsy/vuex'
@Vuex({
    Request:CollectionTypeApi
})
export default class CollectionType extends VuexStore {
    ClassName: string = "CollectionType"
}


```