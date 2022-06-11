/**
 * @author zyc
 * @copyright © 2021 
 */
import { Button, Col, DatePicker, Form, FormProps, Input, InputNumber, Radio, Row, Select, Cascader, TablePaginationConfig, RadioChangeEvent, message, Image } from 'antd';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';
import moment from 'moment';
import React, { createRef } from 'react';
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
import { currencyTypeOptions, planNameOptions, productTypeOptions, saleTypeOptions, voltageGradeOptions, winBidTypeOptions } from '../../../configuration/DictionaryOptions';
import { IContract } from '../../IContract';
import layoutStyles from '../../../layout/Layout.module.less';
import { Attachment, AttachmentRef } from '../../common';
export interface IAbstractContractSettingState extends IAbstractFillableComponentState {
    readonly tablePagination: TablePaginationConfig;
    readonly contract: IContractInfo;
    readonly checkList?: number[];
    readonly tableDataSource: [];
    readonly regionInfoData: [] | IRegion[];
    readonly region: string;
    readonly childData: [] | undefined;
    readonly col: [];
    readonly url: { link?: string | undefined, fileSuffix?: string | undefined };
    readonly isVisible: boolean;
    readonly attchRef: AttachmentRef;
    readonly biddingBatch?: string;
    readonly contractAdd?: any
}

export interface ITabItem {
    readonly label: string;
    readonly key: string | number;
}

export interface IContractInfo extends IContract {
    readonly ascriptionId: string;
    readonly customerInfoDto?: ICustomerInfoDto;
    paymentPlanDtos?: IPaymentPlanDto[];
    attachInfoDtos: IAttachDTO[];
    readonly customerInfoVo?: ICustomerInfoDto;
    readonly attachVos: IAttachDTO[];
    readonly paymentPlanVos?: IPaymentPlanDto[];
}

export interface ProjectContractInfo extends IContractInfo {
    readonly contractName: string;
    readonly contractTotalWeight: number;
    readonly contractPrice: number;
    readonly isIta: 0 | 1 | 2;
    readonly purchaseOrderNumber: string;
    readonly ecpContractNumber: string;
    readonly payCompanyName: string;
    readonly payType: number;
    readonly country: string;
    readonly regionOther: string;
    readonly takeOverUser: string;
    readonly takeOverTime: string;
    readonly payCompanyId: string;
    readonly isReceivedContract: number;
    readonly receivedContractShape: string; // 收到合同形式
    readonly contractPlanStatus: string; // 合同计划状态
    readonly contractFraction: number; // 合同份数
    readonly contractPage: number; // 合同页数
    readonly deliveryWay: string; // 交货方式
    readonly deliveryAddress: string; // 交货地点
    readonly description: string; // 备注
    readonly bidBatch: string; // 招标批次
    readonly payServiceManager: string; // 业务经理的id(跟单业务员)
    readonly ascriptionId: string; // 归属业务经理id
    readonly ascriptionName: string;// 归属业务经理 name
}

export interface ICustomerInfoDto {
    readonly customerId?: string | number;
    readonly customerCompany?: string;
    readonly customerLinkman?: string;
    readonly customerPhone?: string;
    readonly payType?: number;
}

export interface IPaymentPlanDto {
    readonly index?: number;
    readonly period?: number;
    readonly returnedTime?: any;
    readonly returnedRate: number;
    readonly returnedAmount: number;
    readonly description?: string;
}

export interface IAttachDTO {
    readonly name?: string;
    readonly userName?: string;
    readonly fileSize?: string;
    readonly description?: string;
    readonly keyType?: string;
    readonly keyId?: number;
    readonly id?: string;
    readonly fileSuffix?: string;
    readonly filePath: string;
    readonly fileUploadTime?: string;
    readonly index?: number;
}

export interface IResponseData {
    readonly total: number | undefined;
    readonly size: number | undefined;
    readonly current: number | undefined;
    readonly parentCode: string;
    readonly records: [];
}

export interface IRegion {
    readonly name: string;
    readonly code: string;
    children: IRegion[];
}

export enum planType {
    PROPORTION = 0,   //占比
    AMOUNT = 1,   //金额
}

/**
 * Abstract Contract Setting
 */
