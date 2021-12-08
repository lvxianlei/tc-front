import ApplicationContext from "./ApplicationContext";
import { IDict } from "./IApplicationContext";

const dictionary: Record<string, IDict[] | undefined> | undefined = ApplicationContext.get().dictionaryOption;

export enum DictionaryEnums {
    PRODUCT_TYPE = 101,
    VOLTAGE_GRADE = 102,
    UNIT = 103,
    MATERIAL_STANDARD = 104,
    BOLT_TYPE = 105,
    PATTERN = 106,
    CURRENCY_TYPE = 111,
    TAX_RATE = 112,
    REFUND_MODE = 113,
    CONST_TYPE = 115,
    BANK_TYPE = 116,
    CLIENT_TYPE = 121,
    WIN_BID_TYPE = 122,
    SALE_TYPE = 123,
    WAREHOUSE_TYPE = 127,
    DELIVERY_WAY = 128,
    TRANSPORTATION_TYPE = 129,
    CAR_TYPE = 146,
    EMPLOYEE_TYPE = 149,
    PAY_TYPE = 1211,
    STAFF_TYPE = 1213,
    DEPT_TYPE = 1214,
    DATA_TYPE = 1215,
    CERTIFICATE_TYPE = 1216,
}

let productType: IDict[] | undefined = [];
let voltageGrade: IDict[] | undefined = [];
let unit: IDict[] | undefined = [];
let materialStandard: IDict[] | undefined = [];
let currencyType: IDict[] | undefined = [];
let taxRate: IDict[] | undefined = [];
let refundMode: IDict[] | undefined = [];
let clientType: IDict[] | undefined = [];
let winBidType: IDict[] | undefined = [];
let saleType: IDict[] | undefined = [];
let boltType: IDict[] | undefined = [];
let warehouseType: IDict[] | undefined = [];
let carType: IDict[] | undefined = [];
let staffType: IDict[] | undefined = [];
let deptType: IDict[] | undefined = [];
let dataType: IDict[] | undefined = [];
let patternType: IDict[] | undefined = [];
let costType: IDict[] | undefined = [];
let payType: IDict[] | undefined = [];
let employeeType: IDict[] | undefined = [];
let bankType: IDict[] | undefined = [];
let deliveryway: IDict[] | undefined = [];
let transportationType: IDict[] | undefined = [];
let certificateType: IDict[] | undefined = [];

if (dictionary) {
    productType = dictionary[DictionaryEnums.PRODUCT_TYPE];
    voltageGrade = dictionary[DictionaryEnums.VOLTAGE_GRADE];
    unit = dictionary[DictionaryEnums.UNIT];
    materialStandard = dictionary[DictionaryEnums.MATERIAL_STANDARD];
    currencyType = dictionary[DictionaryEnums.CURRENCY_TYPE];
    taxRate = dictionary[DictionaryEnums.TAX_RATE];
    refundMode = dictionary[DictionaryEnums.REFUND_MODE];
    clientType = dictionary[DictionaryEnums.CLIENT_TYPE];
    winBidType = dictionary[DictionaryEnums.WIN_BID_TYPE];
    saleType = dictionary[DictionaryEnums.SALE_TYPE];
    boltType = dictionary[DictionaryEnums.BOLT_TYPE];
    warehouseType = dictionary[DictionaryEnums.WAREHOUSE_TYPE];
    carType = dictionary[DictionaryEnums.CAR_TYPE];
    staffType = dictionary[DictionaryEnums.STAFF_TYPE];
    deptType = dictionary[DictionaryEnums.DEPT_TYPE];
    dataType = dictionary[DictionaryEnums.DATA_TYPE];
    patternType = dictionary[DictionaryEnums.PATTERN];
    costType = dictionary[DictionaryEnums.CONST_TYPE];
    payType = dictionary[DictionaryEnums.PAY_TYPE];
    certificateType = dictionary[DictionaryEnums.CERTIFICATE_TYPE];
    employeeType = dictionary[DictionaryEnums.EMPLOYEE_TYPE];
    bankType = dictionary[DictionaryEnums.BANK_TYPE];
    deliveryway = dictionary[DictionaryEnums.DELIVERY_WAY];
    transportationType = dictionary[DictionaryEnums.TRANSPORTATION_TYPE];
}

export const productTypeOptions = productType;  //产品类型
export const voltageGradeOptions = voltageGrade;  //电压等级
export const unitOptions = unit; //计量单位
export const materialStandardOptions = materialStandard; //材料标准
export const currencyTypeOptions = currencyType; //币种
export const taxRateOptions = taxRate; //税率
export const refundModeOptions = refundMode; //来款方式
export const clientTypeOptions = clientType; //客户类型
export const winBidTypeOptions = winBidType; //中标类型
export const saleTypeOptions = saleType; //销售类型
export const boltTypeOptions = boltType; //螺栓类型
export const warehouseOptions = warehouseType; //仓库类型
export const carOptions = carType; //车辆类型
export const staffTypeOptions = staffType; //员工类型
export const deptTypeOptions = deptType; //部门类型
export const dataTypeOptions = dataType; //资料类型
export const patternTypeOptions = patternType; //模式
export const costTypeOptions = costType; //费用类型
export const payTypeOptions = payType; //费用类型
export const certificateTypeOptions = certificateType; //证件类型
export const employeeTypeOptions = employeeType; //员工分组
export const bankTypeOptions = bankType; //开户银行
export const deliverywayOptions = deliveryway; //交货方式
export const transportationTypeOptions = transportationType; //运输方式
