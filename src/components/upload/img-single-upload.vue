<style>
  .uploadAlert {
    float: left;
    top: 0px;
    left: 110px;
    position: absolute;
  }
</style>
<template>
  <div>
    <Upload style="margin-bottom: 10px;" :action="uploadUrl" with-credentials
            :format="format"
            :show-upload-list="false" :max-size="size"
            :on-exceeded-size="showExceededError" :on-format-error="showFormatError"
            :on-success="showUploadSuccess">
      <Button icon="ios-cloud-upload-outline">{{btnText}}</Button>
    </Upload>
    <Alert class="uploadAlert" :class="{hidden: !errorText}" type="error">
      {{errorText}}
    </Alert>
    <img :src="previewUrl" :width="previewWidth" :height="previewHeight"/>
  </div>
</template>

<script>
  import {Message} from 'iview'
  import uploadPlaceholder from '@/assets/images/upload-placeholder.png'

  export default {
    name: 'ImgSingleUpload',
    components: {},
    props: [
      'index',
      'formats',
      'maxSize',
      'uploadUrl',
      'previewUri',
      'btnText',
      'imgPrefix',
      'width',
      'height'
    ],
    data() {
      let format = this.formats ? this.formats : ['png']
      let size = this.maxSize ? parseInt(this.maxSize) : 3000
      let previewWidth = this.width ? this.width : 'auto'
      let previewHeight = this.height ? this.height : 'auto'
      let originalWidth = previewWidth
      let originalHeight = previewHeight
      return {
        format,
        size,
        previewWidth,
        previewHeight,
        originalWidth,
        originalHeight,
        errorText: null
      }
    },
    methods: {
      showFormatError() {
        this.errorText = '文件类型只能是' + this.format.join(',')
      },
      showUploadSuccess(response, file, fileList) {
        this.previewUrl = response.data
        this.errorText = ''
        Message.success('上传成功')
      },
      showExceededError() {
        this.errorText = '文件大小必须在' + this.size + 'KB以内'
      },
    },
    computed: {
      previewUrl: {
        get() {
          let hasPreview = this.previewUri != null
          if (!hasPreview) {
            this.previewWidth = 'auto'
            this.previewHeight = 'auto'
          } else {
            this.previewWidth = this.originalWidth
            this.previewHeight = this.originalHeight
          }
          return hasPreview ? this.imgPrefix + this.previewUri : uploadPlaceholder
        },
        set(url) {
          this.$emit('setPreviewUrl', url, this.index)
        }
      },
    },
  }
</script>
