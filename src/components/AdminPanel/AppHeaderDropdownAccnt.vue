<template>
  <CDropdown>
    <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
      <CAvatar :src="avatar" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownItem>
        <div class="d-flex align-items-center">
          <CIcon icon="cil-user" class="mr-2" />
          {{ username }}
        </div>
      </CDropdownItem>
      <CDropdownItem @click="logout">
        <CIcon icon="cil-lock-locked" class="mr-2" />
        Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
import { ref } from "vue";
import {
  CDropdown,
  CDropdownToggle,
  CAvatar,
  CDropdownMenu,
  CDropdownItem,
} from "@coreui/vue";
import CIcon from "@coreui/icons-vue";

export default {
  props: ["username"],
  components: {
    CDropdown,
    CDropdownToggle,
    CAvatar,
    CDropdownMenu,
    CDropdownItem,
    CIcon,
  },
  setup(props, { emit }) {
    const avatar = ref(require("@/assets/images/avatars/8.jpg"));

    const logout = () => {
      // Emit the logout event to the parent component
      emit("logout");
    };

    return {
      avatar,

      logout,
    };
  },
};
</script>
