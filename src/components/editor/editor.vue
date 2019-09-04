<style scoped lang="less">
  .toolbar {
    border: 1px solid #ccc;
  }
  .text {
    border: 1px solid #ccc;
    height: 2000px;
  }
  .editor-wrapper *{
    z-index: 10 !important;
  }
</style>

<template>
  <div class="editor-wrapper">
    <div :id="editorId + '-toolbar'" class="toolbar"></div>
    <div :id="editorId + '-text'" class="text"></div>
  </div>
</template>

<script>
  import Editor from 'wangeditor'
  import 'wangeditor/release/wangEditor.min.css'
  import { oneOf } from '@/libs/tools'
  import config from '@/config/index'
  export default {
    name: 'Editor',
    props: {
      uploadUrl: {
        type: String,
        default: ''
      },
      value: {
        type: String,
        default: ''
      },
      /**
       * 绑定的值的类型, enum: ['html', 'text']
       */
      valueType: {
        type: String,
        default: 'html',
        validator: (val) => {
          return oneOf(val, ['html', 'text'])
        }
      },
      /**
       * @description 设置change事件触发时间间隔
       */
      changeInterval: {
        type: Number,
        default: 200
      },
      /**
       * @description 是否开启本地存储
       */
      cache: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      editorId () {
        return `editor${this._uid}`
      }
    },
    methods: {
      setHtml (val) {
        this.editor.txt.html(val)
      }
    },
    mounted () {
      this.editor = new Editor(`#${this.editorId}-toolbar`, `#${this.editorId}-text`)
      // this.editor.customConfig.uploadImgShowBase64 = true
      this.editor.customConfig.uploadImgServer = this.uploadUrl
      this.editor.customConfig.withCredentials = true
      this.editor.customConfig.uploadFileName = 'files'
      this.editor.customConfig.uploadImgTimeout = 300000
      this.editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024
      this.editor.customConfig.uploadImgMaxLength = 10
      const loadUrl = this.loadUrl
      this.editor.customConfig.uploadImgHooks = {
        // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
        // （但是，服务器端返回的必须是一个 JSON 格式字符串！！！否则会报错）
        customInsert: function (insertImg, result, editor) {
          // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
          // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

          // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
          for(let i in result.data) {
            insertImg(config.publicBucketDomain + result.data[i])
          }

          // result 必须是一个 JSON 格式字符串！！！否则报错
        }
      }
      this.editor.customConfig.onchange = (html) => {
        let text = this.editor.txt.text()
        if (this.cache) localStorage.editorCache = html
        this.$emit('input', this.valueType === 'html' ? html : text)
        this.$emit('on-change', html, text)
      }
      this.editor.customConfig.onchangeTimeout = this.changeInterval
      // create这个方法一定要在所有配置项之后调用
      this.editor.create()
      // 如果本地有存储加载本地存储内容
      let html = this.value || localStorage.editorCache
      if (html) this.editor.txt.html(html)
    }
  }
</script>

