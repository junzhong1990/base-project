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

## 组件库说明

```
1. 往public新增修改文件
  方式一：没在配有eslint项目中，则在dev分支的xbase下的public下增加，运行xbase项目，保证增加的组件方法没有eslint问题，
  添加完毕后，执行yarn top更新到外层public。
  方式二：在配置了elsint项目中，则在dev分支的public目录下修改，然后执行sh upbase.sh命令更新到xbase的public
  前提：保证没有eslint报错
2. 不允许在prod分支做修改提交，在dev分支增删改完毕后，切换到prod分支，执行sh update.sh合并dev的最新文件过来prod分支
```
