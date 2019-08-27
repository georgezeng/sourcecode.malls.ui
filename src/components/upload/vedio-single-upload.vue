<style>
  .uploadAlert {
    float: left;
    top: -2px;
    position: absolute;
  }
</style>
<template>
  <div>
    <Upload style="margin-bottom: 10px;" :action="uploadUrl" with-credentials
            :format="format"
            :show-upload-list="false" :max-size="size"
            :on-progress="showUploadProgress"
            :on-error="showUploadError"
            :on-exceeded-size="showExceededError" :on-format-error="showFormatError"
            :on-success="showUploadSuccess">
      <Button :loading="loading" icon="ios-cloud-upload-outline">{{btnText}}</Button>
    </Upload>
    <Alert class="uploadAlert" :style="{left: alertLeft ? alertLeft : '110px'}" :class="{hidden: !errorText}" type="error">
      {{errorText}}
    </Alert>
    <video :src="previewUrl" :width="previewWidth" :height="previewHeight" :autoplay="autoplay" controls>
    </video>
  </div>
</template>

<script>
  import {Message} from 'iview'
  import uploadPlaceholder from '@/assets/images/upload-placeholder.png'
  import {
    setTagNavListInLocalstorage,
    setToken
  } from '@/libs/util'

  export default {
    components: {},
    props: [
      'formats',
      'maxSize',
      'uploadUrl',
      'previewUri',
      'btnText',
      'vedioPrefix',
      'width',
      'alertLeft',
      'autoplay',
      'height'
    ],
    data() {
      let format = this.formats ? this.formats : ['mp4']
      let size = this.maxSize ? parseInt(this.maxSize) : 20000
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
        this.errorText = '上传失败'
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
        if (response.code == 0) {
          this.previewUrl = response.data
          this.errorText = ''
          Message.success('上传成功')
        } else if(response.code == -1) {
          setTagNavListInLocalstorage([])
          setToken('')
          this.$router.push({
            name: 'Login'
          })
        } else {
          this.errorText = response.msgs[0]
        }
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
          return hasPreview ? this.vedioPrefix + this.previewUri : uploadPlaceholder
        },
        set(url) {
          this.$emit('setPreviewUrl', url)
        }
      },
    },
  }
</script>
