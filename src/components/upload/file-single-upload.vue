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
            :on-progress="showUploadProgress"
            :on-error="showUploadError"
            :on-exceeded-size="showExceededError" :on-format-error="showFormatError"
            :on-success="showUploadSuccess">
      <Button :loading="loading" :icon="btnIcon">{{btnText}}</Button>
    </Upload>
    <Alert class="uploadAlert" v-if="uploaded" type="success">
      上传成功
    </Alert>
    <Alert class="uploadAlert" v-if="showErrorText" type="error">
      {{showErrorText}}
    </Alert>
  </div>
</template>

<script>
  import {Message} from 'iview'
  import uploadPlaceholder from '@/assets/images/upload-placeholder.png'

  export default {
    name: 'ImgSingleUpload',
    components: {},
    props: [
      'btnIcon',
      'formats',
      'maxSize',
      'uploadUrl',
      'previewUri',
      'btnText',
      'imgPrefix',
      'loading',
      'tempErrorText'
    ],
    data() {
      let format = this.formats ? this.formats : ['png']
      let size = this.maxSize ? parseInt(this.maxSize) : 3000
      return {
        format,
        size,
        errorText: null,
        uploaded: false
      }
    },
    computed: {
      showErrorText() {
        return this.tempErrorText ? this.tempErrorText : this.errorText
      }
    },
    methods: {
      showUploadError() {
        this.$emit('clearTempErrorText')
        this.$emit('setLoading', false)
        this.errorText = '上传失败'
      },
      showUploadProgress() {
        this.errorText = ''
        this.$emit('clearTempErrorText')
        this.uploaded = false
        this.$emit('setLoading', true)
      },
      showFormatError() {
        this.$emit('clearTempErrorText')
        this.errorText = '文件类型只能是' + this.format.join(',')
      },
      showUploadSuccess(response, file, fileList) {
        this.$emit('setLoading', false)
        this.$emit('setPreviewUrl', response.data)
        this.$emit('clearTempErrorText')
        this.errorText = ''
        this.uploaded = true
        Message.success('上传成功')
      },
      showExceededError() {
        this.$emit('clearTempErrorText')
        this.errorText = '文件大小必须在' + this.size + 'KB以内'
      },
    },
  }
</script>
