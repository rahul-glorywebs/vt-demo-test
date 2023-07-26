export type TenantIdRequestPayload = {
  tenantId: number | null;
}

export type LoginRequestPayload = {
  username: string;
  password: string;
}

export type LogoutRequestPayload = {
  businessKey: string;
}

export type UserMenuAccessFromFHIrRequestPayload = {
  tenantId: number | null;
  userId: number | null;
  businessKey: string | null;
  processId: string | null;
  processDefinitionId: string | null;
}

export type UserWiseMenuWiseAccessDetailsRqPayload = {
  tenantId: number;
  menuId: number;
  menuType: string;
  userId: number;
}

export type ChangePasswordRqPayload = {
  businessKey: string;
  email: string;
  newPassword: string;
}

export type UpdatePasswordResponse = {
  businessKey: string | null;
  email: string | null;
  newPassword: string | null;
  errorMessage: string | null;
  status: string | null;
}

export type RenderDashRqPayload = {
  pId: string;
  rId: string;
  rName: string;
  themeId: string;
  queryType: string;
  user: string;
}