<template>
  <div style="float: left; margin-right: 50px; position: relative;">
    <img :src="previewUrl" width="180" height="180"
         class="float-left" style="margin-right: 20px;"/>
  </div>
</template>

<script>
  import {Message} from 'iview'
  import uploadPlaceholder from '@/assets/images/upload-placeholder.png'

  export default {
    name: 'MerchantShopApplicationDetailImg',
    components: {},
    props: [
      'url',
      'imgPrefix',
    ],
    computed: {
      previewUrl: {
        get() {
          return this.url ? this.imgPrefix + this.url : uploadPlaceholder
        },
      },
    },
  }
</script>
