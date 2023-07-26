import { EntryEntity, LinkEntity, Meta } from "./common"

export type Practitioner = {
  resourceType: string
  id: string;
  meta: Meta;
  type: string;
  total: number;
  link: Array<LinkEntity>;
  entry: Array<EntryEntity>;
}

