import { CodingEntity, Meta } from "./common"
import { Patient } from "./patient"

export type Consents = {
  resourceType: string
  id: string
  meta: Meta
  status: string
  scope: Scope
  patient: Patient
  dateTime: string
  sourceAttachment: SourceAttachment
  provision: Provision
}

export type Scope = {
  coding: Array<CodingEntity>;
}

export type SourceAttachment = {
  title: string
}

export type Provision = {
  type: string
  period: Period
  actor: Actor[]
  action: Action[]
  code: Code[]
  data: Daum[]
}

export type Period = {
  start: string
  end: string
}

export type Actor = {
  role: Role
  reference: Reference
}

export type Role = {
  coding: Array<CodingEntity>;
}

export type Reference = {
  reference: string
}

export type Action = {
  coding: Array<CodingEntity>;
}

export type Code = {
  coding: Array<CodingEntity>;
}

export type Daum = {
  meaning: string
  reference: Reference
}
/////////////////////////////////////////////////////////////////

export type ConsentByPatientWithPractitionerName = {
  id: string;
  provisionType: string;
  status: string;
  start: string;
  end: string;
  practitionerName: string;
}