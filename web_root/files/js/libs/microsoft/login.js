
// Login via schulegl (Microsoft). Benötigt msal.js von Microsoft

// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/v2-migration.md
let myMSALObj;

function callApplication(accessToken) {
  myMSALObj.clearCache();
  window.location.hash = null;
  window.location.search = "?mstk=" + accessToken;
}

async function ms_init(clientId, authority, redirect) {

// redirect url darf query parameter enthalten, sofern die app nicht public ist.

  // Options see: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
  const msalConfig = {
    auth: {
      clientId: clientId,
      authority: authority,
      redirectUri: redirect,
    },
    cache: {
      // cacheLocation: "sessionStorage", // This configures where your cache will be stored
      // storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
      loggerOptions: {
        logLevel: msal.LogLevel.Trace,
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) {
            return;
          }
          switch (level) {
            case msal.LogLevel.Error:
              console.error(message);
              return;
            case msal.LogLevel.Info:
              console.info(message);
              return;
            case msal.LogLevel.Verbose:
              console.debug(message);
              return;
            case msal.LogLevel.Warning:
              console.warn(message);
              return;
            default:
              console.log(message);
              return;
          }
        },
      },
    },
  };

  //const requestObj = {
  //  scopes: ["user.read"]
  //};

  myMSALObj = new msal.PublicClientApplication(msalConfig);

  // await myMSALObj.initialize();

  await myMSALObj.initialize().then(() => {
    myMSALObj.handleRedirectPromise().then((tokenResponse) => {
      // console.log(tokenResponse);
      if (tokenResponse && tokenResponse.tokenType === "Bearer") {
        callApplication(tokenResponse.accessToken);
      }
    })
  }).catch(error => {
    console.log(error);
  });




  // const loginRequest = {
  //   scopes: ["user.read"],
  //   // state: "page_url"
  // }
  // 
  // // Try silent login without dialog
  // myMSALObj.acquireTokenSilent(loginRequest).then(tokenResponse => {
  //   // Do something with the tokenResponse
  //   callApplication(tokenResponse.accessToken);
  // })
  //   //.catch(error => {
  //   //if (error instanceof InteractionRequiredAuthError) {
  //     // fallback to interaction when silent call fails
  //     //        return msalInstance.acquireTokenRedirect(request)
  //   //}
  //
  // //});

}


async function ms_signIn() {

  const loginRequest = {
    scopes: ["user.read"],
    // state: "page_url"
  }

  await myMSALObj.loginRedirect(loginRequest);

  // return myMSALObj.acquireTokenRedirect(loginRequest);

    // handle other errors
}

