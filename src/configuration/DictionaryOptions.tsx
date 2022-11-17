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
    COMPOUND_TYPE = 107,
    COMPONENT_TYPE = 108,
    CURRENCY_TYPE = 111,
    TAX_RATE = 112,
    REFUND_MODE = 113,
    PAY_CATEGORY = 114,
    CONST_TYPE = 115,
    BANK_TYPE = 116,
    CLIENT_TYPE = 121,
    WIN_BID_TYPE = 122,
    SALE_TYPE = 123,
    BID_TYPE = 124,
    SOURCE = 125,
    WAREHOUSE_TYPE = 127,
    DELIVERY_WAY = 128,
    TRANSPORTATION_TYPE = 129,
    PAYMENT_CATEGORY = 136,
    MATERIAL_TEXTURE = 139,
    SUPPLIER_TYPE = 144,
    QUALITY_ASSURANCE = 145,
    CAR_TYPE = 146,
    SUPPLY_PRODUCTS = 148,
    EMPLOYEE_TYPE = 149,
    WEIGHING_TYPE = 151,
    FACTORY_TYPE = 152,
    INVOICE_TYPE = 1210,
    PAY_TYPE = 1211,
    STAFF_TYPE = 1213,
    DEPT_TYPE = 1214,
    DATA_TYPE = 1215,
    CERTIFICATE_TYPE = 1216,
    COLLECTION_TYPE = 117,
    CONTRACT_PLAN_STATUS = 1217,
    CONTRACT_FORM = 1218,
    PACKAGE_TYPE = 1220,
    TENDER_DELIVERY_METHOD = 1219,
    UNLOAD_MODE_TYPE = 12001,
    SETTLEMENT_MODE_TYPE = 12002,
    PLAN_NAME = 118,
    TOWER_STRUCTURE = 109,
    SUPPLY_TYPE = 1010,
    TYPE_OF_CHANGE = 1011,
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
let bidType: IDict[] | undefined = [];
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
let invoiceType: IDict[] | undefined = [];
let materialTexture: IDict[] | undefined = [];
let supplierType: IDict[] | undefined = [];
let qualityAssurance: IDict[] | undefined = [];
let supplyProducts: IDict[] | undefined = [];
let contractPlanStatus: IDict[] | undefined = [];
let contractForm: IDict[] | undefined = [];
let paymentCategory: IDict[] | undefined = [];
let source: IDict[] | undefined = [];
let materialStandardType: IDict[] | undefined = [];
let payCategory: IDict[] | undefined = [];
let collectionType: IDict[] | undefined = [];
let weighingType: IDict[] | undefined = [];
let packageType: IDict[] | undefined = [];
let tenderDeliveryMethod: IDict[] | undefined = [];
let compoundType: IDict[] | undefined = [];
let factoryType: IDict[] | undefined = [];
let componentType: IDict[] | undefined = [];

let unloadMode: IDict[] | undefined = [];
let settlementMode: IDict[] | undefined = [];
let planName: IDict[] | undefined = [];
let towerStructure: IDict[] | undefined = [];
let supplyType: IDict[] | undefined = [];
let typeOfChange: IDict[] | undefined = [];

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
    bidType = dictionary[DictionaryEnums.BID_TYPE];
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
    invoiceType = dictionary[DictionaryEnums.INVOICE_TYPE];
    materialTexture = dictionary[DictionaryEnums.MATERIAL_TEXTURE];
    supplierType = dictionary[DictionaryEnums.SUPPLIER_TYPE];
    qualityAssurance = dictionary[DictionaryEnums.QUALITY_ASSURANCE];
    supplyProducts = dictionary[DictionaryEnums.SUPPLY_PRODUCTS];
    contractPlanStatus = dictionary[DictionaryEnums.CONTRACT_PLAN_STATUS];
    contractForm = dictionary[DictionaryEnums.CONTRACT_FORM];
    paymentCategory = dictionary[DictionaryEnums.PAYMENT_CATEGORY];
    source = dictionary[DictionaryEnums.SOURCE];
    payCategory = dictionary[DictionaryEnums.PAY_CATEGORY];
    bidType = dictionary[DictionaryEnums.BID_TYPE];
    collectionType = dictionary[DictionaryEnums.COLLECTION_TYPE];
    weighingType = dictionary[DictionaryEnums.WEIGHING_TYPE];
    packageType = dictionary[DictionaryEnums.PACKAGE_TYPE];
    tenderDeliveryMethod = dictionary[DictionaryEnums.TENDER_DELIVERY_METHOD];
    compoundType = dictionary[DictionaryEnums.COMPOUND_TYPE];
    factoryType = dictionary[DictionaryEnums.FACTORY_TYPE];
    componentType = dictionary[DictionaryEnums.COMPONENT_TYPE];
    unloadMode = dictionary[DictionaryEnums.UNLOAD_MODE_TYPE];
    settlementMode = dictionary[DictionaryEnums.SETTLEMENT_MODE_TYPE];
    planName = dictionary[DictionaryEnums.PLAN_NAME];
    towerStructure = dictionary[DictionaryEnums.TOWER_STRUCTURE];
    supplyType = dictionary[DictionaryEnums.SUPPLY_TYPE];
    typeOfChange = dictionary[DictionaryEnums.TYPE_OF_CHANGE];
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
export const bidTypeOptions = bidType; //标书类别
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
export const invoiceTypeOptions = invoiceType; //发票类型
export const materialTextureOptions = materialTexture; //材质
export const supplierTypeOptions = supplierType; //供应商类型
export const qualityAssuranceOptions = qualityAssurance; //质量保证体系
export const supplyProductsOptions = supplyProducts; //供应商供货产品
export const contractPlanStatusOptions = contractPlanStatus; // 合同计划状态
export const contractFormOptions = contractForm; // 收到合同形式
export const paymentCategoryOptions = paymentCategory; //支付类别
export const sourceOptions = source; //来源
export const payCategoryOptions = payCategory; //来款性质
export const collectionTypeeOptions = collectionType; // 回款类型
export const weighingtypeOptions = weighingType; //过磅类型
export const packageTypeOptions = packageType; //包类型
export const tenderDeliveryMethodOptions = tenderDeliveryMethod; // 标书投递方式
export const compoundTypeOptions = compoundType; // 组焊类型
export const factoryTypeOptions = factoryType; // 厂区名称
export const componentTypeOptions = componentType; // 零件类型
export const unloadModeOptions = unloadMode; // 卸货方式
export const settlementModeOptions = settlementMode; // 结算方式
export const planNameOptions = planName; // 计划名称
export const towerStructureOptions = towerStructure; // 铁塔结构
export const supplyTypeOptions = supplyType; // 补件类型
export const typeOfChangeOptions = typeOfChange; // 变更类型
