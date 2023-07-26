import { ItemEntity, Meta } from "./common";

export type QuestionnaireForm = {
  resourceType: string;
  id: string;
  meta: Meta;
  name?: string | null;
  title: string;
  status: string;
  approvalDate?: string | null;
  item?: Array<ItemEntity> | null;
}

export type CodeEntityOrCodingEntity = {
  system: string;
  code: string;
  display: string;
}

export type ValueCodeableConcept1 = {
  coding?: Array<CodeEntityOrCodingEntity> | null;
  text: string;
}
