package main

import (
	"log"
	"net/http"
)

func main() {
	server := NewServer()
	defer server.RediStore.Close()
	defer server.RedisPool.Close()

	log.Println("started server at localhost:8000")
	log.Fatal(http.ListenAndServe("localhost:8000", NewRouter(&server)))
}
