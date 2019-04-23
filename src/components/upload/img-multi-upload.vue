<style>
  .removeBtn {
    top: 0px;
    left: 139px;
    position: absolute;
    border-radius: 0px;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
  }
</style>
<template>
  <div style="float: left; margin-right: 50px; position: relative;">
    <Upload style="margin-bottom: 10px;" :action="uploadUrl" with-credentials
            :format="format"
            :show-upload-list="false" :max-size="size"
            :on-exceeded-size="showExceededError" :on-format-error="showFormatError"
            :on-success="showUploadSuccess">
      <Button icon="ios-cloud-upload-outline">{{btnText}}</Button>
    </Upload>
    <Button class="removeBtn" type="error" @click="remove" icon="md-trash"
            :style="{display: !removeable ? 'none': 'inherit'}"></Button>
    <Alert :class="{hidden: !errorText}" type="error">
      {{errorText}}
    </Alert>
    <img :src="previewUrl" :width="previewWidth" :height="previewHeight"/>
  </div>
</template>

<script>
  import {Message} from 'iview'
  import uploadPlaceholder from '@/assets/images/upload-placeholder.png'

  export default {
    name: 'ImgMultiUpload',
    components: {},
    props: [
      'removeable',
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
      remove() {
        this.$emit('remove', this.index)
      }
    },
    computed: {
      previewUrl: {
        get() {
          let hasPreview = this.previewUri != null && this.previewUri !== uploadPlaceholder
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