export default abstract class AbstractContractSetting<P extends RouteComponentProps, S extends IAbstractContractSettingState> extends AbstractFillableComponent<P, S> {
    private attachRef: React.RefObject<AttachmentRef> = createRef<AttachmentRef>()
    public state: S = {
        contract: {},
        url: { link: "", fileSuffix: "" },
        isVisible: false,
        region: "",
        biddingBatch: "",
        contractAdd: {}, // 项目带过来的数据
    } as S;

    public async componentDidMount() {
        super.componentDidMount();
        this.getRegionInfo({});
        this.getRegionInfoContract();
    }

    public getRegionInfoContract = async () => {
        const resData: any = await RequestUtil.get(`/tower-market/projectInfo/${(this.props.match.params as any).projectId}`);
        this.setState({
            biddingBatch: resData?.bidBatch,
            contractAdd: {
                ...resData,
                address: resData.address === "其他-国外" ? resData.address : ((!resData.bigRegion && !resData.address) ? "" : `${resData.bigRegion || ""}-${resData.address || ""}`)
            }
        })
        this.getForm()?.setFieldsValue({
            bidBatch: resData?.bidBatch,
            region: resData.address === "其他-国外" ? resData.address : ((!resData.bigRegion && !resData.address) ? "" : `${resData.bigRegion || ""}-${resData.address || ""}`),
            country: resData?.country || "",
        })
    }

