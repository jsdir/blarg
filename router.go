package main

import (
	"goji.io"
	"goji.io/pat"
)

func NewRouter(ctx *Context) *goji.Mux {
	mux := goji.NewMux()
	mux.HandleFuncC(pat.Get("/v1/authenticate"), ctx.HandleAuthenticate)
	mux.HandleFuncC(pat.Get("/v1/callback"), ctx.HandleCallback)
	return mux
}
