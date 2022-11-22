import store from '@/store';

export default {
  inserted: (el, binding) => {
    // 获得按钮权限
    const rules = store.state.user.btnPermissionsList;

    const hasPermission = rules.includes(binding.value.rule);
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  }
};
