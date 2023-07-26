import { Meta } from "@angular/platform-browser";
import { AddressEntity, CodingEntity, EntryEntity, ExtensionEntity, IdentifierEntity, LinkEntity, NameEntity, TelecomEntity } from "./common";

export type Patient = {
  resourceType: string;
  id: string;
  meta: Meta;
  type: string;
  total: number;
  link: Array<LinkEntity>;
  entry: Array<EntryEntity>;
  reference?: string;
  text?: Text
  extension?: Array<ExtensionEntity>;
  identifier?: Array<IdentifierEntity>;
  name?: Array<NameEntity>;
  telecom?: Array<TelecomEntity>;
  gender?: string;
  birthDate?: string;
  deceasedDateTime?: string;
  address?: Array<AddressEntity>;
  maritalStatus?: MaritalStatus
  multipleBirthBoolean?: boolean
  communication?: Array<Communication>;
}

export interface MaritalStatus {
  coding: Array<CodingEntity>;
  text: string
}

export interface Communication {
  language: Language
}

export interface Language {
  coding: Array<CodingEntity>;
}



