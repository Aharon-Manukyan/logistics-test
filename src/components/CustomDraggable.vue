<template>
  <div
    ref="draggable"
    class="draggable"
    @mousedown="startDrag"
    @touchstart="startDrag"
    @mouseup="endDrag"
    @touchend="endDrag"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { ref } from "vue";

const draggable = ref(null);
const startPosition = { x: 0, y: 0 };

const startDrag = (event) => {
  // Logic for starting dragging
  console.log(event, "aee");
};

const endDrag = () => {
  // Logic for ending dragging
};
</script>

<style scoped>
.draggable {
  cursor: grab;
}
</style>
