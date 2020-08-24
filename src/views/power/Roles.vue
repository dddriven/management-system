<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item to="{path: '/home'}">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
				</el-col>
			</el-row>
			<el-table :data="roleList" border stripe>
				<el-table-column type="expand">
					<template slot-scope="scope">
						<el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
							<el-col :span="5">
								<el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<el-col :span="19">
								<el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
									<el-col :span="6">
										<el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<el-col :span="18">
										<el-tag type="warning" v-for="(item3, i3) in item2.children"
														:key="item3.id" closable @close="removeRightById(scope.row, item3.id)">
											{{item3.authName}}
										</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column label="操作" width="300px">
					<template slot-scope="scope">
						<el-button size="mini" type="primary" icon="el-icon-edit"
												@click="showRoleEditDialog(scope.row.id)">编辑</el-button>
						<el-button size="mini" type="danger" icon="el-icon-delete"
												@click="removeRoleById(scope.row.id)">删除</el-button>
						<el-button size="mini" type="warning" icon="el-icon-setting"
											@click="showSetRightDialog(scope.row)">分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<el-dialog title="分配权限" :visible.sync="setRightDialogVisible"
								width="50%" @close="setRightDialogClosed">
			<el-tree :data="rightsList" :props="treeProps" show-checkbox
								node-key="id" :default-expand-all="true"
								:default-checked-keys="defKeys" ref="treeRef"></el-tree>
			<span slot="footer" class="dialog-footer">
				<el-button @click="setRightDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="allotRights">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="添加用户"
							:visible.sync="addRoleDialogVisible"
							width="50%"
							@close="addRoleDialogClosed">
			<el-form :model="addRoleForm"
							:rules="addRoleFormRules"
							ref="addRoleFormRef"
							label-width="70px">
				<el-form-item label="角色名称" prop="roleName ">
					<el-input v-model="addRoleForm.roleName "></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDesc ">
					<el-input v-model="addRoleForm.roleDesc "></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addRoleDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addRole">确 定</el-button>
			</span>
		</el-dialog>
		<el-dialog title="修改角色" :visible.sync="editRoleDialogVisible" width="50%">
			<el-form :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef" label-width="90px">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="editRoleForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDesc">
					<el-input v-model="editRoleForm.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editRoleDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editRoleInfo">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "Roles",
		data() {
			return {
				roleList: [],
				setRightDialogVisible: false,
				rightsList: [],
				treeProps: {
					label: 'authName',
					children: 'children'
				},
				defKeys: [],
				roleId: '',
				addRoleDialogVisible: false,
				addRoleForm: {},
				addRoleFormRules: {
					roleName: [
						{ required: true, message: '请输入角色名称', trigger: 'blur' }
					],
					roleDesc:[
						{ required: true, message: '请输入角色描述', trigger: 'blur' }
					]
				},
				editRoleForm: {},
				editRoleDialogVisible: false,
				editRoleFormRules: {
					roleName: [
						{ required: true, message: '请输入角色名称', trigger: 'blur' }
					],
					roleDesc:[
						{ required: true, message: '请输入角色描述', trigger: 'blur' }
					]
				},
			}
		},
		created() {
			this.getRolesList()
		},
		methods: {
			async getRolesList() {
				const {data: res} = await this.$http.get('roles')
				if(res.meta.status !== 200) {
					return this.$message.error('获取角色列表失败！')
				}
				this.roleList = res.data
			},
			async removeRightById(role, rightId) {
				const confirmResult = await this.$confirm('此操作将永久删除该文件，是否继续', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => err)
				if(confirmResult !== 'confirm') {
					return this.$message.info('取消了删除！')
				}
				const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
				if(res.meta.status !== 200) {
					return this.$message.error('删除权限失败！')
				}
				role.children = res.data
			},
			async showSetRightDialog(role) {
				this.roleId = role.id
				const {data: res} = await this.$http.get('rights/tree')
				if(res.meta.status !== 200) {
					this.$message.error('获取权限数据失败！')
				}
				this.rightsList = res.data
				this.getLeafKeys(role, this.defKeys)
				this.setRightDialogVisible = true
			},
			getLeafKeys(node, arr) {
				if(!node.children) {
					return arr.push(node.id)
				}
				node.children.forEach(item => {
					this.getLeafKeys(item, arr)
				})
			},
			setRightDialogClosed() {
				this.defKeys = []
			},
			async allotRights() {
				const keys = [
					...this.$refs.treeRef.getCheckedKeys(),
					...this.$refs.treeRef.getHalfCheckedKeys()
				]
				const idStr = keys.join(',')
				const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr})
				if(res.meta.status !== 200) {
					return this.$message.error('分配权限失败！')
				}
				this.$message.success('分配权限成功！')
				this.getRolesList()
				this.setRightDialogVisible = false
			},
			addRoleDialogClosed() {
				this.$refs.addRoleFormRef.resetFields()
			},
			addRole() {
				this.$refs.addRoleFormRef.validate(async valid => {
					if(!valid) return
					const {data: res} = await this.$http.post('roles', this.addRoleForm)
					if(res.meta.status !== 201) {
						this.$message.error('添加角色失效！')
					}
					this.$message.success('添加角色成功！')
					this.addRoleDialogVisible = false
					this.getRolesList()
				})
			},
			async showRoleEditDialog(id) {
				const { data: res } = await this.$http.get('roles/' + id)
				if(res.meta.status !== 200) {
					return this.$message.error('查询角色消息失败！')
				}
				this.editRoleForm = res.data
				this.editRoleDialogVisible = true
			},
			editRoleInfo() {
				this.$refs.editRoleFormRef.validate(async valid => {
					if(!valid) return
					const { data: res} = await this.$http.put(`roles/${this.editRoleForm.roleId}`, {
						roleName: this.editRoleForm.roleName,
						roleDesc: this.editRoleForm.roleDesc
					})
					if(res.meta.status !== 200) {
						return this.$message.error('更新角色信息失败！')
					}
					this.editRoleDialogVisible = false
					this.getRolesList()
					this.$message.success('更新角色信息成功！')
				})
			},
			async removeRoleById(id) {
				const confirmResult = await this.$confirm('此操作将永久删除该角色，是否继续？',
					'提示',
					{
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					},
				).catch(err => err)
				if(confirmResult !== 'confirm') {
					return this.$message.info('已取消删除')
				}
				const {data: res} = await this.$http.delete('roles/' + id)
				if(res.meta.status !== 200) {
					return this.$message.error('删除用户失败！')
				}
				this.$message.success('删除用户成功！')
				this.getRolesList()
			}
		}
	}
</script>

<style lang="less" scoped>
	.el-tag {
		margin: 7px;
	}
	.bdtop {
		border-top: 1px solid #eee;
	}
	.bdbottom {
		border-bottom: 1px solid #eee;
	}
	.vcenter {
		display: flex;
		align-items: center;
	}
</style>
