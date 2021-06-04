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
} from '../../../components/AbstractTaxkComponent';
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
    readonly contractNumber?: string;
    readonly internalNumber?: string;
    readonly projectName?: string;
    readonly simpleProjectName?: string;
    readonly winBidType?: number;
    readonly saleType?: number;
    readonly saleOrderNumber?: string;
    readonly customerInfoDto?: IcustomerInfoDto;
    readonly signCustomerName?: string;
    readonly signContractTime?: string;
    readonly signUserName?: string;
    readonly deliveryTime?: string;
    readonly reviewTime?: string;
    readonly chargeType?: string;
    readonly taskNumber? :string;
    readonly customerCompany?:string;
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
    readonly description?: string;
    readonly packDemand?:string;
    readonly galvanizeDemand?:string;
    readonly weldingDemand?: string;
}

export interface IPaymentPlanDto {
    readonly index?: number;
    readonly returnedTime?: any;
    readonly returnedRate?: number;
    readonly returnedAmount?: number;
  
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
export default abstract class AbstractTaskapproval<P extends RouteComponentProps, S extends IAbstractContractSettingState> extends AbstractFillableComponent<P, S> {

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
        return '/approval/task';
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
                label: '任务编号',
                name: 'taskNumber',
                initialValue: contract?.taskNumber,
                children: <Input value={contract?.taskNumber} disabled />
            }, {
                label: '关联订单',
                name: 'saleOrderNumber',
                initialValue: contract?.saleOrderNumber || GeneratNum,
                children: <Input value={contract?.saleOrderNumber} disabled />
            }, {
                label: '合同编号',
                name: 'internalNumber',
                initialValue: contract?.internalNumber,
                children: <Input value={contract?.internalNumber} maxLength={100} disabled />
            }, {
                label: '工程名称',
                name: 'projectName',
                initialValue: contract?.projectName,
                children: <Input value={contract?.projectName} maxLength={50} disabled />
            }, {
                label: '业主单位',
                name: 'customerCompany',
                initialValue: contract?.customerCompany,
                children: (
                    <Input value={contract?.customerCompany} maxLength={50} disabled />
                )
            }, {
                label: '合同签订单位',
                name: 'signCustomerName',
                initialValue: contract?.signCustomerName,
                children: <Input value={contract?.signCustomerName} disabled />
            }, {
                label: '合同签订日期',
                name: 'signContractTime',
                initialValue: moment(contract?.signContractTime),
                children: <DatePicker format="YYYY-MM-DD" disabled />
            }, {
                label: '客户交货日期',
                name: 'deliveryTime',
                initialValue: moment(contract?.deliveryTime),
                children: <DatePicker format="YYYY-MM-DD" disabled />
            }, {
                label: '计划交货日期',
                name: 'deliveryTime',
                initialValue: moment(contract?.deliveryTime),
                children: <DatePicker format="YYYY-MM-DD" disabled />
            }, {
                label: '计划备注',
                name: 'description',
                initialValue: contract?.description,
                children: <Input.TextArea disabled value={contract?.description} rows={5} showCount={true} maxLength={300} />
            }]
        }, {
            title: '特殊要求',
            itemCol: {
                span: 8
            },
            itemProps: [{
                label: '原材料标准',
                name: 'productType',
                initialValue: contract?.productInfoDto?.productType,
                children: (
                    <Select defaultValue={1} disabled>
                        <Select.Option value={1}>国网</Select.Option>
                        <Select.Option value={2}>管塔</Select.Option>
                        <Select.Option value={3}>螺栓</Select.Option>
                    </Select>
                )
            }, {
                label: '原材料要求',
                name: 'voltageGrade',
                initialValue: contract?.productInfoDto?.voltageGrade,
                children: (
                    <Input value={contract?.productInfoDto?.voltageGrade} maxLength={50} disabled />

                )
            },  {
                label: '焊接要求',
                name: 'weldingDemand',
                initialValue: contract?.productInfoDto?.weldingDemand,
                children: (
                    <Input value={contract?.productInfoDto?.weldingDemand} maxLength={50} disabled />

                )
            },{
                label: '包装要求',
                name: 'packDemand',
                initialValue: contract?.productInfoDto?.packDemand,
                children: (
                    <Input value={contract?.productInfoDto?.packDemand} maxLength={50} disabled />

                )
            }, {
                label: '镀锌要求',
                name: 'galvanizeDemand',
                initialValue: contract?.productInfoDto?.galvanizeDemand,
                children: (
                    <Input value={contract?.productInfoDto?.galvanizeDemand} maxLength={50} disabled />

                )
            }, {
                label: '计划备注',
                name: 'description',
                initialValue: contract?.description,
                children: <Input.TextArea disabled value={contract?.description} rows={5} showCount={true} maxLength={300} />
            }]
        },]];
    }
    public getFormcolumns(): ITabItem[] {
        return [
            {
                keys: 'taskNumber',
                title: '线路名称',
                dataIndex: 'taskNumber',

            },
            {
                keys: 'productType',
                title: '产品类型',
                dataIndex: 'productType',

            },
            {
                keys: 'productShape',
                title: '塔型',
                dataIndex: 'productShape',

            },
            {
                keys: 'productNumber',
                title: '杆塔号',
                dataIndex: 'productNumber',

            },
            {
                keys: 'voltageGrade',
                title: '电压等级',
                dataIndex: 'voltageGrade',

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

            }, {
                keys: 'description',
                title: '备注',
                dataIndex: 'description',
            }
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


