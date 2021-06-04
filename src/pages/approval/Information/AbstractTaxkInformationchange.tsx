/**
 * @author zyc
 * @copyright © 2021 
 */
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Form, FormProps, Input, InputNumber, Radio, Row, Table, Select, Space, Upload, Checkbox, Cascader, TablePaginationConfig, RadioChangeEvent } from 'antd';
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
import styles from './AbstractTaxkapproval.module.less';
import ClientSelectionComponent from '../../../components/ClientSelectionModal';
import RequestUtil from '../../../utils/RequestUtil';
import { DataType } from '../../../components/AbstractSelectableModal';
import { CascaderOptionType } from 'antd/lib/cascader';
import { SelectValue } from 'antd/lib/select';
import { RuleObject } from 'antd/lib/form';
import { StoreValue } from 'antd/lib/form/interface';
import { render } from 'nprogress';
import Modal from 'antd/lib/modal/Modal';

export interface IAbstractContractSettingState extends IAbstractFillableComponentState {
    readonly tablePagination: TablePaginationConfig;
    readonly contract: IContract;
    readonly checkList: [];
    readonly tableDataSource: [];
    readonly regionInfoData: [];
    readonly childData: [] | undefined;
    readonly col: [];
    readonly url: string;
    readonly isVisible: boolean;
}

export interface ITabItem {
    readonly label?: string;
    readonly keys: string | number;
    readonly dataIndex: string | number;
    readonly title: string | number;

}


export interface IContract {
    readonly id?: number;
    readonly amount :number;
    readonly  price :number;
    readonly exchangeRate:number;
    readonly guaranteeAmount: number;
    readonly guaranteeType :string;
    readonly foreignExchangeAmount:number;
    readonly  foreignPrice :string;
    readonly  insuranceCharge : number;
    readonly  portCharge :number;
    readonly  creditInsurance :number;
    readonly   commissionCharge :number;
    readonly  orderDeliveryTime :string;
    readonly saleOrderNumber?: string;
    readonly internalNumber?: string;
    readonly projectName?: string;
    readonly simpleProjectName?: string;
    readonly taxPrice :string;
    readonly winBidType?: number;
    readonly saleType?: number;
    readonly taxRate? :number;
    readonly orderQuantity?: number;
    readonly customerCompany?: string
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
export default abstract class AbstractTaxkInformationchange<P extends RouteComponentProps, S extends IAbstractContractSettingState> extends AbstractFillableComponent<P, S> {

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
    protected onChange(value: string): string {
        return value
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
        var result: number = Math.floor(Math.random() * 1000);
        let num: string = '';
        if (result < 10) {
            num = '00' + result;
        } else if (result < 100) {
            num = '0' + result;
        } else {
            num = result.toString();
        }
        return moment().format('YYYYMMDD') + num;
    }


    public getRegionInfo = async (record: Record<string, any>) => {
        const resData: IResponseData = await RequestUtil.get<IResponseData>(`/tower-system/region`);
        this.setState({
            regionInfoData: resData.records
        })
    }

