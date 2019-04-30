<template>
  <div>
    <Upload class="float-left margin-right-10" :action="uploadUrl" with-credentials :format="format"
            :show-upload-list="false" :max-size="size"
            :on-exceeded-size="showExceededError" :on-format-error="showFormatError"
            :on-progress="showUploadProgress"
            :on-error="showUploadError"
            :on-success="showUploadSuccess">
      <Button :loading="loading" icon="ios-cloud-upload-outline">{{btnText}}</Button>
    </Upload>
    <img class="float-left margin-right-10" :src="previewUrl" :width="previewWidth" :height="previewHeight"/>
    <Alert class="float-left" :class="{hidden: !errorText}" type="error">{{errorText}}</Alert>
  </div>
</template>

<script>
  import {Message} from 'iview'

  export default {
    name: 'ImgOneLineUpload',
    components: {},
    props: [
      'formats',
      'maxSize',
      'uploadUrl',
      'previewUri',
      'btnText',
      'imgPrefix',
      'width',
      'height',
      'uploadPlaceholder'
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
        errorText: null,
        loading: false
      }
    },
    methods: {
      showUploadError() {
        this.loading = false
      },
      showUploadProgress() {
        this.loading = true
        this.errorText = ''
      },
      showFormatError() {
        this.errorText = '文件类型只能是' + this.format.join(',')
      },
      showUploadSuccess(response, file, fileList) {
        this.loading = false
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
          return hasPreview ? this.imgPrefix + this.previewUri : this.uploadPlaceholder
        },
        set(url) {
          this.$emit('setPreviewUrl', url)
        }
      },
    },
  }
</script>
