/**
 * @author zyc
 * @copyright © 2021 
 */
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, FormProps, Input, InputNumber, Radio, Row, Select, Space, Upload, Checkbox, Cascader, TablePaginationConfig, RadioChangeEvent } from 'antd';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';
import moment from 'moment';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import AbstractFillableComponent, {
    IAbstractFillableComponentState,
    IFormItemGroup,
} from '../../../components/AbstractFillableComponent';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { IRenderedSection } from '../../../utils/SummaryRenderUtil';
import styles from './AbstractContractSetting.module.less';
import ClientSelectionComponent from '../../../components/ClientSelectionModal';
import RequestUtil from '../../../utils/RequestUtil';
import { DataType } from '../../../components/AbstractSelectableModal';
import { CascaderOptionType } from 'antd/lib/cascader';
import { RuleObject } from 'antd/lib/form';
import { StoreValue } from 'antd/lib/form/interface';
import Modal from 'antd/lib/modal/Modal';
import AuthUtil from '../../../utils/AuthUtil';
export interface IAbstractContractSettingState extends IAbstractFillableComponentState {
    readonly tablePagination: TablePaginationConfig;
    readonly contract: IContract;
    readonly checkList: [];
    readonly tableDataSource: [];
    readonly regionInfoData: [] ;
    readonly childData: [] | undefined;
    readonly col: [];
    readonly url: string;
    readonly isVisible: boolean;
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
    readonly region?: [];
    readonly countryCode?: number;
    readonly contractAmount?: number;
    readonly currencyType?: number;
    readonly description?: string;
    readonly productInfoDto?: IproductInfoDto;
    readonly planType?: number;
    paymentPlanDtos?: IPaymentPlanDto[];
    readonly attachInfoDtos: IattachDTO[];
    readonly signCustomerId?: number;
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
    readonly keyType?: string;
    readonly keyId?: number;
    readonly id?: number;
    readonly fileSuffix?: string;
    readonly filePath: string;
    readonly fileUploadTime?: string;
}

export interface IResponseData {
    readonly total: number | undefined;
    readonly size: number | undefined;
    readonly current: number | undefined;
    readonly parentCode: string;
    readonly records: [];
}

/**
 * Abstract Contract Setting
 */
export default abstract class AbstractContractSetting<P extends RouteComponentProps, S extends IAbstractContractSettingState> extends AbstractFillableComponent<P, S> {

    public state: S = {
        contract: {},
        checkList: [],
        url: '',
        isVisible: false
    } as S;

