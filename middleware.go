package main

import (
	"net/http"
	"strings"
)

func ForceHTTPS(h http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		url := r.URL
		// thx: https://github.com/unrolled/secure
		proto := r.Header.Get("X-Forwarded-Proto")
		if !strings.EqualFold(proto, "https") {
			url.Scheme = "https"
			url.Host = r.Host
			http.Redirect(w, r, url.String(), http.StatusMovedPermanently)
			return
		}

		h.ServeHTTP(w, r)
	})
}
