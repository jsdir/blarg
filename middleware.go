package main

import (
	"net/http"
	"strings"
)

func isHTTPS(r *http.Request) bool {
	if r.URL.Scheme == "https" {
		return true
	}
	if strings.HasPrefix(r.Proto, "HTTPS") {
		return true
	}
	if r.Header.Get("X-Forwarded-Proto") == "https" {
		return true
	}
	return false
}

func ForceHTTPS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		url := r.URL
		// thx: https://github.com/unrolled/secure
		if !isHTTPS(r) {
			url.Scheme = "https"
			url.Host = r.Host
			http.Redirect(w, r, url.String(), http.StatusMovedPermanently)
			return
		}

		h.ServeHTTP(w, r)
	})
}
