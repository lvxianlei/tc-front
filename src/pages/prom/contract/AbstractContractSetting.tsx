/**
 * @author zyc
 * @copyright © 2021 
 */
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, FormProps, Input, InputNumber, Radio, Row, Select, Space, Upload, Checkbox, Cascader, TablePaginationConfig } from 'antd';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';
import moment from 'moment';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

import AbstractFillableComponent, {
    IAbstractFillableComponentState,
    IFormItemGroup,
} from '../../../components/AbstractFillableComponent';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { IRenderedSection } from '../../../utils/SummaryRenderUtil';
import styles from './AbstractContractSetting.module.less';
import ClientSelectionComponent from '../../../components/ClientSelectionModal';
import RequestUtil from '../../../utils/RequestUtil';
import { DataType } from '../../../components/AbstractSelectionModal';
import { CascaderOptionType } from 'antd/lib/cascader';
import { SelectValue } from 'antd/lib/select';
export interface IAbstractContractSettingState extends IAbstractFillableComponentState {
    tablePagination: TablePaginationConfig;
    readonly contract?: IContract;
    checkList: any;
    tableDataSource: [];
    regionInfoData: [] ;
    childData: [] | undefined;
    col: [];
}

export interface ITabItem {
    readonly label: string;
    readonly key: string | number;
}

export interface IContract {
    readonly id?: number;
    readonly contractNumber?: string;
    readonly internalNumber?: string;
    readonly projectName?: string;
    readonly simpleProjectName?: string;
    readonly winBidType?: number;
    readonly saleType?: number;
    readonly customerInfoDto?: IcustomerInfoDto;
    readonly signCustomerName?: string;
    readonly signContractTime?: string;
    readonly signUserName?: string;
    readonly deliveryTime?: string;
    readonly reviewTime?: string;
    readonly chargeType?: string;
    readonly salesman?: string;
    readonly regionInfoDTO?: IregionInfoDTO;
    readonly contractAmount?: number;
    readonly currencyType?: number;
    readonly description?: string;
    readonly productInfoDto?: IproductInfoDto;
    readonly planType?: number;
    paymentPlanDtos?: IPaymentPlanDto[];
    readonly attachInfoDtos?: IattachDTO[];
}

export interface IcustomerInfoDto {
    readonly customerId?: number;
    readonly customerCompany?: string;
    readonly customerLinkman?: string;
    readonly customerPhone?: string;
}

export interface IproductInfoDto {
    readonly productType?: string;
    readonly voltageGrade?: number;
}

export interface IPaymentPlanDto {
    readonly index?: number;
    readonly returnedTime?: any;
    readonly returnedRate?: number;
    readonly returnedAmount?: number;
    readonly description?: string;
}

export interface IattachDTO {
    readonly name?: string;
    readonly username?: string;
    readonly fileSize?: string;
    readonly description?: string;
}

export interface IregionInfoDTO {
    readonly countryCode?: string;
    readonly provinceCode?: string;
    readonly cityCode?: string;
    readonly districtCode?: string;
}

export interface IResponseData {
    total: number | undefined;
    size: number | undefined;
    current: number | undefined;
    readonly parentCode: string;
    records: [];
}


/**
 * Abstract Contract Setting
 */
export default abstract class AbstractContractSetting<P extends RouteComponentProps, S extends IAbstractContractSettingState> extends AbstractFillableComponent<P, S> {

    public state: S = {
        contract: undefined,
    } as S;

    public async componentDidMount() {
        super.componentDidMount();
        this.getregionInfo({}); 
    }

