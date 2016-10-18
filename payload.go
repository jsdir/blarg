package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"text/template"

	"goji.io"
	"goji.io/middleware"
	"golang.org/x/net/context"
)

var indexTmpl *template.Template

func init() {
	data, err := ioutil.ReadFile("./index.html")
	if err != nil {
		panic(err)
	}

	tmpl, err := template.New("index").Parse(string(data))
	if err != nil {
		panic(err)
	}

	indexTmpl = tmpl
}

type TemplateContext struct {
	Payload string
}

func (s *Server) NotFound(h goji.Handler) goji.Handler {
	return goji.HandlerFunc(func(ctx context.Context, w http.ResponseWriter, r *http.Request) {
		if middleware.Handler(ctx) == nil {
			session, err := s.RediStore.Get(r, sessionPrefix)
			if err != nil {
				handleInternalServerError(err, w)
				return
			}

			payload := map[string]interface{}{}
			userID, ok := session.Values[usernameKey].(string)
			if ok && userID != "" {
				payload["userId"] = userID
			}
			data, err := json.Marshal(payload)
			if err != nil {
				handleInternalServerError(err, w)
				return
			}

			ctx := TemplateContext{
				Payload: string(data),
			}

			w.WriteHeader(http.StatusOK)
			indexTmpl.Execute(w, &ctx)
		} else {
			h.ServeHTTPC(ctx, w, r)
		}
	})
}
