<template>
  <Menubar :model="routes">
    <template #item="{ item, props, hasSubmenu }">
      <RouterLink v-slot="{ href, navigate }" :to="item.route" custom>
        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
        </a>
      </RouterLink>
    </template>
  </Menubar>
  <Panel class="main-panel">
    <RouterView />
  </Panel>
</template>

<script setup>
const routes = [
  { route: '/', label: 'Adauga o intrebare', icon: 'pi pi-clipboard' },
  { route: '/list', label: 'Lista intrebarilor', icon: 'pi pi-list' },
  { route: '/settings', label: 'Setari', icon: 'pi pi-cog' },
];

document.addEventListener('contextmenu', (evt) => {
  evt.preventDefault();
});
</script>

<style scoped lang="scss">
.main-panel {
  margin-top: 0.5rem;
  height: calc(100vh - (52px + 1.5rem));

  overflow: auto;
}
</style>
