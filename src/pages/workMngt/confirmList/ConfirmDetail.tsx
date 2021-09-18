import React, { useState } from 'react'
import { Button, Spin, Space, Modal, Form, TableColumnProps } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './confirm.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import { Table, Input, InputNumber, Popconfirm, Typography, Select } from 'antd';
interface Item {
  key: string;
  name: string;
  partBidNumber: number;
  address: string;
}

const originData: Item[] = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    partBidNumber: 32,
    address: `London Park no. ${i}`,
  });
}
interface EditableTableProps{
    dataSource?: object[]
    [key: string]: any
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'select';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : inputType === 'select' ?<Select/> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `请输入${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = ({ dataSource = [], ...props }: EditableTableProps) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(dataSource);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ partBidNumber: '', unit: '', address: '', ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex((item:any) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const tableColumns = [
    { 
        title: '序号', 
        dataIndex: 'index', 
        key: 'index', 
        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) 
    },
    { 
        title: '* 线路名称', 
        dataIndex: 'partBidNumber',
        type:'text',
        editable: true,
        key: 'partBidNumber', 
    },
    { 
        title: '* 杆塔号', 
        dataIndex: 'goodsType', 
        type:'text',
        editable: true,
        key: 'goodsType' 
    },
    { 
        title: '* 塔型', 
        dataIndex: 'packageNumber', 
        type:'select',
        editable: true,
        key: 'packgeNumber' 
    },
    { 
        title: '* 塔型钢印号', 
        dataIndex: 'amount', 
        type:'text',
        editable: true,
        key: 'amount' 
    },
    { 
        title: '* 产品类型', 
        dataIndex: 'unit', 
        type:'select',
        editable: true,
        key: 'unit' 
    },
    { 
        title: '* 电压等级（kv）', 
        dataIndex: 'unit',
        type:'select', 
        editable: true,
        key: 'unit' 
    },
    { 
        title: '* 呼高（m）', 
        dataIndex: 'unit', 
        type:'text',
        editable: true,
        key: 'unit' 
    },
    {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a href="javascript:;" onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              保存
            </a>
            <Popconfirm title="确定取消更改吗？" onConfirm={cancel}>
              <a>取消</a>
            </Popconfirm>
          </span>
        ) : (
            <Space>
                <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                    编辑
                </Typography.Link>
                <Popconfirm title="确定删除该条数据吗？" onConfirm={cancel}>
                    <a>删除</a>
                </Popconfirm>
            </Space>
        );
      },
    }

];

  const mergedColumns = tableColumns.map((col:any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.type,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        size='small'
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};


export default function ConfirmDetail(): React.ReactNode {
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const handleModalOk = async () => {
        try {
            const submitData = await form.validateFields()
            console.log(submitData)
            setVisible(false)
        } catch (error) {
            console.log(error)
        }
    }
    const handleModalCancel = () => setVisible(false)
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data
    return <Spin spinning={loading}>
            <DetailContent operation={[
                <Space>
                    <Button type='primary' onClick={() => history.goBack()}>保存</Button>
                    <Button type='primary' onClick={() => history.goBack()}>保存并提交</Button>
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <Space>
                        <Button type='primary' ghost onClick={() => history.goBack()}>导出</Button>
                        <Button type='primary' ghost onClick={() => history.goBack()}>模板下载</Button>
                        <span>总基数：23基</span>
                        <span>总重量：24kg</span>
                    </Space>
                    <Space>
                        <Button type='primary' ghost onClick={() => history.goBack()}>导入</Button>
                        <Button type='primary' ghost onClick={() => setVisible(true)}>添加</Button>
                    </Space>
                </div>
                <EditableTable dataSource={ detailData?.attachVos  } />
                <DetailTitle title="备注"/>
                <TextArea maxLength={ 200 }/>
                <DetailTitle title="附件"/>
                <CommonTable columns={[
                    {
                        title: '附件名称',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        render: (_: undefined, record: any): React.ReactNode => (
                            <Space direction="horizontal" size="small">
                                <Button type='link'>下载</Button>
                                <Button type='link'>预览</Button>
                                <Button type='link'>删除</Button>
                            </Space>
                        )
                    }
                ]} dataSource={detailData?.attachVos} />
            </DetailContent>
            <Modal visible={visible} title="添加" onOk={handleModalOk} onCancel={handleModalCancel}  width={ 1200 }>
                {/* <Form form={form}> */}
                    {/* <Form.Item name="aaaa" label="部门">
                        <Select>
                            <Select.Option value="1">是</Select.Option>
                            <Select.Option value="0">否</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="cccc" label="人员">
                        <Select>
                            <Select.Option value="1">是</Select.Option>
                            <Select.Option value="0">否</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="bbbb" label="计划交付时间">
                        <DatePicker />
                    </Form.Item> */}
                    <BaseInfo columns={baseInfoData} dataSource={detailData || {}} edit/>
                {/* </Form> */}
            </Modal>
        </Spin>
}
