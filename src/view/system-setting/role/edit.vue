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
          <MultiSelectors :leftList="authLeftList" :rightList="authRightList" :originLeftList="originAuthLeftList"
                          :originRightList="originAuthRightList" @set-multi-selectors-data="setAuthLists"/>
        </FormItem>
        <FormItem label="用户">
          <MultiSelectors :leftList="userLeftList" :rightList="userRightList" :originLeftList="originUserLeftList"
                          :originRightList="originUserRightList" @set-multi-selectors-data="setUserLists"/>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  import API from '@/api/role'
  import AuthAPI from '@/api/authority'
  import UserAPI from '@/api/users'
  import MultiSelectors from '@/components/multi-selectors/multi-selectors'
  import { Message } from 'iview'

  export default {
    name: 'RoleEdit',
    components: {
      MultiSelectors
    },
    data () {
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
        authorities: [],
        authLeftList: [],
        authRightList: [],
        originAuthLeftList: [],
        originAuthRightList: [],
        users: [],
        userLeftList: [],
        userRightList: [],
        originUserLeftList: [],
        originUserRightList: [],
        rules: {
          code: [
            { required: true, message: '编码不能为空', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '角色名不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      load () {
        if (this.form.id) {
          this.loading = true
          API.load(this.form.id).then(data => {
            this.form = data
            let arr = []
            for (let i in data.authorities) {
              let item = data.authorities[i]
              arr.push({
                key: item.id,
                text: item.name,
                selected: false
              })
            }
            this.authRightList = arr
            this.originAuthRightList = arr.concat()
            arr = []
            for (let i in data.users) {
              let item = data.users[i]
              arr.push({
                key: item.id,
                text: item.username,
                selected: false
              })
            }
            this.userRightList = arr
            this.originUserRightList = arr.concat()
            this.loading = false
          }).catch(ex => {
            this.loading = false
          })
        }
      },
      loadAuthorities () {
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
                text: item.name,
                selected: false
              })
            }
            this.authLeftList = arr
            this.originAuthLeftList = arr.concat()
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
                text: item.username,
                selected: false
              })
            }
            this.userLeftList = arr
            this.originUserLeftList = arr.concat()
          }
          this.loading = false
        }).catch(ex => {
          this.loading = false
        })
      },
      save () {
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
      goList () {
        this.$router.push({
          name: 'RoleList'
        })
      },
      setAuthLists (leftList, rightList, reload) {
        this.authLeftList = leftList
        this.authRightList = rightList
        if (reload) {
          this.originAuthLeftList = leftList.concat()
          this.originAuthRightList = rightList.concat()

          this.form.authorities = []
          for (let i in rightList) {
            let item = rightList[i]
            this.form.authorities.push({
              id: item.key,
              name: item.text,
              selected: item.selected
            })
          }

          this.authorities = []
          for (let i in leftList) {
            let item = leftList[i]
            this.authorities.push({
              id: item.key,
              name: item.text,
              selected: item.selected
            })
          }
        }
      },
      setUserLists (leftList, rightList, reload) {
        this.userLeftList = leftList
        this.userRightList = rightList
        if (reload) {
          this.originUserLeftList = leftList.concat()
          this.originUserRightList = rightList.concat()

          this.form.users = []
          for (let i in rightList) {
            let item = rightList[i]
            this.form.users.push({
              id: item.key,
              username: item.text,
              selected: item.selected
            })
          }

          this.users = []
          for (let i in leftList) {
            let item = leftList[i]
            this.users.push({
              id: item.key,
              username: item.text,
              selected: item.selected
            })
          }
        }
      }
    },
    computed: {
      action () {
        return this.readOnly ? '编辑' : '新增'
      },
      readOnly () {
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
