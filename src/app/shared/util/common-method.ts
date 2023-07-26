import { CodingEntity, Daum, EntryEntity, Patient, Resource, SessionStorageData } from "src/app/@types";
import { QuestionnaireResponse } from "src/app/@types/questionnaire-response";
import { THEME_FIVE_CONST, THEME_FOUR_CONST, THEME_ONE_CONST, THEME_THREE_CONST, THEME_TWO_CONST } from "./constant";

export const getDataFromSessionStorage = (): SessionStorageData => {
  const data: SessionStorageData = {
    userAllAccessInfo: [],
    tenantUserLoginInfo: null,
    businessAndProcessDetails: null,
    patientUserId: null,
    tenantUserList: null,
    patient: null,
    userAllMenuAccessResponse2: null
  }
  const userAllAccess = sessionStorage.getItem("userAllAccessInfo");
  if (userAllAccess) {
    data.userAllAccessInfo = JSON.parse(userAllAccess).menuAccess;
  }
  const userLoginInfo = sessionStorage.getItem("tenantUserLoginInfo");
  if (userLoginInfo) {
    data.tenantUserLoginInfo = JSON.parse(userLoginInfo);
  }
  const businessAndProcess = sessionStorage.getItem("businessAndProcessDetails");
  if (businessAndProcess) {
    data.businessAndProcessDetails = JSON.parse(businessAndProcess);
  }
  const patientUserId = sessionStorage.getItem("patientUserId");
  if (patientUserId) {
    data.patientUserId = patientUserId;
  }
  const tenantUserList = sessionStorage.getItem("tenantUserList");
  if (tenantUserList) {
    data.tenantUserList = JSON.parse(tenantUserList);
  }
  const patient = sessionStorage.getItem("patient");
  if (patient) {
    data.patient = JSON.parse(patient);
  }
  const userAllMenuAccessResponse2 = sessionStorage.getItem("userAllMenuAccessResponse2");
  if (userAllMenuAccessResponse2) {
    data.userAllMenuAccessResponse2 = JSON.parse(userAllMenuAccessResponse2);
  }
  return data;
}

export const getPersonName = (person: Resource) => {
  let name = "";
  if (person && person.name && person.name.length > 0) {
    if (person.name[0].given && person.name[0].family) {
      name = person.name[0].given[0] + " " + person.name[0].family;
    }
    else if (person.name[0].family) {
      name = person.name[0].family;
    }
    else if (person.name[0].given) {
      name = person.name[0].given[0]
    }
  }
  return name;
}

export const findQuestionnaire = (searchSet: QuestionnaireResponse, qId: any) => {
  var qRes = null;
  if (searchSet) {
    for (var i = 0, iLen = searchSet.entry.length; i < iLen; i++) {
      var resource = searchSet.entry[i].resource;
      if (resource.resourceType === "Questionnaire" && resource.id === qId) {
        qRes = resource;
        break;
      }
    }
  }
  return qRes;
};

export const getQName = (q: any) => {
  var title = q.title || q.name || (q.code && q.code.length && q.code[0].display);
  // For LOINC only, add the code to title
  if (q.code && q.code.length) {
    var firstCode = q.code[0];
    if (firstCode.system == "http://loinc.org" && firstCode.code) {
      if (!title)
        title = '';
      title += ' [' + firstCode.code + ']';
    }
  }
  if (!title)
    title = 'Untitled, #' + q.id;
  return title;
}

export const processPagingLinks = (resType: string, links: any) => {
  let pagingLinks: any = { previous: null, next: null };
  for (let i = 0, iLen = links.length; i < iLen; i++) {
    var link = links[i];
    if (link.relation === 'previous' || link.relation === 'next') {
      pagingLinks[link.relation] = link.url;
    }
  }
  pagingLinks[resType] = pagingLinks;
  console.log("pagingLinks ==> ", pagingLinks);
};

export const setThemColor = (userType: number) => {
  switch (userType) {
    case THEME_ONE_CONST:
      document.documentElement.style.setProperty('--theme-left-side', '#005999');
      document.documentElement.style.setProperty('--theme-nav-link', '#a3c8ff');
      document.documentElement.style.setProperty('--theme-active-nav-link', '#4c94ff');
      break;
    case THEME_TWO_CONST:
      document.documentElement.style.setProperty('--theme-left-side', '#424242');
      document.documentElement.style.setProperty('--theme-nav-link', '#a5a5a5');
      document.documentElement.style.setProperty('--theme-active-nav-link', '#747474');
      break;
    case THEME_THREE_CONST:
      document.documentElement.style.setProperty('--theme-left-side', '#424242');
      document.documentElement.style.setProperty('--theme-nav-link', '#a5a5a5');
      document.documentElement.style.setProperty('--theme-active-nav-link', '#747474');
      break;
    case THEME_FOUR_CONST:
      document.documentElement.style.setProperty('--theme-left-side', '#3c8dad');
      document.documentElement.style.setProperty('--theme-nav-link', '#a3c8ff');
      document.documentElement.style.setProperty('--theme-active-nav-link', '#12617f');
      break;
    case THEME_FIVE_CONST:
      document.documentElement.style.setProperty('--theme-left-side', '#285430');
      document.documentElement.style.setProperty('--theme-nav-link', 'rgba(255,255,255,0.6);');
      document.documentElement.style.setProperty('--theme-active-nav-link', '#A4BE7B');
      break;
    default:
      document.documentElement.style.setProperty('--theme-left-side', '#005999');
      document.documentElement.style.setProperty('--theme-nav-link', '#a3c8ff');
      document.documentElement.style.setProperty('--theme-active-nav-link', '#4c94ff');
      break;
  }
}

