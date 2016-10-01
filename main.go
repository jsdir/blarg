package main

// base client url

import (
	"log"
	"net/http"
)

func main() {
	ctx := NewContext()
	defer ctx.RediStore.Close()
	defer ctx.RedisPool.Close()

	log.Println("started server")
	log.Fatal(http.ListenAndServe("localhost:8000", NewRouter(&ctx)))
}
