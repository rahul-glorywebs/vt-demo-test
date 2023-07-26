import { CodingEntity, ExtensionEntity, IdentifierEntity, ItemEntity, Meta, Search, ValueCoding } from "./common";

export type MenuWithSubMenu = {
  id: number;
  tenantId: number;
  parentMenuId: number;
  menuImage: any;
  menuName: string;
  menuDescription: string;
  menuURL: string;
  menuSequence: number;
  isActive: number;
  menuType: string;
  reports?: Array<ReportSubMenu>;
  workFlowSubMenus?: Array<WorkFlowSubMenu>;
  smartAppSubMenu?: Array<SmartSubMenuI>;
}

export type ReportSubMenu = {
  id: number;
  reportName: string;
  reportDescription: string;
  schemaId: number;
  schemaName: string;
  isActive: number;
  filterString: string;
  templateId: number;
  templateName: string;
  chartType: string;
  precision: number;
  tenantId: any;
  queryType: string;
  textQuery: any;
  connectionId: any;
  fhirpathQuery: string;
}

export type WorkFlowSubMenu = {
  w_id: number;
  w_name: string;
  w_desc: string;
  w_ver: string;
  tenantId: number;
  isActive: number;
  frames: Array<Frame>;
}

export type Frame = {
  fId: number;
  f_name: string;
  f_description?: string;
  f_desc: string;
  f_ver: string;
  f_w_id: number;
  f_externalurl: string;
  f_seq_id?: number;
  reportId?: number;
  openInNewTab?: number;
  f_quicksightURL?: string;
  f_type?: string;
  fStatus: number;
  tenantId: any;
  appURL: any;
}
////////////////////////////////////////////////////////////////////

export type Questionnaire = {
  id: number;
  tenantId: number;
  fhirId: string;
  appTitle: string;
  appJson: AppJson;
  appURL: string;
  appVersion: string;
  appId: string;
  appName?: string | null;
}

export type AppJson = {
  fullUrl: string;
  resource: QuestionnaireResource;
  search: Search;
}

export type QuestionnaireResource = {
  resourceType: string;
  id: string;
  meta: Meta;
  title: string;
  status: string;
  item?: Array<ItemEntity> | null;
  description?: string | null;
  effectivePeriod?: EffectivePeriod | null;
  name?: string | null;
  approvalDate?: string | null;
  extension?: Array<ExtensionEntity> | null;
  identifier?: Array<IdentifierEntity> | null;
  subjectType?: Array<string> | null;
  date?: string | null;
  code?: Array<CodingEntity> | null;
}

export type AnswerOptionEntity1 = {
  valueCoding: ValueCoding;
  extension?: Array<ExtensionEntity4> | null;
}

export type ExtensionEntity4 = {
  url: string;
  valueString: string;
}

export type ItemEntity2 = {
  extension?: Array<ExtensionEntity5> | null;
  linkId: string;
  text: string;
  type: string;
}

export type ExtensionEntity5 = {
  url: string;
  valueCodeableConcept: ValueCodeableConcept2;
}

export type ValueCodeableConcept2 = {
  coding?: Array<CodingEntity> | null;
  text: string;
}

export type EffectivePeriod = {
  start: string;
  end: string;
}

////////////////////////////////////////////////////////////////////

export type WorkFlowByReportData = {
  id: number;
  reportName: string;
  reportDescription: string;
  schemaId: number;
  schemaName: string;
  isActive: number;
  filterString: string;
  FHIRPathQuery: string;
  templateId: number;
  templateName: string;
  chartType: string;
  precision?: null;
  tenantId?: null;
  queryType: string;
  connectionId?: null;
  textQuery?: null;
}
////////////////////////////////////////////////////////////////////

export type UserWiseMenuWiseAccessDetailsResponse = {
  id: number;
  menuId: number;
  menuType: string;
  typeId: number;
}
////////////////////////////////////////////////////////////////////

export type WorkFlowMenuDataBehaviorSubject = {
  qInfo: Frame;
  type: number;
}
////////////////////////////////////////////////////////////////////

export type SmartSubMenuI = {
  id: any;
  name: string;
  data: any;
  type: string;
}
