package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"

	"github.com/garyburd/go-oauth/oauth"
)

// Session state keys.
const (
	tempCredKey   = "tempCred"
	tokenCredKey  = "tokenCred"
	sessionPrefix = "s"
	usernameKey   = "username"
)

// decodeResponse decodes the JSON response from the Twitter API.
func decodeResponse(resp *http.Response, data interface{}) error {
	if resp.StatusCode != 200 {
		p, _ := ioutil.ReadAll(resp.Body)
		return fmt.Errorf("get %s returned status %d, %s", resp.Request.URL, resp.StatusCode, p)
	}
	return json.NewDecoder(resp.Body).Decode(data)
}

func apiGet(
	oauthClient *oauth.Client,
	cred *oauth.Credentials,
	urlStr string,
	form url.Values,
	data interface{},
) error {
	resp, err := oauthClient.Get(nil, cred, urlStr, form)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	return decodeResponse(resp, data)
}

func getUsername(
	oauthClient *oauth.Client,
	cred *oauth.Credentials,
) (string, error) {
	data := map[string]interface{}{}
	if err := apiGet(
		oauthClient,
		cred,
		"https://api.twitter.com/1.1/account/verify_credentials.json",
		url.Values{},
		&data,
	); err != nil {
		return "", err
	}

	return data["screen_name"].(string), nil
}

func (c *Context) HandleAuthenticate(w http.ResponseWriter, r *http.Request) {
	session, err := c.RediStore.Get(r, sessionPrefix)
	if err != nil {
		http.Error(w, "Error getting session, "+err.Error(), 500)
		return
	}

	callback := "http://" + r.Host + "/v1/callback"
	tempCred, err := c.OAuthClient.RequestTemporaryCredentials(nil, callback, nil)
	if err != nil {
		http.Error(w, "Error getting temp cred, "+err.Error(), 500)
		return
	}

	session.Values[tempCredKey] = tempCred
	if err = session.Save(r, w); err != nil {
		http.Error(w, "Error saving session, "+err.Error(), 500)
		return
	}
	http.Redirect(w, r, c.OAuthClient.AuthorizationURL(tempCred, nil), 302)
}

func (c *Context) HandleCallback(w http.ResponseWriter, r *http.Request) {
	session, err := c.RediStore.Get(r, sessionPrefix)
	if err != nil {
		http.Error(w, "Error getting session, "+err.Error(), 500)
		return
	}

	tempCred, _ := session.Values[tempCredKey].(*oauth.Credentials)
	if tempCred == nil || tempCred.Token != r.FormValue("oauth_token") {
		http.Error(w, "Unknown oauth_token.", 500)
		return
	}
	tokenCred, _, err := c.OAuthClient.RequestToken(nil, tempCred, r.FormValue("oauth_verifier"))
	if err != nil {
		http.Error(w, "Error getting request token, "+err.Error(), 500)
		return
	}
	delete(session.Values, tempCredKey)
	session.Values[tokenCredKey] = tokenCred

	username, err := getUsername(&c.OAuthClient, tokenCred)
	if err != nil {
		http.Error(w, "Error getting identity, "+err.Error(), 500)
		return
	}

	session.Values[usernameKey] = username

	if err := session.Save(r, w); err != nil {
		http.Error(w, "Error saving session, "+err.Error(), 500)
		return
	}

	http.Redirect(w, r, "/"+username, 302)
}

// - request the user's twitter id when they are authenticated
//   - store this in the session
// - redirect to the correct frontend url when done

// username
// - show loading
// - make initial ws request
// - get payload
// - use payload to determine who the accessing user is, and who
// they identify as
// - store this data in local/session storage until they log out
// - use the local/session storage data to determine if they are
// redirected off of the home page
