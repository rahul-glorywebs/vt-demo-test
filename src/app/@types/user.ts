import { EntryEntity } from "./common";
import { MenuWithSubMenu } from "./menu";

export type TenantUser = {
  id: number;
  tenantId: number;
  userType: string;
  firstName: string;
  lastName: string;
  emailId: string;
  mobileNo: string;
  isActive: number;
  password: string;
  fhirId: string;
  birthDate: string | null;
  gender: string;
  tenantType: string;
  tenantName: string;
  tenantDescription: string;
  tenantAdminName: string;
  tenantAdminEmail: string;
  tenantAdminMobile: string;
  tenantDomainType: string;
  tenantTableId: number;
  themeId: number;
  userJson: string;
}

export type Menu = {
  tenantId: number;
  menuId: number;
  accesstype: string;
  menuImage: string;
  menuName: string;
  menuDescription: string;
  menuURL: string;
  menuSequence: number;
  isActive: number;
  menuType: string;
}

export type UserLogin = {
  loginResponse: Array<TenantUser>;
  userAccessResponse: Array<Menu>;
  businessKey: string;
  processId: string;
  definitionId: string | null;
  processDefinitionId: string;
  userLoginCount: number;
  userMustChangePassword: string;
  userLoginStatus: boolean;
  userLoginResponse: string;
  errorMessage: string | null;
  getReportsByMenuClick: string | null;
  userWiseMenuWiseAccessDetails: string | null;
  userAllMenuAccessResponse2: Array<MenuWithSubMenu>;
}


//////////////////////////////////////////////////////////////////////////////

export type BusinessAndProcessDetails = {
  businessKey: string;
  processDefinitionId: string;
  processId: string;
  userEmail: string;
}

export type UserDetail = {
  status: boolean;
  userLoginResponse: TenantUser;
  data: UserLogin;
  userMustChangePassword: string;
}
//////////////////////////////////////////////////////////////////////////////

export type UserLogoutResponse = {
  businessKey: string;
  processId: string | null;
  processDefinitionId: string | null;
  message: string;
  errorMessage: string | null;
}
//////////////////////////////////////////////////////////////////////////////

export type UserMenuAccessFromFHIrResponse = {
  menu: Array<Menu>;
  businessKey: string;
  processId: string;
  processDefinitionId: string;
  errorMessage?: null;
  userAllMenuAccessResponse2: Array<MenuWithSubMenu>;
}
//////////////////////////////////////////////////////////////////////////////

export type FHIrUrlByTenantResponse = {
  id: number;
  tenantId: number;
  serverName: string;
  serverEnv: string;
  serverURL: string;
  isActive: number;
  domainType: string;
  username: string;
  password: string;
}
//////////////////////////////////////////////////////////////////////////////

export type SessionStorageData = {
  userAllAccessInfo: Array<Menu>;
  tenantUserLoginInfo: TenantUser | null;
  businessAndProcessDetails: BusinessAndProcessDetails | null;
  patientUserId: string | null;
  tenantUserList: MultiTenantUserList | null;
  patient: EntryEntity | null;
  userAllMenuAccessResponse2: Array<MenuWithSubMenu> | null;
}

export type MultiTenantUserList = {
  data: Array<TenantUser>;
  status: boolean;
  userLoginResponse: string;
  userMustChangePassword: string;
}