    public async componentDidMount() {
        super.componentDidMount();
        this.getRegionInfo({}); 
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
            checkList: checked,
        })
    }

    public  getRegionInfo = async (record: Record<string, any>) => {
        const resData: [] = await RequestUtil.get(`/tower-system/region/${ '00' }`);
        this.setState({
            regionInfoData:  resData
        })
    }

    public onRegionInfoChange =  async (record: Record<string, any>,selectedOptions?: CascaderOptionType[] | any) => {
        if( selectedOptions.length > 0 && selectedOptions.length < 3 ) {
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
        console.log(selectedRows)
        if(selectedRows.length > 0 ) {
            this.setState({
                contract: {
                    ...(contract || {}),
                    signCustomerName: selectedRows[0].name,
                    signCustomerId: selectedRows[0].id
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
                    signCustomerName: selectedRows[0].name,
                    signCustomerId: selectedRows[0].id
                }
            })
            this.getForm()?.setFieldsValue(select);
            this.getForm()?.setFieldsValue({ signCustomerName: selectedRows[0].name });
        }
    }

    /**
     * @description 验证业主联系电话格式
     */
    public checkcustomerPhone = (value: StoreValue): Promise<void | any> =>{
        return new Promise(async (resolve, reject) => {  // 返回一个promise
            const regPhone: RegExp = /^1[3|4|5|8][0-9]\d{8}$/;
            const regTel: RegExp = /^\d{3}-\d{8}|\d{4}-\d{7}$/;
            if(regPhone.test(value) || regTel.test(value) ) {
                resolve(true)
            } else 
                resolve(false)
        }).catch(error => {
            Promise.reject(error)
        })
    }

    /**
     * @description 验证合同编号是否重复
     */
    public checkContractNumber = (value: StoreValue): Promise<void | any> =>{
        return new Promise(async (resolve, reject) => {  // 返回一个promise
            const resData = await RequestUtil.get('/tower-market/contract/isContractNumberRepeated', {
                contractId: this.state.contract?.id,
                contractNumber: value
            });
            if (!resData) {
                resolve(!resData)
            } else {
                resolve(false)
            }
        }).catch(error => {
            Promise.reject(error)
        })
    }

    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
            const contract: IContract | undefined = this.state.contract;
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
                        validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                            if(value && value != '') {
                                this.checkContractNumber(value).then(res => {
                                    if (res) {
                                        callback()
                                    } else {
                                        callback('合同编号重复')
                                    }
                                })
                            } else {
                                callback('请输入合同编号')
                            }
                        }
                    }],
                    children: <Input value={ contract?.contractNumber }/>
                }, {
                    label: '内部合同编号',
                    name: 'internalNumber',
                    initialValue: contract?.internalNumber,
                    children: <Input disabled/>
                }, {
                    label: '工程名称',
                    name: 'projectName',
                    initialValue: contract?.projectName,
                    rules: [{
                        required: true,
                        message: '请输入工程名称'
                    }],
                    children: <Input maxLength={ 100 }/>
                }, {
                    label: '工程简称',
                    name: 'simpleProjectName',
                    initialValue: contract?.simpleProjectName,
                    children: <Input maxLength={ 50 }/>
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
                    children: <Input maxLength={ 30 }/>
                }, {
                    label: '业主联系电话',
                    name: 'customerPhone',
                    initialValue: contract?.customerInfoDto?.customerPhone,
                    children: <Input maxLength={ 30 }/>,
                    rules: [{
                        validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                            this.checkcustomerPhone(value).then(res => {
                                if (res) {
                                    callback()
                                } else {
                                    callback('业主联系电话格式有误')
                                }
                            })
                        }
                    }],
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
                    children:  <DatePicker format="YYYY-MM-DD"/>
                }, {
                    label: '签订人',
                    name: 'signUserName',
                    initialValue: contract?.signUserName,
                    rules: [{
                        required: true,
                        message: '请输入签订人'
                    }],
                    children:  <Input maxLength={ 20 }/>
                }, {
                    label: '要求交货日期',
                    name: 'deliveryTime',
                    initialValue: moment(contract?.deliveryTime),
                    rules: [{
                        required: true,
                        message: '请选择要求交货日期'
                    }],
                    children:  <DatePicker format="YYYY-MM-DD"/>
                }, {
                    label: '评审时间',
                    name: 'reviewTime',
                    initialValue: moment(contract?.reviewTime),
                    children:  <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                }, {
                    label: '所属国家',
                    name: 'countryCode',
                    initialValue: contract?.countryCode,
                    rules: [{
                        required: true,
                        message: '请选择所属国家'
                    }],
                    children: (
                        <Select onChange={ (value: number) => {
                            this.getForm()?.setFieldsValue({ countryCode: value, regionInfoDTO: [] })
                            this.setState({
                                contract: {
                                    ...(contract || {}),
                                    countryCode: value
                                }
                            })
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
                    children:  <Input maxLength={ 20 }/>
                }, {
                    label: '计价方式',
                    name: 'chargeType',
                    initialValue: contract?.chargeType,
                    rules: [{
                        required: true,
                        message: '请选择选择计价方式'
                    }],
                    children: (
                        <Select>
                            <Select.Option value={ 1 }>订单总价、总重计算单价</Select.Option>
                            <Select.Option value={ 2 }>产品单价、基数计算总价</Select.Option>
                        </Select>
                    )
                }, {
                    label: '所属区域',
                    name: 'regionInfoDTO',
                    initialValue: contract?.region,
                    rules: [{
                        required: this.getForm()?.getFieldValue('countryCode') === 2 ? false : true,
                        message: '请选择所属区域'
                    }],
                    children: (
                        <Cascader
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
                    rules: [{
                        required: true,
                        message: '请输入合同总价'
                    }],
                    children: <InputNumber min="0" step="0.01" stringMode={ false } precision={ 2 } prefix="￥"/>
                }, {
                    label: '币种',
                    name: 'currencyType',
                    initialValue: contract?.currencyType,
                    rules: [{
                        required: true,
                        message: '请选择币种'
                    }],
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
                }]}, {
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

    public render() {
        return <>
                {super.render()}
                <Modal visible={ this.state.isVisible }>
                    <iframe src={ this.state.url }frameBorder="0"></iframe>
                </Modal>
            </>
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
                            <Radio.Group onChange={ (e: RadioChangeEvent) => {
                                this.setState({
                                    contract: {
                                        ...(contract || {}),
                                        planType: e.target.value
                                    }
                                })
                            } }>
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
                                                            <Form.Item { ...field } name={[field.name, 'returnedTime']} fieldKey={[field.fieldKey, 'returnedTime']} rules={[{
                                                                required: true,
                                                                message: '请选择计划回款日期'
                                                            }]}>
                                                                <DatePicker format="YYYY-MM-DD"/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 5 }>
                                                            <Form.Item { ...field } name={[field.name, 'returnedRate']} fieldKey={[field.fieldKey, 'returnedRate']} rules={[{
                                                                required: this.state.contract?.planType === 1 || this.state.contract?.planType === undefined,
                                                                message: '请输入计划回款占比'
                                                            }]}>
                                                                <Input disabled={ this.state.contract?.planType === 2 }/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 5 }>
                                                            <Form.Item { ...field } name={[field.name, 'returnedAmount']} fieldKey={[field.fieldKey, 'returnedAmount']} rules={[{
                                                                required: this.state.contract?.planType === 2,
                                                                message: '请输入计划回款金额'
                                                            }]}>
                                                                <InputNumber 
                                                                    stringMode={ false } 
                                                                    precision={ 2 }
                                                                    formatter={ value => `￥ ${ value }`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }
                                                                    parser={ value => value?.replace(/\$\s?|(,*)/g, '') || '' } 
                                                                    disabled={ this.state.contract?.planType === 1 || this.state.contract?.planType === undefined}/>
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
                                                <Upload  action={ () => {
                                                    const baseUrl: string | undefined = process.env.REQUEST_API_PATH_PREFIX;
                                                    return baseUrl+'sinzetech-resource/oss/put-file'
                                                } } onChange={ (info)=>{
                                                    if (info.file.status !== 'uploading') {
                                                        // console.log(info.file, info.fileList);
                                                    }
                                                    if (info.file.status === 'done') {
                                                        console.log(info.file, info.fileList); 
                                                        let index: number = 1;
                                                        if(this.state.contract.attachInfoDtos) {
                                                            index = this.state.contract.attachInfoDtos.length + 1;
                                                        } else {
                                                            index = 1;
                                                        } 
                                                        const contract: IContract = this.state.contract;
                                                        let attachInfoDtos: IattachDTO[] = contract.attachInfoDtos;
                                                        console.log(info.file.response.data.link)
                                                        const attachInfoItem: IattachDTO = {
                                                            name: info.file.response.data.name,
                                                            username: info.file.response.data.username,
                                                            fileSize: info.file.response.data.size,
                                                            description: '',
                                                            filePath: info.file.response.data.link,
                                                            id: info.file.response.data.attachId,
                                                            fileUploadTime: info.file.response.data.fileUploadTime,
                                                            fileSuffix: info.file.response.data.fileSuffix
                                                        };
                                                        operation.add(attachInfoItem);
                                                        if(attachInfoDtos) {
                                                            attachInfoDtos.push(attachInfoItem);  
                                                        } else {
                                                            attachInfoDtos = [attachInfoItem];
                                                        }
                                                        
                                                        this.setState({
                                                            contract: {
                                                                ...(contract || {}),
                                                                attachInfoDtos: attachInfoDtos
                                                            }
                                                        })
                                                    } else if (info.file.status === 'error') {
                                                        console.log(info.file, info.fileList);
                                                    }
                                                } } showUploadList= {false}>
                                                    <Button type="primary">添加</Button>
                                                </Upload>
                                                <Button type="primary" onClick={ ()=> {
                                                    let checked: any[] = this.state.checkList;
                                                    let attachInfoDtos: IattachDTO[] =  this.state.contract?.attachInfoDtos;
                                                    attachInfoDtos.map<IattachDTO>((items: IattachDTO, index: number): IattachDTO | any=> {
                                                        if(checked.includes(index)){
                                                            window.open(items.filePath)
                                                        }
                                                    })
                                                } }>下载</Button>
                                                <Button type="primary" onClick={ async ()=> {
                                                    let attachInfoDtos: any[] =  this.getForm()?.getFieldValue("attachInfoDtos");
                                                    let checked: any[] = this.state.checkList;
                                                    let batchId: any[] = [];
                                                    checked.map((item: any) => {
                                                        batchId.push(attachInfoDtos[item].id)
                                                    })
                                                    const resData: IResponseData = await RequestUtil.post(`/tower-system/attach/${ checked.join(',') }`)
                                                    if(resData) {
                                                        operation.remove(this.state.checkList)
                                                    }
                                                } }>删除</Button>
                                            </Space>
                                            {
                                                fields.map<React.ReactNode>((field: FormListFieldData, index: number): React.ReactNode => (
                                                    <Row key={ `${ field.name }_${ index }` } className={ styles.FormItem }>
                                                        <Col span={ 1 }>
                                                            <Checkbox value={ index } onChange={ this.checkChange }></Checkbox>
                                                        </Col>
                                                        <Col span={ 6 }>
                                                            <Form.Item { ...field } name={[field.name, 'name']} fieldKey={[field.fieldKey, 'name']}>
                                                                <Input disabled  className={ styles.Input }/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 2 }>
                                                            <Form.Item { ...field } name={[field.name, 'fileSize']} fieldKey={[field.fieldKey, 'fileSize']}>
                                                                <Input disabled  className={ styles.Input }/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 4 }>
                                                            <Form.Item { ...field } name={[field.name, 'fileUploadTime']} fieldKey={[field.fieldKey, 'fileUploadTime']}>
                                                                <Input disabled  className={ styles.Input }/>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={ 4 }>
                                                            <Form.Item { ...field } name={[field.name, 'username']} fieldKey={[field.fieldKey, 'userName']}>
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
                                                                <Button type="link" onClick={ async () => {
                                                                    let attachInfoDtos: IattachDTO =  this.state.contract?.attachInfoDtos[index];
                                                                    this.setState({
                                                                        isVisible: true,
                                                                        url: attachInfoDtos.filePath
                                                                    })
                                                                } }>预览</Button>
                                                                <Button type="link" onClick={
                                                                    () => {
                                                                        let attachInfoDtos: IattachDTO =  this.state.contract?.attachInfoDtos[index];
                                                                        window.open(attachInfoDtos.filePath);
                                                                    }
                                                                }>下载</Button>
                                                                <ConfirmableButton confirmTitle="要删除该附件吗？"
                                                                    type="link" placement="topRight"
                                                                    onConfirm={ async () => { 
                                                                        let attachInfoDtos =  this.getForm()?.getFieldValue("attachInfoDtos");
                                                                        const resData: IResponseData = await RequestUtil.post(`/tower-system/attach/${ attachInfoDtos[index].id }`)
                                                                        if(resData) {
                                                                            operation.remove(index);
                                                                        }
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

