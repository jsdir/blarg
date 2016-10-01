package main

import (
	"github.com/rs/cors"
	"goji.io"
	"goji.io/pat"
)

func NewRouter(ctx *Context) *goji.Mux {
	mux := goji.NewMux()

	// CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
	})
	mux.Use(c.Handler)

	mux.HandleFunc(pat.Get("/v1/authenticate"), ctx.HandleAuthenticate)
	mux.HandleFunc(pat.Get("/v1/callback"), ctx.HandleCallback)
	mux.HandleFunc(pat.Get("/v1/ws"), ctx.HandleWS)
	return mux
}