    /**
     * @override
     * @description Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return '/prom/contract';
    }

    /**
     * @override
     * @description Gets form props
     * @returns form props 
     */
    protected getFormProps(): FormProps {
        return {
            ...super.getFormProps(),
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 16
            }
        };
    }

    protected getGeneratNum(): string { 
        var result: number = Math.floor( Math.random() * 1000 );
        let num: string = '';
        if(result < 10) {
            num =  '00' + result;
        } else if (result<100){
            num = '0' + result;
        } else {
            num =  result.toString();
        }
        return moment().format('YYYYMMDD') + num;
    }
    /**
     * @override
     * @description 附件表格选择
     * @returns 
     */

    public checkChange = (record: Record<string, any>): void => {
        let checked: any = this.state.checkList;
        if(record.target.checked) {
            checked.push(record.target.value);
        } else {
            checked = checked.filter((item: any) => item !== record.target.value);
        }
        this.setState({
            checkList: checked
        })
    }

    public  getregionInfo = async (record: Record<string, any>) => {
        const resData: IResponseData = await RequestUtil.get<IResponseData>(`/tower-system/region`);
        this.setState({
            regionInfoData:  resData.records
        })
    }

    public onRegionInfoChange =  async (record: Record<string, any>,selectedOptions?: CascaderOptionType[] | any) => {
        if(selectedOptions.length < 3 ) {
            let parentCode = record[selectedOptions.length - 1];
            const resData: [] = await RequestUtil.get(`/tower-system/region/${ parentCode }`);
            const targetOption = selectedOptions[selectedOptions.length - 1];
            targetOption.children = resData;
        }
    }

    /**
     * @override
     * @description 弹窗
     * @returns 
     */
    public onSelect = (selectedRows: DataType[]):void => {
        const contract: IContract | undefined = this.state.contract;
        if(selectedRows.length > 0 ) {
            this.setState({
                contract: {
                    ...(contract || {}),
                    signCustomerName: selectedRows[0].name
                }
            })
            this.getForm()?.setFieldsValue({ signCustomerName: selectedRows[0].name });
        }
    }

    public onCustomerCompanySelect = (selectedRows: DataType[]):void => {
        const contract: IContract | undefined = this.state.contract;
        if(selectedRows.length > 0 ) {
            const select = {
                customerId: selectedRows[0].id,
                customerCompany: selectedRows[0].name,
                customerLinkman: selectedRows[0].linkman,
                customerPhone: selectedRows[0].phone
            }
            this.setState({
                contract: {
                    ...(contract || {}),
                    customerInfoDto: select,
                    signCustomerName: selectedRows[0].name
                }
            })
            this.getForm()?.setFieldsValue(select);
            this.getForm()?.setFieldsValue({ signCustomerName: selectedRows[0].name });
        }
    }

    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
            const contract: IContract | undefined = this.state.contract;
            const GeneratNum: string = this.getGeneratNum();
            return [[{
                title: '基础信息',
                itemCol: {
                    span: 8
                },
                itemProps: [{
                    label: '合同编号',
                    name: 'contractNumber',
                    initialValue: contract?.contractNumber,
                    rules: [{
                        required: true,
                        message: '请输入合同编号'
                    }],
                    children: <Input/>
                }, {
                    label: '内部合同编号',
                    name: 'internalNumber',
                    initialValue: contract?.internalNumber || GeneratNum,
                    children: <Input disabled/>
                }, {
                    label: '工程名称',
                    name: 'projectName',
                    initialValue: contract?.projectName,
                    rules: [{
                        required: true,
                        message: '请输入工程名称'
                    }],
                    children: <Input/>
                }, {
                    label: '工程简称',
                    name: 'simpleProjectName',
                    initialValue: contract?.simpleProjectName,
                    children: <Input/>
                }, {
                    label: '中标类型',
                    name: 'winBidType',
                    initialValue: contract?.winBidType || 1,
                    children: (
                        <Select>
                            <Select.Option value={ 1 }>国家电网</Select.Option>
                            <Select.Option value={ 2 }>南方电网</Select.Option>
                        </Select>
                    )
                }, {
                    label: '销售类型',
                    name: 'saleType',
                    initialValue: contract?.saleType || 1,
                    children: (
                        <Select>
                            <Select.Option value={ 1 }>国内业务</Select.Option>
                            <Select.Option value={ 2 }>国际业务</Select.Option>
                        </Select>
                    )
                }, {
                    label: '业主单位',
                    name: 'customerCompany',
                    initialValue: contract?.customerInfoDto?.customerCompany,
                    rules: [{
                        required: true,
                        message: '请选择业主单位'
                    }],
                    children: 
                        <>
                            <Input value={ contract?.customerInfoDto?.customerCompany } suffix={ 
                                <ClientSelectionComponent onSelect={ this.onCustomerCompanySelect } />
                            }/>
                        </>
                }, {
                    label: '业主联系人',
                    name: 'customerLinkman',
                    initialValue: contract?.customerInfoDto?.customerLinkman,
                    children: <Input/>
                }, {
                    label: '业主联系电话',
                    name: 'customerPhone',
                    initialValue: contract?.customerInfoDto?.customerPhone,
                    children: <Input />
                }, {
                    label: '合同签订单位',
                    name: 'signCustomerName',
                    initialValue: contract?.signCustomerName,
                    rules: [{
                        required: true,
                        message: '请选择合同签订单位'
                    }],
                    children:
                        <>
                            <Input value={ contract?.signCustomerName } suffix={ 
                                <ClientSelectionComponent onSelect={ this.onSelect } />
                            }/>
                        </>
                }, {
                    label: '合同签订日期',
                    name: 'signContractTime',
                    initialValue: moment(contract?.signContractTime),
                    rules: [{
                        required: true,
                        message: '请选择合同签订日期'
                    }],
                    children:  <DatePicker />
                }, {
                    label: '签订人',
                    name: 'signUserName',
                    initialValue: contract?.signUserName,
                    rules: [{
                        required: true,
                        message: '请输入签订人'
                    }],
                    children:  <Input />
                }, {
                    label: '要求交货日期',
                    name: 'deliveryTime',
                    initialValue: moment(contract?.deliveryTime),
                    rules: [{
                        required: true,
                        message: '请选择要求交货日期'
                    }],
                    children:  <DatePicker />
                }, {
                    label: '评审时间',
                    name: 'reviewTime',
                    initialValue: moment(contract?.reviewTime),
                    children:  <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                }, {
                    label: '所属国家',
                    name: 'countryCode',
                    initialValue: contract?.regionInfoDTO?.countryCode || 1,
                    children: (
                        <Select onChange={ (value: SelectValue) => {
                            this.getForm()?.setFieldsValue({ countryCode: value })
                        } }>
                            <Select.Option value={ 1 }>中国</Select.Option>
                            <Select.Option value={ 2 }>海外</Select.Option>
                        </Select>
                    )
                }, {
                    label: '销售员',
                    name: 'salesman',
                    initialValue: contract?.salesman,
                    rules: [{
                        required: true,
                        message: '请输入销售员'
                    }],
                    children:  <Input />
                }, {
                    label: '计价方式',
                    name: 'chargeType',
                    initialValue: contract?.chargeType,
                    children: (
                        <Select>
                            <Select.Option value={ 1 }>订单总价、总重计算单价</Select.Option>
                            <Select.Option value={ 2 }>产品单价、基数计算总价</Select.Option>
                        </Select>
                    )
                }, {
                    label: '所属区域',
                    name: 'regionInfoDTO',
                    initialValue: contract?.regionInfoDTO,
                    children: (
                        <Cascader
                            defaultValue={['北京市', '北京市', '丰台区']}
                            fieldNames={{ label: 'name', value: 'code' }}
                            options={this.state.regionInfoData}
                            onChange={this.onRegionInfoChange}
                            changeOnSelect
                            disabled={ this.getForm()?.getFieldValue('countryCode') === 2 }
                        />
                    )
                }, {
                    label: '合同总价',
                    name: 'contractAmount',
                    initialValue: contract?.contractAmount,
                    children: <InputNumber min="0" step="0.01" stringMode={ false } precision={ 2 } prefix="￥"/>
                }, {
                    label: '币种',
                    name: 'currencyType',
                    initialValue: contract?.currencyType,
                    children: (
                        <Select>
                            <Select.Option value={ 1 }>RMB人民币</Select.Option>
                            <Select.Option value={ 2 }>USD美元</Select.Option>
                        </Select>
                    )
                }, {
                    label: '备注',
                        name: 'description',
                        initialValue: contract?.description,
                        children: <Input.TextArea rows={ 5 } showCount={ true } maxLength={ 300 } placeholder="请输入备注信息"/>
                    }]
                }, {
                    title: '产品信息',
                    itemCol: {
                        span: 12
                    },
                    itemProps: [ {
                        label: '产品类型',
                        name: 'productType',
                        initialValue: contract?.productInfoDto?.productType,
                        children: (
                            <Select>
                                <Select.Option value={ 1 }>角钢塔</Select.Option>
                                <Select.Option value={ 2 }>管塔</Select.Option>
                                <Select.Option value={ 3 }>螺栓</Select.Option>
                            </Select>
                        )
                    }, {
                        label: '电压等级',
                        name: 'voltageGrade',
                        initialValue: contract?.productInfoDto?.voltageGrade,
                        children: (
                            <>
                                <Select style={{ width: '90%' }}>
                                    <Select.Option value={ 1 }>220</Select.Option>
                                    <Select.Option value={ 2 }>110</Select.Option>
                                </Select>
                                <span> KV</span>
                            </>
                            
                        )
                    }]
        }]];
    }

    /**
     * @description Renders extra sections
     * @returns extra sections 
     */
    public renderExtraSections(): IRenderedSection[] {
        const contract: IContract | undefined = this.state.contract;
        return [{
            title: '回款计划',
            render: (): React.ReactNode => {
                return (
                    <>
                        <Form.Item name="planType" initialValue={ contract?.planType || 1 }>
                            <Radio.Group>
                                <Radio value={ 1 }>按占比</Radio>
                                <Radio value={ 2 }>按金额</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.List name="paymentPlanDtos" initialValue={ contract?.paymentPlanDtos || [] }>
                            {
                                (fields: FormListFieldData[], operation: FormListOperation): React.ReactNode => {
                                    return (
                                        <>
                                            <Button type="primary" onClick={ () => ( operation.add() ) } className={ styles.btn }>新增</Button>
                                            <Row className={ styles.FormHeader }>
                                                <Col span={ 2 }>期次</Col>
                                                <Col span={ 5 }>计划回款日期</Col>
                                                <Col span={ 5 }>计划回款占比(%)</Col>
                                                <Col span={ 5 }>计划回款金额</Col>
                                                <Col span={ 5 }>备注</Col>
                                                <Col span={ 2 }>操作</Col>
                                            </Row>
                                            {
                                                fields.map<React.ReactNode>((field: FormListFieldData, index: number): React.ReactNode => (
                                                    <Row key={ `${ field.name }_${ index }` } className={ styles.FormItem }>
                                                        <Col span={ 2 }>{ index + 1 }</Col>
                                                        <Col span={ 5 }>
                                                            
                                                            <Form.Item { ...field } name={[field.name, 'returnedTime']} fieldKey={[field.fieldKey, 'returnedTime']}>
                                                                <DatePicker format="YYYY-MM-DD"/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 5 }>
                                                            <Form.Item { ...field } name={[field.name, 'returnedRate']} fieldKey={[field.fieldKey, 'returnedRate']}>
                                                                <Input/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 5 }>
                                                            <Form.Item { ...field } name={[field.name, 'returnedAmount']} fieldKey={[field.fieldKey, 'returnedAmount']}>
                                                                <InputNumber stringMode={ false } precision={ 2 }
                                                                    formatter={ value => `￥ ${ value }`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }
                                                                    parser={ value => value?.replace(/\$\s?|(,*)/g, '') || '' }/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 5 }>
                                                            <Form.Item { ...field } name={[field.name, 'description']} fieldKey={[field.fieldKey, 'description']}>
                                                                <Input.TextArea rows={ 5 } maxLength={ 300 }/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <ConfirmableButton confirmTitle="要删除该条回款计划吗？"
                                                                type="link" placement="topRight"
                                                                onConfirm={ () => { operation.remove(index); } }>
                                                                <DeleteOutlined />
                                                            </ConfirmableButton>
                                                        </Col>
                                                    </Row>
                                                ))
                                            }
                                        </>
                                    );
                                }
                            }
                        </Form.List>
                    </>
                );
            }
        },{
            title: '附件',   
            render: (): React.ReactNode => {
                return (
                    <>
                        <Row className={ styles.attachHeader }>
                            <Col span={ 1 }></Col>
                            <Col span={ 6 }>附件名称</Col>
                            <Col span={ 2 }>文件大小</Col>
                            <Col span={ 4 }>上传时间</Col>
                            <Col span={ 4 }>上传人员</Col>
                            <Col span={ 4 }>备注</Col>
                            <Col span={ 3 }>操作</Col>
                        </Row>
                        <Form.List name="attachInfoDtos">
                            {
                                (fields: FormListFieldData[], operation: FormListOperation): React.ReactNode => {
                                    return (
                                        <>
                                            <Space size="small" className={ styles.attachBtn }>
                                                <Upload  action="/tower-system/attach" onChange={ (info)=>{
                                                    console.log(info)
                                                    if (info.file.status !== 'uploading') {
                                                        // console.log(info.file, info.fileList);
                                                        }
                                                        if (info.file.status === 'done') {
                                                        console.log(info.file, info.fileList);
                                                        } else if (info.file.status === 'error') {
                                                        console.log(info.file, info.fileList);
                                                        operation.add({
                                                            name: info.file.name,
                                                            username: 'admin',
                                                            fileSize: info.file.size,
                                                            description: ''
                                                        })
                                                        }
                                                } } showUploadList= {false}>
                                                    <Button type="primary">添加</Button>
                                                </Upload>
                                                <Button type="primary" onClick={ ()=> {
                                                    let attachInfoDtos: any[] =  this.getForm()?.getFieldValue("attachInfoDtos");
                                                    let checked: any[] = this.state.checkList;
                                                    let batchId: any[] = [];
                                                    checked.map((item: any) => {
                                                        batchId.push(attachInfoDtos[item].id)
                                                    })
                                                    console.log(batchId)
                                                } }>下载</Button>
                                                <Button type="primary" onClick={ ()=> {
                                                    let attachInfoDtos: any[] =  this.getForm()?.getFieldValue("attachInfoDtos");
                                                    let checked: any[] = this.state.checkList;
                                                    let batchId: any[] = [];
                                                    checked.map((item: any) => {
                                                        batchId.push(attachInfoDtos[item].id)
                                                    })
                                                    operation.remove(this.state.checkList)
                                                } }>删除</Button>
                                            </Space>
                                            {
                                                fields.map<React.ReactNode>((field: FormListFieldData, index: number): React.ReactNode => (
                                                    <Row key={ `${ field.name }_${ index }` } className={ styles.FormItem }>
                                                        <Col span={ 1 }>
                                                            <Checkbox value={ index } onChange={ this.checkChange }></Checkbox>
                                                        </Col>
                                                        <Col span={ 6 }>
                                                            <Form.Item { ...field } name={[field.name, 'name']} fieldKey={[field.fieldKey, 'returnedTime']}>
                                                                <Input disabled  className={ styles.Input }/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'fileSize']} fieldKey={[field.fieldKey, 'returnedRate']}>
                                                                <Input disabled  className={ styles.Input }/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 4 }>
                                                            <Form.Item { ...field } name={[field.name, 'username']} fieldKey={[field.fieldKey, 'returnedAmount']}>
                                                                <Input disabled  className={ styles.Input }/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 4 }>
                                                            <Form.Item { ...field } name={[field.name, 'username']} fieldKey={[field.fieldKey, 'returnedAmount']}>
                                                                <Input disabled  className={ styles.Input }/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 4 }>
                                                            <Form.Item { ...field } name={[field.name, 'description']} fieldKey={[field.fieldKey, 'description']}>
                                                                <Input.TextArea rows={ 5 } maxLength={ 300 }/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 3 }>
                                                            <Space direction="horizontal" size="small">
                                                                <Link to={ `` }>预览</Link>
                                                                <Link to={ `` }>下载</Link>
                                                                <ConfirmableButton confirmTitle="要删除该附件吗？"
                                                                    type="link" placement="topRight"
                                                                    onConfirm={ () => { 
                                                                        let attachInfoDtos =  this.getForm()?.getFieldValue("attachInfoDtos");
                                                                        // operation.remove(index); 
                                                                        console.log(attachInfoDtos[index].id)
                                                                    }}>
                                                                    <DeleteOutlined />
                                                                </ConfirmableButton>
                                                            </Space>
                                                        </Col>
                                                    </Row>
                                                ))
                                            }
                                        </>
                                    );
                                }
                            }
                        </Form.List>
                    </>
                )
            }
        }];
    }
}

