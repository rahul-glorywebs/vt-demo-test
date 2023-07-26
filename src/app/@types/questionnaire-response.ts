export type QuestionnaireResponse = {
  resourceType: string;
  id: string;
  meta: QrMeta;
  type: string;
  total: number;
  link: Array<QrLink>;
  entry: Array<QrEntry>;
}

export type QrLink = {
  relation: string;
  url: string;
}

export type QrEntry = {
  fullUrl: string;
  resource: QrResource;
  search: QrSearch;
}

export type QrResource = {
  resourceType: string;
  id: string;
  meta: QrMeta;
  questionnaire?: string;
  status: string;
  subject?: QrSubject;
  authored?: string;
  item?: Array<QrItem>;
  name?: string;
  title?: string;
  approvalDate?: string;
  extension?: Array<QrExtension>;
  identifier?: Array<QrIdentifier>;
  subjectType?: Array<string>;
  date?: string;
  code?: Array<QrCode>;
  effectivePeriod?: EffectivePeriod;
  description?: string;
  class?: Class;
  type?: Array<Type>;
  period?: EffectivePeriod;
  serviceProvider?: ServiceProvider;
  effectiveDateTime?: string;
  issued?: string;
  valueQuantity?: QrValueQuantity;
  derivedFrom?: Array<DerivedFrom>
  category?: Array<Category>;
  component?: Array<Component>;
  valueString?: string;
  participant?: any;
}

export type QrMeta = {
  versionId: string;
  lastUpdated: string;
  source: string;
  profile: Array<string>;
  tag: Array<QrTag>;
}

export type QrTag = {
  code: string;
}

export type QrSubject = {
  reference: string;
  display: string;
}

export type QrItem = {
  extension?: Array<QrExtension>;
  linkId: string;
  code?: Array<QrCode>;
  text: string;
  type?: string;
  required?: boolean;
  answerOption?: Array<QrAnswerOption>;
  item?: Array<QrItem>;
  answer?: Array<QrAnswer>;
  initial?: Array<QrInitial>;
}

export type QrExtension = {
  url: string;
  valueCoding?: QrValueCoding;
  valueCodeableConcept?: QrValueCodableConcept;
  valueCode?: string;
  valueExpression?: QrValueExpression;
  valueDuration?: QrValueDuration;
  valueBoolean?: boolean;
  valueString: string;
  valueDecimal?: number;
}

export type QrValueCoding = {
  display?: string;
  system?: string;
  code?: string;
}

export type QrValueCodableConcept = {
  coding: Array<QrCoding>;
  text: string;
}

export type QrCoding = {
  system: string;
  code: string;
  display: string;
}

export type QrValueExpression = {
  description?: string;
  language: string;
  expression: string;
  name: string;
}

export type QrValueDuration = {
  value: number;
  unit: string;
  system: string;
  code: string;
}

export type QrCode = {
  system: string;
  code: string;
  display: string;
  coding?: Array<QrCoding>;
  text?: string;
}

export type QrAnswerOption = {
  valueCoding: QrValueCoding;
  extension?: Array<QrExtension>;
}

export type QrAnswer = {
  valueCoding?: QrValueCoding;
  valueDecimal?: number;
  valueQuantity?: QrValueQuantity;
}

export type QrValueQuantity = {
  value: number;
  unit: string;
  system?: string;
  code?: string;
}

export type QrInitial = {
  valueQuantity: QrValueQuantity;
}

export type QrIdentifier = {
  system: string;
  value: string;
}

export type QrSearch = {
  mode: string;
}

export type EffectivePeriod = {
  start: string;
  end: string;
}

export type Class = {
  code: string;
}

export type Type = {
  coding: Array<QrCoding>;
  text: string;
}

export type ServiceProvider = {
  reference: string;
  display?: string;
}

export type DerivedFrom = {
  reference: string;
}

export type Category = {
  coding: Array<QrCoding>;
}

export type Component = {
  code: QrCode;
  valueQuantity: QrValueQuantity;
}