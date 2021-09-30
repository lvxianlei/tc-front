import React, { useState } from 'react'
import { Button, Spin, Space, Modal, Form, TableColumnProps, Row, Col, Upload } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { towerData } from './confirm.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import { Table, Input, InputNumber, Popconfirm, Typography, Select } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
interface Item {
  key: string;
  name: string;
  partBidNumber: number;
  address: string;
  pattern: number;
}

const originData: Item[] = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    partBidNumber: 32,
    pattern: 1,
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
  enums?: object[];
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  enums,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : inputType === 'select' ?<Select>{enums&&enums.map((item:any)=>{
    return <Select.Option value={item.value} key ={item.value}>{item.label}</Select.Option>
  })}</Select> : <Input />;
  
  return (
    <td {...restProps}>
      {console.log(enums)}
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

export default function ConfirmDetail(): React.ReactNode {
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [tableDataSource, setTableDataSource] = useState<object[]>([]);
    const [form] = Form.useForm();
    const [formRef] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record: Item) => record.key === editingKey;
    const edit = (record: Partial<Item> & { key: React.Key }) => {
      formRef.setFieldsValue({ partBidNumber: '', unit: '', address: '', ...record });
      setEditingKey(record.key);
    };
    const onDelete = (key: React.Key)=>{
      const newData = [...tableDataSource];
      const index = newData.findIndex((item:any) => key === item.key);
      if (index > -1) {
        newData.splice(index, 1);
      }
      setTableDataSource(newData);
    };
    const cancel = () => {
      setEditingKey('');
    };

    const save = async (key: React.Key) => {
      try {
        const row = (await formRef.validateFields()) as Item;

        const newData = [...tableDataSource];
        const index = newData.findIndex((item:any) => key === item.key);
        if (index > -1) {
          const item = newData[index];
          newData.splice(index, 1, {
            ...item,
            ...row,
          });
          setTableDataSource(newData);
          setEditingKey('');
        } else {
          newData.push(row);
          setTableDataSource(newData);
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
          dataIndex: 'lineName',
          type:'text',
          editable: true,
          key: 'lineName', 
      },
      { 
          title: '* 杆塔号', 
          dataIndex: 'name', 
          type:'text',
          editable: true,
          key: 'name' 
      },
      { 
          title: '* 塔型', 
          dataIndex: 'productCategory', 
          type:'select',
          editable: true,
          key: 'productCategory' 
      },
      { 
          title: '* 塔型钢印号', 
          dataIndex: 'steelProductShape', 
          type:'text',
          editable: true,
          key: 'steelProductShape' 
      },
      { 
          title: '* 产品类型', 
          dataIndex: 'productType', 
          type:'select',
          editable: true,
          key: 'productType' 
      },
      { 
          title: '* 电压等级（kv）', 
          dataIndex: 'voltageLevel',
          type:'select', 
          editable: true,
          key: 'voltageLevel' 
      },
      { 
          title: '* 呼高（m）', 
          dataIndex: 'basicHight', 
          type:'number',
          editable: true,
          key: 'basicHight' 
      },
      { 
          title: '* 模式', 
          dataIndex: 'pattern', 
          type:'select',
          editable: true,
          key: 'pattern',
          enums: [
            {
                value: 1,
                label: "新放"
            },
            {
                value: 2,
                label: "重新出卡"
            },
            {
                value: 3,
                label: "套用"
            }
          ],
          render: (value: number, record: object): React.ReactNode => {
            const renderEnum: any = [
              {
                value: 1,
                label: "新放"
              },
              {
                value: 2,
                label: "重新出卡"
              },
              {
                value: 3,
                label: "套用"
              },
            ]
            return <>{renderEnum.find((item: any) => item.value === value).label}</>
          }
      },
      { 
          title: '* 杆塔重量（kg）', 
          dataIndex: 'productWeight', 
          type:'number',
          editable: true,
          key: 'productWeight' 
      },
      { 
          title: '* 其他增重（kg）', 
          dataIndex: 'otherWeight', 
          type:'number',
          editable: true,
          key: 'otherWeight' 
      },
      { 
          title: '* 总重（kg）', 
          dataIndex: 'totalWeight', 
          type:'number',
          editable: true,
          key: 'totalWeight' 
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
                  <Popconfirm title="确定删除该条数据吗？" onConfirm={() => onDelete(record.key)} disabled={editingKey !== ''}>
                    <Typography.Link disabled={editingKey !== ''}>
                        删除
                    </Typography.Link>
                  </Popconfirm>
              </Space>
          );
        },
      }

    ];
    const handleModalOk = async () => {
        try {
            const submitData = await form.validateFields();
            submitData.key = tableDataSource && tableDataSource.length.toString()
            tableDataSource.push(submitData);
            console.log(tableDataSource)
            setTableDataSource(tableDataSource);
            setVisible(false)
        } catch (error) {
            console.log(error)
        }
    }
    const handleModalCancel = () => setVisible(false)
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawProductDetail/getDetailListById/${params.id}`)
        resole(data);
        setTableDataSource(data?.drawProductDetailList.map(( item:any ,index: number )=>{return{ ...item, key: index.toString() }}));
    }), {})
    const detailData: any = data;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    };
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
          enums: col.enums,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });
    return <Spin spinning={loading}>
            <DetailContent operation={[
                <Space>
                    <Button type='primary' onClick={() => {}}>保存</Button>
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
                <Form form={formRef} component={false}>
                    <Table
                      components={{
                        body: {
                          cell: EditableCell,
                        },
                      }}
                      size='small'
                      bordered
                      dataSource={[...tableDataSource]}
                      columns={mergedColumns}
                      rowClassName="editable-row"
                      // rowKey='index'
                      pagination={{
                        onChange: cancel,
                      }}
                    />
                </Form>
                <DetailTitle title="备注"/>
                <TextArea maxLength={ 200 } value={detailData?.description}/>
                <Upload><span style={{fontSize:'16px',marginLeft:'13px'}}>附件</span><CloudUploadOutlined /></Upload>
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
                ]} dataSource={detailData?.attachInfoList} />
            </DetailContent>
            <Modal visible={visible} title="添加" onOk={handleModalOk} onCancel={handleModalCancel}  width={ 800 }>
                <Form form={form} { ...formItemLayout }>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="lineName" label="线路名称" rules={[{
                            "required": true,
                            "message":"请输入线路名称"
                        }]}>
                            <Input/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="name" label="杆塔号" rules={[{
                            "required": true,
                            "message":"请输入杆塔号"
                        }]}>
                            <Input/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="productCategory" label="塔型" rules={[{
                            "required": true,
                            "message":"请输入塔型"
                        }]}>
                            <Input/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="steelProductShape" label="塔型钢印号" rules={[{
                            "required": true,
                            "message":"请输入塔型钢印号"
                        }]}>
                            <Input/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="productType" label="产品类型" rules={[{
                            "required": true,
                            "message":"请选择产品类型"
                        }]}>
                            <Select>
                                <Select.Option value={1} key={1}>220</Select.Option>
                                <Select.Option value={2} key={2}>110</Select.Option>
                            </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="voltageLevel" label="电压等级（kV）" rules={[{
                            "required": true,
                            "message":"请选择电压等级（kV）"
                        }]}>
                            <Select>
                                <Select.Option value={1} key={1}>220</Select.Option>
                                <Select.Option value={2} key={2}>110</Select.Option>
                            </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="basicHight" label="呼高（m）" rules={[{
                            "required": true,
                            "message":"请输入呼高（m）"
                        }]}>
                            <Input/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="pattern" label="模式" rules={[{
                            "required": true,
                            "message":"请选择模式"
                        }]}>
                            <Select>
                                <Select.Option value={1} key={1}>新放</Select.Option>
                                <Select.Option value={3} key={3}>套用</Select.Option>
                                <Select.Option value={2} key={2}>重新出卡</Select.Option>
                            </Select>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="productWeight" label="杆塔重量（kg）" rules={[{
                            "required": true,
                            "message":"请输入杆塔重量（kg）"
                        }]}>
                            <Input/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="otherWeight" label="其他增重（kg）" rules={[{
                            "required": true,
                            "message":"请输入其他增重（kg）"
                        }]}>
                            <Input/>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <Form.Item name="totalWeight" label="总重（kg）" rules={[{
                            "required": true,
                            "message":"请输入总重（kg）"
                        }]}>
                            <Input/>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="description" label="备注">
                            <TextArea rows={1} showCount maxLength={500}/>
                        </Form.Item>
                      </Col>
                    </Row>
                    {/* <BaseInfo columns={towerData} dataSource={detailData || {}} edit col={ 2 }/> */}
                </Form>
            </Modal>
        </Spin>
}
