// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Enums
import { EnvName } from '@enums/environment.enum';

// Packages
import packageInfo from '../../package.json';

const camundaApiUrl = "https://vt-camunda-api-demo.intercorpvt.com";
const serverUrl = "https://fhirdemo.intercorpvt.com";
const fHirUrl = "https://fhirdemo.intercorpvt.com:18000/fhir";
const fHirUrl18008 = "https://fhirdemo.intercorpvt.com:18008/fhir";

export const environment = {
  production: false,
  version: packageInfo.version,
  appName: 'VirtualTRUST',
  envName: EnvName.LOCAL,
  defaultLanguage: 'en',
  camundaApiUrl: camundaApiUrl,
  serverUrl: serverUrl,
  fHirUrl: fHirUrl,
  fHirUrl18008:fHirUrl18008
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.