    protected getAttchsRef(): AttachmentRef | null {
        return this.attachRef?.current
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
                span: 16,
                offset: 1
            }
        };
    }

    /**
     * @override
     * @description 附件表格选择
     * @returns 
     */
    public checkChange = (record: Record<string, any>): void => {
        let checked: number[] = this.state.checkList || [];
        if (record.target.checked) {
            checked.push(record.target.value);
        } else {
            checked = checked.filter((item: any) => item !== record.target.value);
        }
        this.setState({
            checkList: checked,
        })
    }

    public getRegionInfo = async (record: Record<string, any>) => {
        const resData: [] = await RequestUtil.get(`/tower-system/region/${'00'}`);
        this.setState({
            regionInfoData: resData
        })
    }

    public onRegionInfoChange = async (record: Record<string, any>, selectedOptions?: CascaderOptionType[] | any) => {
        if (selectedOptions.length > 0 && selectedOptions.length < 3) {
            let parentCode = record[selectedOptions.length - 1];
            const resData: [] = await RequestUtil.get(`/tower-system/region/${parentCode}`);
            const targetOption = selectedOptions[selectedOptions.length - 1];
            targetOption.children = resData;
        }
    }

    /**
     * @override
     * @description 弹窗
     * @returns 
     */
    public onSelect = (selectedRows: DataType[]): void => {
        const contract: IContractInfo | undefined = this.state.contract;
        if (selectedRows && selectedRows.length > 0) {
            this.setState({
                contract: {
                    ...(contract || {}),
                    signCustomerName: selectedRows[0].name,
                    signCustomerId: selectedRows[0].id?.toString()
                }
            })
            this.getForm()?.setFieldsValue({ signCustomerName: selectedRows[0].name });
        }
    }

    public onPayCompanyNameSelect = (selectedRows: DataType[]): void => {
        const contract: IContractInfo | undefined = this.state.contract;
        if (selectedRows && selectedRows.length > 0) {
            this.setState(({
                contract: {
                    ...(contract || {}),
                    payCompanyName: selectedRows[0].name,
                    payCompanyId: selectedRows[0].id?.toString()
                }
            }) as any)
            this.getForm()?.setFieldsValue({ payCompanyName: selectedRows[0].name });
        }
    }

    /**
     * 
     * @param selectedRows 当前选中的列
     * 业务经理弹框回调
     */
    public onServiceManager = (selectedRows: DataType[]): void => {
        const contract: IContractInfo | undefined = this.state.contract;
        if (selectedRows && selectedRows.length > 0) {
            this.setState(({
                contract: {
                    ...(contract || {}),
                    salesman: selectedRows[0].name,
                    payServiceManager: selectedRows[0].userId?.toString()
                }
            }) as any)
            console.log(selectedRows)
            this.getForm()?.setFieldsValue({ salesman: selectedRows[0].name, payServiceManager: selectedRows[0].userId?.toString() });
        }
    }


    /**
     * 
     * @param selectedRows 当前选中的列
     * 归属业务经理弹框回调
     */
     public onReBackServiceManager = (selectedRows: DataType[]): void => {
        const contract: IContractInfo | undefined = this.state.contract;
        if (selectedRows && selectedRows.length > 0) {
            this.setState(({
                contract: {
                    ...(contract || {}),
                    ascriptionName: selectedRows[0].name,
                    ascriptionId : selectedRows[0].userId?.toString()
                }
            }) as any)
            console.log(selectedRows)
            this.getForm()?.setFieldsValue({ ascriptionName: selectedRows[0].name, ascriptionId: selectedRows[0].userId?.toString() });
        }
    }

    public onCustomerCompanySelect = (selectedRows: DataType[]): void => {
        const contract: IContractInfo | undefined = this.state.contract;
        if (selectedRows && selectedRows.length > 0) {
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
                    // signCustomerName: selectedRows[0].name,
                    // signCustomerId: selectedRows[0].id,
                }
            })
            this.getForm()?.setFieldsValue(select);
            // this.getForm()?.setFieldsValue({ signCustomerName: selectedRows[0].name });
        }
    }
    public onCustomerNameSelect = (selectedRows: DataType[]): void => {
        const contract: IContractInfo | undefined = this.state.contract;
        if (selectedRows && selectedRows.length > 0) {
            const select = {
                customerId: selectedRows[0].id,
                customerCompany: selectedRows[0].name,
                customerLinkman: selectedRows[0].linkman,
                customerPhone: selectedRows[0].phone
            }
            this.setState({
                contract: {
                    ...(contract || {}),
                    // customerInfoDto: select,
                    signCustomerName: selectedRows[0].name,
                    signCustomerId: selectedRows[0].id,
                }
            })
            this.getForm()?.setFieldsValue(select);
            this.getForm()?.setFieldsValue({ signCustomerName: selectedRows[0].name });
        }
    }

    /**
     * @description 验证合同编号是否重复
     */
    public checkContractNumber = (value: StoreValue) => {
        // return new Promise(async (resolve, reject) => {  // 返回一个promise
        //     const resData = await RequestUtil.get('/tower-market/contract/isContractNumberRepeated', {
        //         contractId: this.state.contract?.id,
        //         contractNumber: value
        //     });
        //     if (!resData) {
        //         resolve(!resData)
        //     } else {
        //         resolve(false)
        //     }
        // }).catch(error => {
        //     Promise.reject(error)
        // })
    }

    /**
     * @description 验证回款总占比&计算回款金额
     */
    public checkReturnedRate(index: number): void {
        const planValue: IPaymentPlanDto[] = this.getForm()?.getFieldsValue(true).paymentPlanDtos;
        const contractAmount: number = this.getForm()?.getFieldValue("contractAmount");
        if (this.getForm()?.getFieldValue("contractAmount") && planValue[index] && planValue[index].returnedRate !== undefined) {
            planValue[index] = {
                ...planValue[index],
                returnedAmount: parseFloat((contractAmount * planValue[index].returnedRate * 0.01).toFixed(2))
            }
            this.getForm()?.setFieldsValue({
                planValue: planValue
            })
            let totalRate: number = 0;
            planValue.map<number>((item: IPaymentPlanDto): number => {
                return totalRate = Number(item.returnedRate) + Number(totalRate);
            })
            let totalAmount: number = 0;
            planValue.map<number>((item: IPaymentPlanDto): number => {
                return totalAmount = Number(item.returnedAmount) + Number(totalAmount);
            })
            if (totalRate > 100) {
                message.info('计划回款总占比不得大于100%！');
                planValue[index] = {
                    ...planValue[index],
                    returnedRate: parseFloat((100 - (totalRate - planValue[index].returnedRate)).toFixed(2)),
                    returnedAmount: parseFloat((contractAmount - (totalAmount - planValue[index].returnedAmount)).toFixed(2))
                }
                this.getForm()?.setFieldsValue({
                    planValue: planValue
                })
            } else if (totalRate === 100) {
                planValue[index] = {
                    ...planValue[index],
                    returnedRate: parseFloat((100 - (totalRate - planValue[index].returnedRate)).toFixed(2)),
                    returnedAmount: parseFloat((contractAmount - (totalAmount - planValue[index].returnedAmount)).toFixed(2))
                }
                this.getForm()?.setFieldsValue({
                    planValue: planValue
                })
            }
        }
    }

    /**
     * @description 验证回款总金额&计算回款占比
     */
    public checkReturnedAmount(index: number): void {
        const planValue: IPaymentPlanDto[] = this.getForm()?.getFieldsValue(true).paymentPlanDtos;
        const contractAmount: number = this.getForm()?.getFieldValue("contractAmount");
        if (this.getForm()?.getFieldValue("contractAmount") && planValue[index] && planValue[index].returnedAmount !== undefined) {
            planValue[index] = {
                ...planValue[index],
                returnedRate: parseFloat((planValue[index].returnedAmount / contractAmount * 100).toFixed(2))
            }
            this.getForm()?.setFieldsValue({
                planValue: planValue
            })
            let totalRate: number = 0;
            planValue.map<number>((item: IPaymentPlanDto): number => {
                return totalRate = Number(item.returnedRate) + Number(totalRate.toFixed(2));
            })
            let totalAmount: number = 0;
            planValue.map<number>((item: IPaymentPlanDto): number => {
                return totalAmount = Number(item.returnedAmount) + Number(totalAmount.toFixed(2));
            })
            if (totalAmount > contractAmount) {
                message.info('计划回款总金额不得大于合同总价！');
                planValue[index] = {
                    ...planValue[index],
                    returnedRate: parseFloat((100 - (totalRate - planValue[index].returnedRate)).toFixed(2)),
                    returnedAmount: parseFloat((contractAmount - (totalAmount - planValue[index].returnedAmount)).toFixed(2))
                }
                this.getForm()?.setFieldsValue({
                    planValue: planValue
                })
            } else if (totalAmount === contractAmount) {
                planValue[index] = {
                    ...planValue[index],
                    returnedRate: parseFloat((100 - (totalRate - planValue[index].returnedRate)).toFixed(2)),
                    returnedAmount: parseFloat((contractAmount - (totalAmount - planValue[index].returnedAmount)).toFixed(2))
                }
                this.getForm()?.setFieldsValue({
                    planValue: planValue
                })
            }
        }
    }

    /**
     * @description 输入总价时计算占比/金额
     */
    public contractAmountBlur(): void {
        let planValue: IPaymentPlanDto[] = this.getForm()?.getFieldsValue(true).paymentPlanDtos;
        const contractAmount: number = this.getForm()?.getFieldValue("contractAmount");
        const contractTotalWeight: number = this.getForm()?.getFieldValue("contractTotalWeight");
        planValue.map<void>((item: IPaymentPlanDto, index: number): void => {
            if (this.getForm()?.getFieldValue("contractAmount") && planValue[index] && planValue[index].returnedRate !== undefined) {
                planValue[index] = {
                    ...planValue[index],
                    returnedAmount: parseFloat((contractAmount * planValue[index].returnedRate * 0.01).toFixed(2))
                }
                let totalRate: number = 0;
                planValue.map<number>((item: IPaymentPlanDto): number => {
                    return totalRate = Number(item.returnedRate) + Number(totalRate.toFixed(2));
                })
                let totalAmount: number = 0;
                planValue.map<number>((item: IPaymentPlanDto): number => {
                    return totalAmount = Number(item.returnedAmount) + Number(totalAmount.toFixed(2));
                })
                if (totalAmount > contractAmount) {
                    planValue[index] = {
                        ...planValue[index],
                        returnedAmount: parseFloat((contractAmount - (totalAmount - planValue[index].returnedAmount)).toFixed(2))
                    }
                    this.getForm()?.setFieldsValue({
                        planValue: planValue
                    })
                } else if (totalAmount === contractAmount) {
                    planValue[index] = {
                        ...planValue[index],
                        returnedAmount: parseFloat((contractAmount - (totalAmount - planValue[index].returnedAmount)).toFixed(2))
                    }
                    this.getForm()?.setFieldsValue({
                        planValue: planValue
                    })
                }
            }

        })
        this.getForm()?.setFieldsValue({
            planValue: planValue,
            contractPrice: (contractAmount > 0 && contractTotalWeight > 0) ? parseFloat((contractAmount / contractTotalWeight).toFixed(2)) : ""
        })
    }

    public onContractTotalWeightChange() {
        const contractAmount: number = this.getForm()?.getFieldValue("contractAmount");
        const contractTotalWeight: number = this.getForm()?.getFieldValue("contractTotalWeight");

        this.getForm()?.setFieldsValue({
            contractPrice: parseFloat((contractAmount / contractTotalWeight).toFixed(2))
        })
    }
    public regionChange(value: string) {
        this.setState({ region: value })
    }
    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        const contract: IContractInfo | undefined = this.state.contract;
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
                    message: "请输入合同编号"
                }],
                children: <Input value={contract?.contractNumber} maxLength={50} />
            }, {
                label: '内部合同编号',
                name: 'internalNumber',
                initialValue: contract?.internalNumber,
                children: <Input placeholder="内部合同编号自动生成" disabled />
            }, {
                label: '工程名称',
                name: 'projectName',
                initialValue: contract?.projectName,
                rules: [{
                    required: true,
                    message: '请输入工程名称'
                }],
                children: <Input maxLength={100} />
            }, {
                label: '工程简称',
                name: 'simpleProjectName',
                initialValue: contract?.simpleProjectName,
                children: <Input maxLength={50} />
            }, {
                label: '中标类型',
                name: 'winBidType',
                initialValue: contract?.winBidType,
                children: (
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                        {winBidTypeOptions && winBidTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                )
            }, {
                label: '销售类型',
                name: 'saleType',
                initialValue: contract?.saleType,
                children: (
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                        {saleTypeOptions && saleTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
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
                children: (<Input value={contract?.customerInfoDto?.customerCompany} suffix={
                    <ClientSelectionComponent onSelect={this.onCustomerCompanySelect} selectKey={[contract.customerInfoDto?.customerId]} />
                } />)
            }, {
                label: '业主联系人',
                name: 'customerLinkman',
                initialValue: contract?.customerInfoDto?.customerLinkman,
                children: <Input value={contract?.customerInfoDto?.customerLinkman} maxLength={30} />
            }, {
                label: '业主联系电话',
                name: 'customerPhone',
                initialValue: contract?.customerInfoDto?.customerPhone,
                children: <Input value={contract?.customerInfoDto?.customerPhone} maxLength={30} />
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
                        <Input value={contract?.signCustomerName} suffix={
                            <ClientSelectionComponent onSelect={this.onSelect} selectKey={[contract.signCustomerId]} />
                        } />
                    </>
            }, {
                label: '合同签订日期',
                name: 'signContractTime',
                initialValue: contract?.signContractTime ? moment(contract?.signContractTime) : '',
                rules: [{
                    required: true,
                    message: '请选择合同签订日期'
                }],
                children: <DatePicker format="YYYY-MM-DD" />
            }, {
                label: '签订人',
                name: 'signUserName',
                initialValue: contract?.signUserName,
                rules: [{
                    required: true,
                    message: '请输入签订人'
                }],
                children: <Input maxLength={20} />
            }, {
                label: '要求交货日期',
                name: 'deliveryTime',
                initialValue: contract?.deliveryTime ? moment(contract?.deliveryTime) : '',
                rules: [{
                    required: true,
                    message: '请选择要求交货日期'
                }],
                children: <DatePicker format="YYYY-MM-DD" />
            }, {
                label: '评审时间',
                name: 'reviewTime',
                initialValue: contract?.reviewTime ? moment(contract?.reviewTime) : '',
                children: <DatePicker showTime format="YYYY-MM-DD HH:mm" />
            }, {
                label: '所属国家',
                name: 'countryCode',
                initialValue: contract?.countryCode,
                rules: [{
                    required: true,
                    message: '请选择所属国家'
                }],
                children: (
                    <Select onChange={(value: number) => {
                        this.getForm()?.setFieldsValue({ countryCode: value, regionInfoDTO: [], region: [] })
                        this.setState({
                            contract: {
                                ...(contract || {}),
                                countryCode: value,
                                region: []
                            }
                        })
                    }}
                        getPopupContainer={triggerNode => triggerNode.parentNode}>
                        <Select.Option value={0}>中国</Select.Option>
                        <Select.Option value={1}>海外</Select.Option>
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
                children: <Input maxLength={20} />
            }, {
                label: '计价方式',
                name: 'chargeType',
                initialValue: contract?.chargeType,
                rules: [{
                    required: true,
                    message: '请选择选择计价方式'
                }],
                children: (
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                        <Select.Option value={0}>订单总价、总重计算单价</Select.Option>
                        <Select.Option value={1}>产品单价、基数计算总价</Select.Option>
                    </Select>
                )
            }, {
                label: '所属区域',
                name: 'region',
                initialValue: contract?.region,
                rules: [{
                    required: this.getForm()?.getFieldValue('countryCode') === 1 || contract?.countryCode === 1 ? false : true,
                    message: '请选择所属区域'
                }, {
                    validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                        if (!(this.getForm()?.getFieldValue('countryCode') === 1 || contract?.countryCode === 1)) {
                            if (value.length >= 2) {
                                callback();
                            } else {
                                callback('所属区域需选择到市级');
                            }
                        } else {
                            callback();
                        }
                    }
                }],
                children: (
                    <Cascader
                        fieldNames={{ label: 'name', value: 'code' }}
                        options={this.state.regionInfoData}
                        onChange={this.onRegionInfoChange}
                        changeOnSelect
                        disabled={this.getForm()?.getFieldValue('countryCode') === 1 || contract?.countryCode === 1}
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
                children: <InputNumber min="0.01" max="10000000000.00" step="0.01" stringMode={false} precision={2} prefix="￥" onChange={() => this.contractAmountBlur()} className={layoutStyles.width100} />
            }, {
                label: '币种',
                name: 'currencyType',
                initialValue: contract?.currencyType,
                rules: [{
                    required: true,
                    message: '请选择币种'
                }],
                children: (
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                        {currencyTypeOptions && currencyTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                )
            }, {
                label: '备注',
                name: 'description',
                initialValue: contract?.description,
                children: <Input.TextArea rows={5} showCount={true} maxLength={300} placeholder="请输入备注信息" />
            }]
        }, {
            title: '产品信息',
            itemCol: {
                span: 12
            },
            itemProps: [{
                label: '产品类型',
                name: 'productType',
                initialValue: contract?.productType,
                children: (
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                        {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                )
            }, {
                label: '电压等级',
                name: 'voltageGrade',
                initialValue: contract?.voltageGrade,
                children: (
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                        {voltageGradeOptions && voltageGradeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}KV
                            </Select.Option>
                        })}
                    </Select>
                )
            }]
        }]];
    }

    public modalCancel = (): void => {
        this.setState({
            isVisible: false
        })
    }

    public render() {
        return <>
            {super.render()}
            <Modal visible={this.state.isVisible} onCancel={this.modalCancel} onOk={this.modalCancel} width={"60%"}>
                {this.state.url.fileSuffix && this.state.url.fileSuffix !== "pdf" && <Image src={this.state.url.link} preview={false} />}
            </Modal>
        </>
    }
    protected renderExtraOperationArea(): React.ReactNode {
        return [];
    }
    /**
     * @description Renders extra sections
     * @returns extra sections 
     */
    public renderExtraSections(): IRenderedSection[] {
        const contract: IContractInfo | undefined = this.state.contract;
        return [{
            title: '回款计划',
            render: (): React.ReactNode => {
                return (
                    <>
                        <Form.Item name="planType" style={{ margin: 0 }} initialValue={contract?.planType || 0}>
                            <Radio.Group style={{ position: "relative", top: "7px" }} onChange={(e: RadioChangeEvent) => {
                                this.setState({
                                    contract: {
                                        ...(contract || {}),
                                        planType: e.target.value
                                    }
                                })
                            }}>
                                <Radio value={planType.PROPORTION}>按占比</Radio>
                                <Radio value={planType.AMOUNT}>按金额</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.List name="paymentPlanDtos" initialValue={contract?.paymentPlanDtos || []}>
                            {
                                (fields: FormListFieldData[], operation: FormListOperation): React.ReactNode => {
                                    return (
                                        <>
                                            <Button type="primary" onClick={() => (operation.add({ returnedRate: 0, returnedAmount: 0 }))} className={styles.btn}>新增一行</Button>
                                            <Row className={styles.FormHeader}>
                                                <Col span={2}>期次</Col>
                                                <Col span={4}>计划名称</Col>
                                                <Col span={4}>计划回款日期</Col>
                                                <Col span={4}>计划回款占比(%)</Col>
                                                <Col span={4}>计划回款金额</Col>
                                                <Col span={4}>备注</Col>
                                                <Col span={2}>操作</Col>
                                            </Row>
                                            {
                                                fields.map<React.ReactNode>((field: FormListFieldData, index: number): React.ReactNode => (
                                                    <Row key={`${field.name}_${index}`} className={styles.FormItem}>
                                                        <Col span={2} style={{ height: "32px", lineHeight: "32px" }}>{index + 1}</Col>
                                                        <Col span={4}>
                                                            <Form.Item
                                                                style={{ margin: 0 }}
                                                                {...field}
                                                                name={[field.name, 'name']}
                                                                fieldKey={[field.fieldKey, 'name']}
                                                                rules={[{
                                                                    required: true,
                                                                    message: '请选择计划名称'
                                                                }]}
                                                            >
                                                                <Select style={{width:'100%'}}>
                                                                    { planNameOptions && planNameOptions.map((item:any)=>{
                                                                            return <Select.Option key={item.id} value={item.name}>{item.name}</Select.Option>
                                                                        }) }
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={4}>
                                                            <Form.Item
                                                                style={{ margin: 0 }}
                                                                {...field}
                                                                name={[field.name, 'returnedTime']}
                                                                fieldKey={[field.fieldKey, 'returnedTime']}
                                                                rules={[{
                                                                    required: true,
                                                                    message: '请选择计划回款日期'
                                                                }]}
                                                            >
                                                                <DatePicker format="YYYY-MM-DD" />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={4}>
                                                            <Form.Item
                                                                style={{ margin: 0 }} {...field} name={[field.name, 'returnedRate']} fieldKey={[field.fieldKey, 'returnedRate']} rules={[{
                                                                    required: this.state.contract?.planType === planType.PROPORTION || this.state.contract?.planType === undefined,
                                                                    message: '请输入计划回款占比'
                                                                }, {
                                                                    validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                                                                        if (value > 0) {
                                                                            callback()
                                                                        } else {
                                                                            callback('计划回款占比需大于0')
                                                                        }
                                                                    }
                                                                }]}>
                                                                <InputNumber
                                                                    stringMode={false}
                                                                    min="0"
                                                                    step="0.01"
                                                                    precision={2}
                                                                    onChange={() => this.checkReturnedRate(index)}
                                                                    disabled={this.state.contract?.planType === planType.AMOUNT}
                                                                    className={layoutStyles.width100} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={4}>
                                                            <Form.Item
                                                                style={{ margin: 0 }} {...field} name={[field.name, 'returnedAmount']} fieldKey={[field.fieldKey, 'returnedAmount']} rules={[{
                                                                    required: this.state.contract?.planType === planType.AMOUNT,
                                                                    message: '请输入计划回款金额'
                                                                }, {
                                                                    validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                                                                        if (value > 0) {
                                                                            callback()
                                                                        } else {
                                                                            callback('计划回款金额需大于0')
                                                                        }
                                                                    }
                                                                }]}>
                                                                <InputNumber
                                                                    stringMode={false}
                                                                    min="0"
                                                                    step="0.01"
                                                                    precision={2}
                                                                    onChange={() => this.checkReturnedAmount(index)}
                                                                    disabled={this.state.contract?.planType === planType.PROPORTION || this.state.contract?.planType === undefined}
                                                                    className={layoutStyles.width100} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={4}>
                                                            <Form.Item
                                                                style={{ margin: 0 }} {...field} name={[field.name, 'description']} fieldKey={[field.fieldKey, 'description']}>
                                                                <Input.TextArea rows={1} maxLength={300} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={2}>
                                                            <ConfirmableButton confirmTitle="要删除该条回款计划吗？"
                                                                type="link" placement="topRight"
                                                                onConfirm={() => { operation.remove(index); }}>
                                                                <Button type="link">删除</Button>
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
        }, {
            title: '',
            render: (): React.ReactNode => {
                return (<Attachment ref={this.attachRef} title={'附件'} edit dataSource={this.state.contract.attachInfoDtos} />)
            }
        }];
    }
}

