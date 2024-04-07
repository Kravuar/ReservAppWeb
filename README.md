### How to run
Okta config:
Create web app
![web-app](assets/okta.png)

Configure self-service registration to sign up directly with okta rather than through backend
![self-service](assets/self-service.png)

Define a .env file with the following contents:
* REACT_APP_ISSUER=...your-issuer... **https://dev-56768569.okta.com/oauth2/default**
* REACT_APP_CLIENT_ID=...your-client-id... **0oaf5xe0ya7nuKsVI5d7**
* REACT_APP_CALLBACK_PATH=...callback-postfix... **/login/callback**
* REACT_APP_SCOPES=...your_scopes... **'openid profile'**
* REACT_APP_BACKEND=...backend-url... **http://localhost:8080**

### TODOS:
1. Make routes great again
2. Alert is hella dumb. Rerenders whole app on show/hide alert, messes up everything (including infinite error-reload)
3. Code reusage