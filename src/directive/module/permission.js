import store from '@/store';

export default {
  inserted: (el, binding) => {
    console.log('permissions:', store.state.user.permissions);

    const rules = store.getters.roles;
    const hasPermission = rules.includes(binding.value.rule);
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el);
    }
  }
};
