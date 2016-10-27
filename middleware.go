package main

import (
	"net/http"
)

func ForceHTTPS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("X-Forwarded-Proto") != "https" {
			url := r.URL
			if url.Scheme != "" {
				url.Scheme = "https"
			}
			http.Redirect(w, r, url.String(), 301)
		} else {
			h.ServeHTTP(w, r)
		}
	})
}
