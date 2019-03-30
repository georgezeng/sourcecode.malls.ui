<template>
  <div>
    <Card>
      <p slot="title">
        {{ action }}权限
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="back" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="编码" prop="code">
          <Input v-model="form.code" :readonly="readOnly"></Input>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="form.name" placeholder="输入名称"></Input>
        </FormItem>
        <FormItem label="请求链接" prop="link">
          <Input v-model="form.link" placeholder="输入链接"></Input>
        </FormItem>
        <FormItem label="请求方法">
          <Select v-model="form.method" style="width:200px">
            <Option v-for="method in methods" :value="method" :key="method">{{ method }}</Option>
          </Select>
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input v-model="form.description" type="textarea" :autosize="{minRows: 2, maxRows: 5}"
                 placeholder="输入关于权限的一些描述"></Input>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/authority'
  import {Message} from 'iview'

  export default {
    name: 'UserEdit',
    components: {},
    data() {
      return {
        loading: false,
        form: {
          id: null,
          username: '',
          email: '',
          password: '',
          mobile: '',
          enabled: true,
          roles: []
        },
        methods: [
          'GET', 'POST', 'PUT', 'DELETE'
        ],
        rules: {
          code: [
            {required: true, message: '编码不能为空', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ],
          link: [
            {required: true, message: '链接不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      load() {
        if (this.form.id) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
            this.loading = false
          }).catch(ex => {
            this.loading = false
          })
        }
      },
      save() {
        this.$refs.form.validate().then(valid => {
          if (valid) {
            this.loading = true
            API.save(this.form).then(res => {
              this.loading = false
              Message.success('保存成功')
              this.back()
            }).catch(ex => {
              this.loading = false
            })
          }
        })
      },
      back() {
        this.$store.commit('closeTag', this.$router.currentRoute)
        this.$router.push({
          name: 'AuthorityList'
        })
      }
    },
    computed: {
      action() {
        return this.readOnly ? '编辑' : '新增'
      },
      readOnly() {
        return this.form.id != null && this.form.id != 0
      }
    },
    mounted: function () {
      this.form.id = this.$router.currentRoute.params.id
      this.form.id = this.form.id != 0 ? this.form.id : null;
      this.load()
    }
  }
</script>
