import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider as ThemeProvider } from "./theme/provider";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { getBasename } from "./utils/helpers";

// import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";

import { MsalAuthenticationTemplate, MsalProvider } from "@azure/msal-react";
import { InteractionType, PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./AuthConfig";

// refer https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md

const pca = new PublicClientApplication(msalConfig);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      cacheTime: 600000, // 10 mins
    },
  },
});

const authRequest = {
  scopes: ["openid", "profile"],
};

function ErrorComponent({ error }) {
  return <p>An Error Occurred: {error}</p>;
}

function LoadingComponent() {
  return <p>Authentication in progress...</p>;
}

ReactDOM.render(
  <MsalProvider instance={pca}>
    <MsalAuthenticationTemplate
      interactionType={InteractionType.Redirect}
      authenticationRequest={authRequest}
      errorComponent={ErrorComponent}
      loadingComponent={LoadingComponent}
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter basename={getBasename()}>
            <CssBaseline />
            <ReactQueryDevtools initialIsOpen={true} />
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </MsalAuthenticationTemplate>
  </MsalProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
