## 注册组件库

```js
import glStore from '@/frontend/public/components'
Vue.use(glStore)
```

## 目录介绍

```
src/
├── public/
│   |
│   ├── components/             # 公用组件
│   │   └── ...
│   ├── shared/                 # 业务组件
│   │   └── ...
│   |── assets/                 # 模块资源（样式、图片）
│   |   |── style/
│   |   └── image/
│   |   └── ...
│   |── directives/             # 指令
│   |   └── ...
│   |── utils/                  # 工具库
│   |   └── ...
│   └── mixins/                 # 全局操作
```

## 子模块

```
1. 在现有仓库中增加子模块：
git submodule add + 地址
查看上面命令执行后现有仓库根目录有哪些变化 ：增加了1个文件和一个目录：.gitmodules和DbConnector文件夹

2. 更新子模块的master分支
  初始化子模块：git submodule init
  更新子模块：git submodule update
  拉取所有子模块：git submodule foreach git pull origin master
```