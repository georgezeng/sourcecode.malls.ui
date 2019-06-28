<template>
  <div>
    <Card>
      <p slot="title">
        {{ action }}角色
      </p>
      <div slot="extra">
        <Button @click="save" type="primary" class="margin-right" :loading="loading">保存</Button>
        <Button @click="goList" type="success">返回</Button>
      </div>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem label="编码" prop="code">
          <Input v-model="form.code" :readonly="readOnly"></Input>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="form.name" placeholder="输入角色名"></Input>
        </FormItem>
        <FormItem label="描述" prop="description">
          <Input v-model="form.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="输入关于角色的一些描述"></Input>
        </FormItem>
        <FormItem label="权限">
          <Transfer
            :data="authLeftList"
            :target-keys="authRightList"
            filterable
            :list-style="{width: '300px', height: '400px'}"
            :filter-method="filterList"
            @on-change="changeTargetAuth"></Transfer>
        </FormItem>
        <FormItem label="用户">
          <Transfer
            :data="userLeftList"
            :target-keys="userRightList"
            filterable
            :list-style="{width: '300px', height: '400px'}"
            :filter-method="filterList"
            @on-change="changeTargetUser"></Transfer>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/role'
  import AuthAPI from '@/api/authority'
  import UserAPI from '@/api/users'
  import {Message} from 'iview'

  export default {
    name: 'RoleEdit',
    components: {
    },
    data() {
      return {
        loading: false,
        form: {
          id: null,
          name: '',
          code: '',
          description: '',
          authorities: [],
          users: []
        },
        authLeftList: [],
        authRightList: [],
        userLeftList: [],
        userRightList: [],
        rules: {
          code: [
            {required: true, message: '编码不能为空', trigger: 'blur'},
            {max: 50, message: '编码不能多于50位', trigger: 'change'}
          ],
          name: [
            {required: true, message: '角色名不能为空', trigger: 'blur'},
            {max: 50, message: '角色名不能多于50位', trigger: 'change'}
          ],
          description: [
            {max: 255, message: '描述不能多于255位', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      filterList(data, query) {
        return data.label.indexOf(query) > -1;
      },
      changeTargetUser(newTargetKeys) {
        this.userRightList = newTargetKeys;
        this.form.users = []
        for (let i in this.userRightList) {
          const key = this.userRightList[i]
          for (let j in this.userLeftList) {
            const item = this.userLeftList[j]
            if (item.key == key) {
              this.form.users.push({
                id: key
              })
              break
            }
          }
        }
      },
      changeTargetAuth(newTargetKeys) {
        this.authRightList = newTargetKeys;
        this.form.authorities = []
        for (let i in this.authRightList) {
          const key = this.authRightList[i]
          for (let j in this.authLeftList) {
            const item = this.authLeftList[j]
            if (item.key == key) {
              this.form.authorities.push({
                id: key
              })
              break
            }
          }
        }
      },
      load() {
        if (this.form.id) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
            let arr = []
            for (let i in data.authorities) {
              let item = data.authorities[i]
              arr.push(item.id)
            }
            this.authRightList = arr
            arr = []
            for (let i in data.users) {
              let item = data.users[i]
              arr.push(item.id)
            }
            this.userRightList = arr
            this.loading = false
          }).catch(ex => {
            this.loading = false
          })
        }
      },
      loadAuthorities() {
        this.loading = true
        AuthAPI.list({
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
                label: item.name
              })
            }
            this.authLeftList = arr
          }
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      },
      loadUsers() {
        this.loading = true
        UserAPI.list({
          data: null,
          page: {
            num: 1,
            size: 99999999,
            property: 'username',
            order: 'ASC'
          }
        }).then(result => {
          if (result.total > 0) {
            let arr = []
            for (let i in result.list) {
              let item = result.list[i]
              arr.push({
                key: item.id,
                label: item.username
              })
            }
            this.userLeftList = arr
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
              this.goList()
            }).catch(ex => {
              this.loading = false
            })
          }
        })
      },
      goList() {
        this.$router.push({
          name: 'RoleList'
        })
      },
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
      this.loadAuthorities()
      this.loadUsers()
    }
  }
</script>
