# 电商网后台管理系统简介
> 整个系统基于 [Ant Design Pro of Vue](https://pro.antdv.com/) 搭建，整个系统由登录、工作台、用户管理、角色管理、菜单管理等模块组成，系统中包含了角色权限分配、登录等功能。

## 技术栈
vue + vuex + vue-router + axios + ant-desigin-vue + ESLint + ES6/7

## 运行项目

```
# 将项目克隆到本地
git clone https://github.com/meishadevs/store-admin.git

# 进入 store-admin 目录下
cd store-admin

# 安装依赖
npm install

# 运行项目
npm run dev

# 编译并压缩代码用于发布，将编译后生成的dist文件夹放在服务器下即可访问
npm run build
```

## 配置系统的服务端
系统服务端配置请移步到电商网服务端项目：[https://github.com/meishadevs/store-node](https://github.com/meishadevs/store-node)

## 特别说明
当你的服务端地址和我设置的服务端地址不同时，可以修改 \src\config 下的 index.js 文件

```
export default {
   // api 请求基础路径
   baseUrl: {
     dev: 'http://localhost:8002',
     pro: 'http://localhost:8002'
   }
};
```
