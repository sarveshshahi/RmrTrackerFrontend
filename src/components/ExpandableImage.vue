<template>
  <div class="expandable-image" :class="{ expanded }" @click="toggleExpanded">
    <i v-if="expanded" class="close-button" @click="closeImage">
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="#666666" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
      </svg>
    </i>
    <i v-else class="expand-button">
      <svg style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="#000000" d="M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z" />
      </svg>
    </i>
    <img v-bind="$attrs" />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  data() {
    return {
      expanded: false,
      cloned: null,
      closeButtonRef: null,
    };
  },
  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded;
    },
    closeImage() {
      this.expanded = false;
      this.cloned.style.opacity = 0;
      setTimeout(() => {
        this.closeButtonRef.removeEventListener('click', this.closeImage);
        this.cloned.remove();
        this.cloned = null;
        this.closeButtonRef = null;
        document.body.style.overflow = 'auto';
      }, 250);
    },
  },
  watch: {
    expanded(expanded) {
      this.$nextTick(() => {
        if (expanded) {
          this.cloned = this.$el.cloneNode(true);
          this.closeButtonRef = this.cloned.querySelector('.close-button');
          this.closeButtonRef.addEventListener('click', this.closeImage);
          document.body.appendChild(this.cloned);
          document.body.style.overflow = 'hidden';
          setTimeout(() => {
            this.cloned.style.opacity = 1;
          }, 0);
        } else {
          this.cloned.style.opacity = 0;
          setTimeout(() => {
            this.closeButtonRef.removeEventListener('click', this.closeImage);
            this.cloned.remove();
            this.cloned = null;
            this.closeButtonRef = null;
            document.body.style.overflow = 'auto';
          }, 250);
        }
      });
    },
  },
};
</script>
<style>
.expandable-image {
  position: relative;
  transition: 0.25s opacity;
  cursor: zoom-in;
}

body > .expandable-image.expanded {
  position: fixed;
  z-index: 999999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
}

body > .expandable-image.expanded > img {
  max-width: 90%;
  max-height: 80vh;
  object-fit: contain;
}

body > .expandable-image.expanded > .close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  color: white;
  cursor: pointer;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  color: #666666;
  cursor: pointer;
}

.expand-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  color: white;
  cursor: pointer;
  opacity: 0;
  transition: 0.2s opacity;
}

.expandable-image:hover .expand-button {
  opacity: 1;
}

.expandable-image img {
  width: 100%;
  height: auto;
}
</style>
