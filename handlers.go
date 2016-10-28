package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"

	"github.com/garyburd/go-oauth/oauth"
)

// Session keys.
const (
	tempCredKey      = "tempCred"
	tokenCredKey     = "tokenCred"
	sessionPrefix    = "session"
	usernameKey      = "username"
	initialRoomIdKey = "roomId"
)

func handleInternalServerError(err error, w http.ResponseWriter) {
	log.Println(err.Error())
	http.Error(w, "Internal Server Error", 500)
}

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

func (s *Server) HandleAuthenticate(w http.ResponseWriter, r *http.Request) {
	session, err := s.RediStore.Get(r, sessionPrefix)
	if err != nil {
		handleInternalServerError(err, w)
		return
	}

	callback := "http://" + r.Host + "/v1/callback"
	tempCred, err := s.OAuthClient.RequestTemporaryCredentials(
		nil, callback, nil,
	)
	if err != nil {
		handleInternalServerError(err, w)
		return
	}

	session.Values[tempCredKey] = tempCred
	session.Values[initialRoomIdKey] = r.URL.Query().Get("roomId")
	if err = session.Save(r, w); err != nil {
		handleInternalServerError(err, w)
		return
	}

	http.Redirect(
		w, r, s.OAuthClient.AuthorizationURL(tempCred, nil), 302,
	)
}

func (s *Server) HandleCallback(w http.ResponseWriter, r *http.Request) {
	session, err := s.RediStore.Get(r, sessionPrefix)
	if err != nil {
		handleInternalServerError(err, w)
		return
	}

	tempCred, _ := session.Values[tempCredKey].(*oauth.Credentials)
	if tempCred == nil || tempCred.Token != r.FormValue("oauth_token") {
		handleInternalServerError(err, w)
		return
	}

	tokenCred, _, err := s.OAuthClient.RequestToken(
		nil, tempCred, r.FormValue("oauth_verifier"),
	)

	if err != nil {
		handleInternalServerError(err, w)
		return
	}
	delete(session.Values, tempCredKey)
	session.Values[tokenCredKey] = tokenCred

	username, err := getUsername(&s.OAuthClient, tokenCred)
	if err != nil {
		handleInternalServerError(err, w)
		return
	}

	session.Values[usernameKey] = username

	if err := session.Save(r, w); err != nil {
		handleInternalServerError(err, w)
		return
	}

	roomId := session.Values[initialRoomIdKey].(string)
	if roomId == "" {
		roomId = username
	}

	http.Redirect(w, r, s.ClientBaseUrl+"/"+roomId, 302)
}

func (s *Server) HandleLogout(w http.ResponseWriter, r *http.Request) {
	session, err := s.RediStore.Get(r, sessionPrefix)
	if err != nil {
		handleInternalServerError(err, w)
		return
	}

	delete(session.Values, usernameKey)
	delete(session.Values, tokenCredKey)

	if err := session.Save(r, w); err != nil {
		handleInternalServerError(err, w)
		return
	}

	http.Redirect(w, r, s.ClientBaseUrl+"/", 302)
}
