/**
 * 新增以及编辑角色权限
 */
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Form, Spin, Input, TreeSelect } from 'antd';
import { DataNode } from 'rc-tree/lib/interface';
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil';
import { IRole } from '../../auth/role/IRole';
import { IUser, EditProps } from './IUser';

export default forwardRef(function AddUserModal({ id }: EditProps, ref) {
    const [addCollectionForm] = Form.useForm();
    const resetFields = () => {
        addCollectionForm.setFieldsValue({
            account: "",
            roleIds: []
        })
    }

    // 编辑的时候触发
    useEffect(() => {
        if (id) { getData(id) };
    }, [id])

    // 获取编辑信息
    const { run: getData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resolve, reject) => {
        try {
            const result: IUser = await RequestUtil.get(`/sinzetech-user/user/${id}`);
            addCollectionForm.setFieldsValue({
                account: result && result.account,
                roleIds: result && result.roleIds?.split(","),
                departmentId: result && result.departmentId,
                name: result && result.name
            })
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 获取树结构
    const { data: authority = [] } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: IRole[] = await RequestUtil.get<IRole[]>('/sinzetech-system/role/tree');
            resole(result);
        } catch (error) {
            reject(error)
        }
    }), {})

    // 获取部门
    const { data: department = [] } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: IRole[] = await RequestUtil.get<IRole[]>('/sinzetech-user/department/tree');
            resole(result);
        } catch (error) {
            reject(error)
        }
    }), {})


    // 新增保存
    const { loading, run } = useRequest((postData: { path: string, data: {}, type: number }) => new Promise(async (resolve, reject) => {
        try {
            const result = postData.type === 1 ? await RequestUtil.post(postData.path, postData.data)
                : await RequestUtil.put(postData.path, postData.data);
            resolve(result);
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await addCollectionForm.validateFields();
            baseData.roleIds = baseData?.roleIds?.join(',')
            id ? await run({ path: "/sinzetech-user/user", data: { ...baseData, id, password: "123456" }, type: 2 }) :
                await run({ path: "/sinzetech-user/user", data: { ...baseData, password: "123456" }, type: 1 })
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })
    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit]);

    return (
        <Spin spinning={loading}>
            <Form
                name="basic"
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 22 }}
                initialValues={{ remember: true }}
                onFinish={onSubmit}
                onFinishFailed={resetFields}
                autoComplete="off"
                form={addCollectionForm}
            >

                <Form.Item
                    label="用户姓名"
                    name="name"
                    rules={[{ required: true, message: '请输入用户姓名' }]}
                >
                    <Input placeholder="请输入用户姓名" maxLength={30} />
                </Form.Item>

                <Form.Item
                    label="账号"
                    name="account"
                    rules={[{ required: true, message: '请输入账号' }]}
                >
                    <Input placeholder="请输入账号" maxLength={30} />
                </Form.Item>

                <Form.Item
                    label="角色"
                    name="roleIds"
                    rules={[{ required: true, message: '请选择角色!' }]}
                >
                    <TreeSelect
                        showSearch={true}
                        placeholder="请选择角色"
                        multiple={true}
                        treeData={authority as (IRole & DataNode)[]}
                    />
                </Form.Item>

                <Form.Item
                    label="所属部门"
                    name="departmentId"
                    rules={[{ required: true, message: '请选择所属部门!' }]}
                    style={{ marginBottom: 0 }}
                >
                    <TreeSelect
                        showSearch={true}
                        placeholder="请选择所属部门"
                        treeData={department as (IRole & DataNode)[]}
                    />
                </Form.Item>
            </Form>
        </Spin>
    )
})