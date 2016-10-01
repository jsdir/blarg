package main

import (
	"net/http"

	"github.com/garyburd/go-oauth/oauth"
	"golang.org/x/net/context"
)

// Session state keys.
const (
	tempCredKey   = "tempCred"
	tokenCredKey  = "tokenCred"
	sessionPrefix = "s"
)

func (c *Context) HandleAuthenticate(ctx context.Context, w http.ResponseWriter, r *http.Request) {
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

func (c *Context) HandleCallback(ctx context.Context, w http.ResponseWriter, r *http.Request) {
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
	if err := session.Save(r, w); err != nil {
		http.Error(w, "Error saving session, "+err.Error(), 500)
		return
	}

	http.Redirect(w, r, "/username", 302)
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
