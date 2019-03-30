<template>
  <div>
    <Card>
      <p slot="title">
        {{ action }}用户
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="back" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="用户名" prop="username">
          <Input v-model="form.username" :readonly="isEdit"></Input>
        </FormItem>
        <FormItem label="邮箱" prop="email">
          <Input v-model="form.email" placeholder="输入邮箱"></Input>
        </FormItem>
        <FormItem label="密码" prop="password" :class="{hidden: isEdit}">
          <Input v-model="form.password" :readonly="isEdit"></Input>
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input v-model="form.mobile" placeholder="输入手机号"></Input>
        </FormItem>
        <FormItem label="头像" prop="header">
          <Upload class="float-left margin-right-10" :action="uploadUrl" with-credentials :format="uploadFormat"
                  :show-upload-list="false" :max-size="3000"
                  :on-exceeded-size="showExceededError" :on-format-error="showFormatError"
                  :on-success="showUploadSuccess">
            <Button icon="ios-cloud-upload-outline">上传头像</Button>
          </Upload>
          <img class="float-left margin-right-10" :src="imgPreviewUrl" width="32" height="32"/>
          <Alert class="float-left" :class="{hidden: !uploadErrorText}" type="error">{{uploadErrorText}}</Alert>
        </FormItem>
        <FormItem label="状态">
          <Select v-model="form.enabled" style="width:200px">
            <Option v-for="status in statusList" :value="status.value" :key="status.value">{{ status.text }}</Option>
          </Select>
        </FormItem>
        <FormItem label="角色">
          <MultiSelectors :leftList="roleLeftList" :rightList="roleRightList" :originLeftList="originRoleLeftList"
                          :originRightList="originRoleRightList" @set-multi-selectors-data="setRoleLists"/>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/users'
  import RoleAPI from '@/api/role'
  import MultiSelectors from '@/components/multi-selectors/multi-selectors'
  import {Message} from 'iview'
  import config from '@/config/index'

  let baseUrl = null
  let bucketDomain = null
  switch (process.env.NODE_ENV) {
    case 'development': {
      baseUrl = config.baseUrl.dev
      bucketDomain = config.publicBucketDomain.dev
    }
      break;
    default: {
      baseUrl = config.baseUrl.pro
      bucketDomain = config.publicBucketDomain.pro
    }
  }

  export default {
    name: 'UserEdit',
    components: {
      MultiSelectors
    },
    data() {
      return {
        loading: false,
        uploadFormat: ['png'],
        uploadErrorText: '',
        form: {
          id: null,
          username: '',
          email: '',
          password: '',
          mobile: '',
          enabled: 'true',
          header: 'common/header.png',
          roles: []
        },
        statusList: [
          {text: '使用中', value: 'true'},
          {text: '禁用中', value: 'false'}
        ],
        roles: [],
        roleLeftList: [],
        roleRightList: [],
        originRoleLeftList: [],
        originRoleRightList: [],
        rules: {
          username: [
            {required: true, message: '用户名不能为空', trigger: 'change'},
            {min: 3, message: '用户名不能少于3位', trigger: 'change'},
            {max: 15, message: '用户名不能多于15位', trigger: 'change'}
          ],
          email: [
            {required: true, message: '邮箱不能为空', trigger: 'change'},
            {type: 'email', message: '邮箱格式不正确', trigger: 'change'},
            {max: 50, message: '邮箱不能多于50位', trigger: 'change'}
          ],
          password: [
            {required: !this.isEdit, message: '密码不能为空', trigger: 'change'},
            {
              type: 'string',
              pattern: /^(?=.*[0-9].*)(?=.*[A-Za-z].*).{8,}$/,
              message: '密码必须数字+字母（区分大小写）并且不少于8位',
              trigger: 'change'
            },
            {max: 20, message: '密码不能多于20位', trigger: 'change'}
          ],
          mobile: [
            {type: 'string', pattern: /^\d{11}$/, message: '手机号必须是11位数字', trigger: 'change'}
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
            this.form.enabled = data.enabled === true ? 'true' : 'false'
            let arr = []
            for (let i in data.roles) {
              let item = data.roles[i]
              arr.push({
                key: item.id,
                text: item.name,
                selected: false
              })
            }
            this.roleRightList = arr
            this.originRoleRightList = arr.concat()
            this.loading = false
          }).catch(ex => {
            this.loading = false
          })
        }
      },
      loadRoles() {
        this.loading = true
        RoleAPI.list({
          data: null,
          page: {
            num: 1,
            size: 99999999,
            property: 'name',
            order: 'ASC'
          }
        }).then(result => {
          if (result.total > 0) {
            let arr = []
            for (let i in result.list) {
              let item = result.list[i]
              arr.push({
                key: item.id,
                text: item.name,
                selected: false
              })
            }
            this.roleLeftList = arr
            this.originRoleLeftList = arr.concat()
          }
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
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
          name: 'UserList'
        })
      },
      setRoleLists(leftList, rightList, reload) {
        this.roleLeftList = leftList
        this.roleRightList = rightList
        if (reload) {
          this.originRoleLeftList = leftList.concat()
          this.originRoleRightList = rightList.concat()

          this.form.roles = []
          for (let i in rightList) {
            let item = rightList[i]
            this.form.roles.push({
              id: item.key,
              name: item.text,
              selected: item.selected
            })
          }

          this.roles = []
          for (let i in leftList) {
            let item = leftList[i]
            this.roles.push({
              id: item.key,
              name: item.text,
              selected: item.selected
            })
          }
        }
      },
      showFormatError() {
        this.uploadErrorText = '文件类型只能是png'
      },
      showUploadSuccess(response, file, fileList) {
        this.uploadErrorText = ''
        this.imgPreviewUrl = response.data
        Message.success('上传成功')

      },
      showExceededError() {
        this.uploadErrorText = '文件大小必须在3000KB以内'
      }
    },
    computed: {
      action() {
        return this.isEdit ? '编辑' : '新增'
      },
      isEdit() {
        return this.form.id != null && this.form.id != 0
      },
      uploadUrl() {
        return baseUrl + '/user/upload/header/p/' + (this.isEdit ? this.form.id : '0')
      },
      imgPreviewUrl: {
        get() {
          return bucketDomain + this.form.header
        },
        set(url) {
          this.form.header = url
        }
      }
    },
    mounted: function () {
      this.form.id = this.$router.currentRoute.params.id
      this.form.id = this.form.id != 0 ? this.form.id : null;
      this.load()
      this.loadRoles()
    }
  }
</script>
