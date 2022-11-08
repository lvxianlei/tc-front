/**
 * 新增以及编辑角色权限
 */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Form, Spin, Input, Tree, message } from 'antd';
import { DataNode } from 'rc-tree/lib/interface';
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil';
import { EditResult, IAuthority } from './IRole';
interface EditProps {
    id?: string
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
}

export default forwardRef(function AddRoleModal({ id }: EditProps, ref) {
    const [addCollectionForm] = Form.useForm();
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [halfComponents, setHalfComponents] = useState<React.Key[]>([]);
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
    const resetFields = () => {
        addCollectionForm.setFieldsValue({
            name: ""
        })
        setCheckedKeys([])
    }

    // 编辑的时候触发
    useEffect(() => {
        if (id) { getData(id) };
    }, [id])

    // 获取编辑信息
    const { run: getData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resolve, reject) => {
        try {
            const result: EditResult = await RequestUtil.get(`/sinzetech-system/role/${id}`);
            addCollectionForm.setFieldsValue({
                name: result && result.name,
                code: result && result.code
            })
            setHalfComponents(result.halfComponents || []);
            setCheckedKeys(result.componentList || []);
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 获取树结构
    const { loading: loadingTree, run: getUser, data: authority = [] } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: IAuthority[] = await RequestUtil.get<IAuthority[]>(`/sinzetech-system/role/component/tree`);
            resole(result);
            const key = await expandKeysByValue(result);
            setExpandedKeys(key);
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

    const wrapAuthority2DataNode = (authorities: (IAuthority & DataNode)[] = []): DataNode[] => {
        authorities.forEach((authority: (IAuthority & DataNode)): void => {
            authority.title = authority.name;
            authority.key = authority.code;
            authority.selectable = authority.checked;
            if (authority.children && authority.children.length) {
                wrapAuthority2DataNode(authority.children as (IAuthority & DataNode)[]);
            }
        });
        return authorities;
    }

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await addCollectionForm.validateFields();
            if (checkedKeys.length < 1) {
                message.error("至少选择一个功能权限");
                return;
            }
            id ? await run({
                path: "/sinzetech-system/role", data: {
                    ...baseData,
                    components: checkedKeys,
                    halfComponents,
                    roleId: id
                }, type: 2
            }) :
                await run({
                    path: "/sinzetech-system/role", data: {
                        ...baseData,
                        components: checkedKeys,
                        halfComponents
                    }, type: 1
                })
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })
    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit]);
    const onExpand = (expandedKeysValue: React.Key[]) => {
        setExpandedKeys(expandedKeysValue);
        // setAutoExpandParent(false);
    };
    const onCheck = (checkedKeys: { checked: React.Key[]; halfChecked: React.Key[]; } | React.Key[], info: any): void => {
        setCheckedKeys(checkedKeys as React.Key[]);
        setHalfComponents(info.halfCheckedKeys || []);
    }
    const expandKeysByValue = (authorities: IAuthority[]): number[] => {
        let data: number[] = [];
        authorities.forEach((authority: IAuthority): void => {
            data.push(authority.id);
            if (authority.children && authority.children.length) {
                expandKeysByValue(authority.children as IAuthority[]);
            }
        });
        return data;
    }

    return (
        <Spin spinning={loading || loadingTree}>
            <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onSubmit}
                onFinishFailed={resetFields}
                autoComplete="off"
                form={addCollectionForm}
            >
                <Form.Item
                    label="名称"
                    name="name"
                    rules={[{ required: true, message: '请输入名称' }]}
                >
                    <Input placeholder="请输入名称" />
                </Form.Item>
                <Form.Item
                    name="code"
                    style={{ display: 'none' }}
                >
                    <Input type="hidden" />
                </Form.Item>
                <Form.Item
                    label="功能权限"
                    name="components"
                // rules={[{ type: 'array', required: true, message: 'Please input your username!' }]}
                >
                    <div style={{ height: "500px", overflow: 'auto', }}>
                        <Tree
                            checkable
                            onExpand={onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            onCheck={onCheck}
                            checkedKeys={{
                                checked: checkedKeys,
                                halfChecked: halfComponents
                            }}
                            treeData={wrapAuthority2DataNode(authority as (IAuthority & DataNode)[])}
                        />
                    </div>
                </Form.Item>
            </Form>
        </Spin>
    )
})