export const sortData = (dataArray: any, sortBy: string): any => {
  return dataArray.sort(function (a: any, b: any) {
    var nameA = a[sortBy].toUpperCase();
    var nameB = b[sortBy].toUpperCase();
    if (nameA < nameB) { return -1; }
    if (nameA > nameB) { return 1; }
    return 0;
  });
}

export const getPractitionerName = (prtId: any, practitionerList: Array<EntryEntity>) => {
  const prId = prtId.split("/").slice(1, 2).join("/");
  let practitionerName = "";
  practitionerList.forEach(entry => {
    if (prId == entry.resource.id) {
      practitionerName = `${entry.resource.name[0].prefix[0]} ${entry.resource.name[0].given[0]} ${entry.resource.name[0].family}`;
    }
  });
  return practitionerName;
}

export const calculateAge = (birthday: string): number => {
  var ageDifMs = Date.now() - new Date(birthday).getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  const a = Math.abs(ageDate.getUTCFullYear() - 1970);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export const getActorName = (entry: EntryEntity) => {
  let actorName = '';
  for (let name of entry.resource.name) {
    actorName = name.prefix[0] + ' ' + name.given[0] + ' ' + name.family;
  }
  return actorName
}

export const consentJson = (patientUserId: string, conJson: any, startDate: string, endDate: string, loincAndSnomed: Array<CodingEntity>, dataArray: Array<Daum>) => {
  let consentJson = {
    "resourceType": "Consent",
    "id": "18108",
    "meta": {
      "versionId": "1",
      "source": "#QFdWQYwnWEWz0KGQ"
    },
    "status": "active",
    "scope": {
      "coding": [{
        "system": "http://terminology.hl7.org/CodeSystem/consentscope",
        "code": "patient-privacy"
      }]
    },
    "patient": {
      "reference": "Patient" + "/" + patientUserId
    },
    "dateTime": "2020-07-22T15:28:22Z",
    "sourceAttachment": {
      "title": "The terms of the consent in lawyer speak."
    },
    "provision": {
      "type": conJson.type,
      "period": {
        "start": startDate,
        "end": endDate
      },
      "actor": [{
        "role": {
          "coding": [{
            "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
            "code": "PRCP"
          }]
        },
        "reference": {
          "reference": conJson.actor
        }
      }],
      "action": [{
        "coding": [{
          "system": "http://terminology.hl7.org/CodeSystem/consentaction",
          "code": "collect"
        }]
      }],
      "code": {
        "coding": loincAndSnomed
      },
      "data": dataArray
    }
  }
  return consentJson
}

export const getPatientJson = (patient: Patient) => {
  const tempStr1 = patient;
  const tempStr = JSON.stringify(tempStr1);
  const rmSlashN = tempStr.replace(/\n/g, '');
  const parseUserJson = JSON.parse(rmSlashN);
  const pt = parseUserJson;
  return pt;
}

export const setStyleToLHCForm = () => {
  const wcLHCForm = document.querySelector("wc-lhc-form") as HTMLElement;
  wcLHCForm.style.height = "100%";

  const form = document.querySelector('.lhc-form') as HTMLElement;
  form.style.position = "relative";
  form.style.overflow = "hidden";
  form.style.height = "100%";

  const formTitle = document.querySelector(".lhc-form-title") as HTMLElement;
  formTitle.style.display = "flex";
  formTitle.style.justifyContent = "space-between";
  formTitle.style.position = "sticky";
  formTitle.style.width = "100%";
  formTitle.style.marginBottom = "10px";
  formTitle.style.marginTop = "0";
  formTitle.style.backgroundColor = "var(--theme-left-side)";

  const lhcFormBody = document.querySelector(".lhc-form-body") as HTMLElement;
  lhcFormBody.style.margin = "0";
  lhcFormBody.style.padding = "0";
  lhcFormBody.style.height = "calc(100% - 51px)";
  lhcFormBody.style.overflowY = "scroll";

  const buttons = Array.from(document.getElementsByClassName('lhc-help-button') as HTMLCollectionOf<HTMLElement>);
  buttons.forEach((button) => button.style.color = "var(--theme-left-side)");

  const lhcButtons = Array.from(document.getElementsByClassName('lhc-button') as HTMLCollectionOf<HTMLElement>);
  lhcButtons.forEach((button) => button.style.backgroundColor = "var(--theme-left-side)");

}

export const addSaveButtonOnLHCFormHeader = (): HTMLElement => {
  const formTitle = document.querySelector(".lhc-form-title") as HTMLElement;
  const child = document.createElement("img");
  child.setAttribute("id", "save-button");
  child.setAttribute("src", "assets/images/svg/save_icon.svg");
  child.setAttribute("title", "Save the form data as a 'new' FHIR resource to the selected FHIR server.");
  child.style.height = "25px";
  child.style.cursor = "pointer";
  formTitle.appendChild(child);
  return child;
}

export const convertBirthDateInAge = (dateOfBirth: string): string => {
  const now: any = new Date();
  const birthDate: any = new Date(dateOfBirth);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  const diff = now - birthDate;
  const age = Math.floor(diff / millisecondsPerDay);

  if (age < 30) {
    return age + " Days";
  } else if (age >= 30 && age < 365 * 12) {
    const years = Math.floor(age / 365);
    const months = Math.floor((age % 365) / 30);
    if (years === 0) {
      return months + " Months";
    }
    return years + " Years " + months + " Months";
  } else {
    const years = Math.floor(age / 365);
    return years + " Years";
  }
}
