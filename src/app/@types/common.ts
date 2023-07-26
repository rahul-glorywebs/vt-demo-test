export type IdentifierEntity = {
  system: string;
  value: string;
  type?: Type;
}

export type Meta = {
  versionId: string;
  lastUpdated: string;
  source?: string;
  profile?: Array<string>;
  tag?: Array<CodingEntity>;
}

export type Search = {
  mode: string;
}

export type CodingEntity = {
  system: string;
  code: string;
  display: string;
}

export type Type = {
  coding: Array<CodingEntity>;
  text: string;
}

export type AnswerOptionEntity = {
  extension?: Array<ExtensionEntity> | null;
  valueCoding: ValueCoding;
}

export type ExtensionEntity = {
  url: string;
  valueCodeableConcept?: ValueCodableConcept | null;
  valueCoding?: ValueCoding | null;
  valueCode?: string | null;
  valueUri?: string | null;
  valueExpression?: ValueExpression | null;
  valueDuration?: ValueDuration | null;
  valueBoolean?: boolean | null;
  valueString?: string | null;
  valueDecimal?: number | null;
}

export type ValueCodableConcept = {
  coding?: Array<CodingEntity> | null;
  text: string;
}

export type ValueCoding = {
  system?: string | null;
  code?: string | null;
  display?: string | null;
}

export type ValueExpression = {
  description?: string | null;
  language: string;
  expression: string;
  name?: string | null;
}

export type ValueDuration = {
  value: number;
  unit: string;
  system: string;
  code: string;
}

export type ItemEntity = {
  extension?: Array<ExtensionEntity> | null;
  linkId?: string | null;
  code?: Array<CodingEntity> | null;
  text: string;
  type: string;
  required: boolean;
  answerOption?: Array<AnswerOptionEntity> | null;
  item?: Array<ItemEntity> | null;
  initial?: Array<InitialEntity> | null;
}

export type TagEntity = {
  code: string;
}

export type InitialEntity = {
  valueQuantity: ValueQuantity;
}

export type ValueQuantity = {
  unit: string;
  system: string;
  code: string;
}

export type LinkEntity = {
  relation: string;
  url: string;
}

export type EntryEntity = {
  fullUrl: string;
  resource: Resource;
  search: Search;
}

export type Resource = {
  resourceType: string;
  id: string;
  meta: Meta;
  identifier: Array<IdentifierEntity>;
  name: Array<NameEntity>;
  telecom: Array<TelecomEntity>;
  gender: string;
  birthDate: string;
  address: Array<AddressEntity>;
  deceasedDateTime: string;
}

export type NameEntity = {
  use: string;
  family: string;
  given: Array<string>;
  prefix: Array<string>;
  suffix: Array<string>;
}

export type TelecomEntity = {
  system: string;
  value: string;
  use: string;
}

export type AddressEntity = {
  line: Array<string>;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}