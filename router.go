package main

import (
	"io/ioutil"
	"net/http"

	"github.com/rs/cors"
	"goji.io"
	"goji.io/middleware"
	"goji.io/pat"
	"golang.org/x/net/context"
)

var indexData []byte

func init() {
	data, err := ioutil.ReadFile("./dist/index.html")
	if err != nil {
		panic(err)
	}

	indexData = data
}

func NotFound(h goji.Handler) goji.Handler {
	return goji.HandlerFunc(func(ctx context.Context, w http.ResponseWriter, r *http.Request) {
		if middleware.Handler(ctx) == nil {
			w.WriteHeader(http.StatusOK)
			w.Write(indexData)
		} else {
			h.ServeHTTPC(ctx, w, r)
		}
	})
}

type AllPattern struct{}

func (p *AllPattern) Match(ctx context.Context, r *http.Request) context.Context {
	return ctx
}

func NewRouter(s *Server) *goji.Mux {
	mux := goji.NewMux()

	// CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
	})
	mux.Use(c.Handler)

	mux.UseC(NotFound)

	// Handlers
	mux.HandleFunc(pat.Get("/v1/authenticate"), s.HandleAuthenticate)
	mux.HandleFunc(pat.Get("/v1/callback"), s.HandleCallback)
	mux.HandleFunc(pat.Get("/v1/ws"), s.HandleWS)
	mux.HandleFunc(
		pat.Get("/static/*"),
		http.FileServer(http.Dir("./dist")).ServeHTTP,
	)

	return mux
}
