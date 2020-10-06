<template>
  <div >
    <span v-if="matTypeUnit.child == undefined || JSON.stringify(matTypeUnit.child) == '{}'">
      {{matTypeUnit.matTypeUnit}}
    </span>
    <last-unit v-else :matTypeUnit="matTypeUnit.child"></last-unit>
  </div>
</template>
<script>
  export default {
    name: 'lastUnit',
    props: {
      matTypeUnit: {
        type: Object,
        default: function () {
          return {}
        }
      },
    }
  }
</script>
