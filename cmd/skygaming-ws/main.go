package main

import (
    "context"
    "log"
    "net/http"
    "os"
    "os/signal"
    "strings"
    "syscall"
    "time"

    "github.com/gorilla/websocket"
)

const (
    readLimit       = 1 << 20
    writeWait       = 10 * time.Second
    pongWait        = 60 * time.Second
    pingPeriod      = (pongWait * 9) / 10
    handshakeWait   = 10 * time.Second
)

func allowedOrigin(r *http.Request) bool {
    configured := os.Getenv("SKY_WS_ALLOWED_ORIGINS")
    if configured == "" {
        return false
    }
    origin := r.Header.Get("Origin")
    for _, allowed := range strings.Split(configured, ",") {
        if strings.TrimSpace(allowed) == origin {
            return true
        }
    }
    return false
}

var upgrader = websocket.Upgrader{
    CheckOrigin: allowedOrigin,
    HandshakeTimeout: handshakeWait,
}

func handleSkyGamingSocket(w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Printf("websocket upgrade failed: %v", err)
        return
    }
    defer conn.Close()
    conn.SetReadLimit(readLimit)
    _ = conn.SetReadDeadline(time.Now().Add(pongWait))
    conn.SetPongHandler(func(string) error {
        return conn.SetReadDeadline(time.Now().Add(pongWait))
    })

    done := make(chan struct{})
    go func() {
        ticker := time.NewTicker(pingPeriod)
        defer ticker.Stop()
        for {
            select {
            case <-ticker.C:
                _ = conn.SetWriteDeadline(time.Now().Add(writeWait))
                if err := conn.WriteMessage(websocket.PingMessage, nil); err != nil {
                    close(done)
                    return
                }
            case <-done:
                return
            }
        }
    }()
    defer close(done)

    for {
        messageType, payload, err := conn.ReadMessage()
        if err != nil {
            return
        }
        _ = conn.SetWriteDeadline(time.Now().Add(writeWait))
        if err := conn.WriteMessage(messageType, payload); err != nil {
            return
        }
    }
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/healthz", func(w http.ResponseWriter, _ *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        _, _ = w.Write([]byte(`{"status":"ok","service":"skygaming-ws"}`))
    })
    mux.HandleFunc("/ws/skygaming", handleSkyGamingSocket)

    server := &http.Server{Addr: ":8080", Handler: mux, ReadHeaderTimeout: 5 * time.Second}
    go func() {
        log.Printf("SkyGaming WebSocket service listening on %s", server.Addr)
        if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("server failed: %v", err)
        }
    }()

    signals := make(chan os.Signal, 1)
    signal.Notify(signals, syscall.SIGINT, syscall.SIGTERM)
    <-signals
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    _ = server.Shutdown(ctx)
}