    public onRegionInfoChange = async (record: Record<string, any>, selectedOptions?: CascaderOptionType[] | any) => {
        if (selectedOptions.length < 3) {
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
        const contract: IContract | undefined = this.state.contract;
        if (selectedRows.length > 0) {
            this.setState({
                contract: {
                    ...(contract || {}),
                    signCustomerName: selectedRows[0].name
                }
            })
            this.getForm()?.setFieldsValue({ signCustomerName: selectedRows[0].name });
        }
    }

    public onCustomerCompanySelect = (selectedRows: DataType[]): void => {
        const contract: IContract | undefined = this.state.contract;
        if (selectedRows.length > 0) {
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
                label: '订单编号',
                name: 'saleOrderNumber',
                initialValue: contract?.saleOrderNumber,
                children: <Input value={contract?.saleOrderNumber} disabled />
            }, {
                label: "采购订单号",
                name: "contractno",
                initialValue: contract?.internalNumber || GeneratNum,
                children: <Input maxLength={50} value={contract?.internalNumber} disabled />
            }, {
                label: '关联合同编号',
                name: 'internalNumber',
                initialValue: contract?.internalNumber,

                children: <Input maxLength={100} value={contract?.internalNumber} disabled />
            }, {
                label: '内部合同编号',
                name: 'simpleProjectName',
                initialValue: contract?.simpleProjectName,
                children: <Input value={contract?.signCustomerName} disabled />
            }, {
                label: '工程名称',
                name: 'projectName',
                initialValue: contract?.projectName,
                children: (
                    <Input maxLength={50} value={contract?.projectName} disabled />
                )
            }, {
                label: '业主单位',
                name: 'customerCompany',
                initialValue: contract?.customerCompany,
                children: <Input value={contract?.customerCompany} disabled />
            }, {
                label: '合同签订单位',
                name: 'signCustomerName',
                initialValue: contract?.signCustomerName,
                children: <Input value={contract?.signCustomerName} disabled />
            }, {
                label: '计价方式',
                name: 'chargeType',
                initialValue: contract?.chargeType,
                children: (
                    <Select disabled={contract?.chargeType ? true : false}>
                        <Select.Option value={1}>订单总价、总重计算单价</Select.Option>
                        <Select.Option value={2}>产品单价、基数计算总价</Select.Option>
                    </Select>
                )
            }, {
                label: '币种',
                name: 'currencyType',
                initialValue: contract?.currencyType,
                children:
                    <Select>
                        <Select.Option value={1}>RMB人民币</Select.Option>
                        <Select.Option value={2}>USD美元</Select.Option>
                    </Select>
            }, {
                label: '订单数量',
                name: 'orderQuantity',
                initialValue: contract?.orderQuantity,
                children: <InputNumber min="0" step="0.01" stringMode={false} precision={2} prefix="￥" />
            }, {
                label: '含税金额',
                name: 'contractAmount',
                initialValue: contract?.contractAmount,
                children:
                    <InputNumber min="0" step="0.01" stringMode={false} precision={2} prefix="￥" />
            }, {
                label: '含税单价',
                name: 'taxPrice',
                initialValue: contract?.taxPrice,
                children: <InputNumber min="0" step="0.01" stringMode={false} precision={2} prefix="￥" />
            }, {
                label: '税率',
                name: 'taxRate',
                initialValue: contract?.taxRate,
                children: <Input disabled />
            }, {
                label: '不含税金额',
                name: 'amount',
                initialValue: contract?.amount,
                children: <Input disabled />
            }, {
                label: '不含税单价',
                name: 'price',
                initialValue: contract?.price,
                children: <Input disabled />
            }, {
                label: '汇率',
                name: 'exchangeRate',
                initialValue: contract?.exchangeRate,
                children: <InputNumber min="0" step="0.01" stringMode={false} precision={4} prefix="￥" />
            }, {
                label: '外汇金额',
                name: 'foreignExchangeAmount',
                initialValue: contract?.foreignExchangeAmount,
                children: <InputNumber min="0" step="0.01" stringMode={false} precision={2} prefix="￥" />
            }, {
                label: '外汇单价',
                name: 'foreignPrice',
                initialValue: contract?.foreignPrice,
                children: <InputNumber min="0" step="0.01" stringMode={false} precision={4} prefix="￥" />
            }, {
                label: '保函类型',
                name: 'guaranteeType',
                initialValue: contract?.guaranteeType,
                children: <Input min="0" max="50" />
            }, {
                label: '保函金额',
                name: 'guaranteeAmount',
                initialValue: contract?.guaranteeAmount,
                children: <InputNumber min="0" step="0.01" stringMode={false} precision={2} prefix="￥" />
            }, {
                label: '港口费用',
                name: 'portCharge',
                initialValue: contract?.portCharge,
                children: <InputNumber min="0" step="0.01" stringMode={false} precision={4} prefix="￥" />
            }, {
                label: '海运及保险费',
                name: 'insuranceCharge',
                initialValue: contract?.insuranceCharge,
                children: <InputNumber min="0" step="0.01" stringMode={false} precision={4} prefix="￥" />
            }, {
                label: '佣金',
                name: 'commissionCharge',
                initialValue: contract?.commissionCharge,
                children: <InputNumber min="0" step="0.01" stringMode={false} precision={4} prefix="￥" />
            }, {
                label: '出口信用保险金',
                name: 'creditInsurance',
                initialValue: contract?.creditInsurance,
                children: <InputNumber min="0" step="0.01" stringMode={false} precision={4} prefix="￥" />
            }, {
                label: '订单交货日期',
                name: 'orderDeliveryTime',
                initialValue: moment(contract?.orderDeliveryTime),
                children: <DatePicker format="YYYY-MM-DD" />
            }, {
                label: '备注',
                name: 'description',
                initialValue: contract?.description,
                children: <Input.TextArea disabled value={contract?.description} rows={5} showCount={true} maxLength={300} />
            }]

        }]];
    }
    public getFormcolumns(): ITabItem[] {
        return [
            {
                keys: 'taskNumber',
                title: '类型',
                dataIndex: 'taskNumber',

            },
            {
                keys: 'businessType',
                title: '版本',
                dataIndex: 'businessType',

            },
            {
                keys: 'internalNumber',
                title: '线路名称',
                dataIndex: 'internalNumber',

            },
            {
                keys: 'productTypeName',
                title: '产品类型',
                dataIndex: 'productTypeName',

            },
            {
                keys: 'productShape',
                title: '塔型',
                dataIndex: 'productShape',

            },
            {
                keys: 'voltageGrade',
                title: '电压等级',
                dataIndex: 'voltageGrade',

            },
            {
                keys: 'productHeight',
                title: '呼高 (米)',
                dataIndex: 'productHeight',

            },
            {
                keys: 'unit',
                title: '单位',
                dataIndex: 'unit',

            },
            {
                keys: 'num',
                title: '数量',
                dataIndex: 'num',

            },
            {
                keys: 'tender',
                title: '标段',
                dataIndex: 'tender',

            },
            {
                keys: 'description',
                title: '备注',
                dataIndex: 'description',

            },
        ]
    }
    public render() {
        return <>
            {super.render()}
            <Modal visible={this.state.isVisible}>
                <iframe src={this.state.url} frameBorder="0"></iframe>
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
            title: '产品信息',
            render: (): React.ReactNode => {
                return (
                    <>

                        <Form.List name="paymentPlanDtos" initialValue={contract?.paymentPlanDtos || []}>
                            {
                                (fields: FormListFieldData[], operation: FormListOperation): React.ReactNode => {
                                    return (
                                        <>

                                            <Table columns={this.getFormcolumns()} dataSource={fields} />
                                        </>
                                    );
                                }
                            }
                        </Form.List>
                    </>
                );
            }
        }];
    }

}


