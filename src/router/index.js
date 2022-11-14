import Vue from 'vue';
import Router from 'vue-router';
import { baseRouter } from '@/router/routers';

// hack router push callback
const originalPush = Router.prototype.push;
Router.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

Vue.use(Router);

// 创建路由
const createRouter = () =>
  new Router({
    mode: 'history',
    routes: baseRouter
  });

const router = createRouter();

// 定义一个 resetRouter 方法，在退出登录后或 token 过期后 需要重新登录时，调用即可
export function resetRouter () {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
