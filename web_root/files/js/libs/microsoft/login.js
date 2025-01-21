// Login via Microsoft. Benötigt msal.js von Microsoft

// https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/v2-migration.md
let myMSALObj;

function callApplication(accessToken) {
  myMSALObj.clearCache();
  window.location.hash = ''; // Remove URL fragment, so that no MS redirect info will be sticky forwarded. Stupid MS.
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

  myMSALObj = new msal.PublicClientApplication(msalConfig);

  await myMSALObj.initialize().then(() => {
    myMSALObj.handleRedirectPromise().then((tokenResponse) => {

      if (tokenResponse && tokenResponse.tokenType === "Bearer") {
        callApplication(tokenResponse.accessToken);
      }
    })
  }).catch(error => {
    console.log(error);
  });
}


async function ms_signIn() {

  const loginRequest = {
    scopes: ["user.read"],
  }

  await myMSALObj.loginRedirect(loginRequest);

}

// async function ms_logout(username) {
//   const currentAccount = myMSALObj.getAccountByUsername(username);
//   // The account's ID Token must contain the login_hint optional claim to avoid the account picker
//   await myMSALObj.logoutRedirect({ account: currentAccount});
// }

