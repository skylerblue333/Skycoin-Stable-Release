FROM golang:1.23-alpine AS build
WORKDIR /src
COPY go.mod ./
RUN go mod download
COPY cmd ./cmd
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags='-s -w' -o /out/skygaming-ws ./cmd/skygaming-ws

FROM gcr.io/distroless/static-debian12:nonroot
COPY --from=build /out/skygaming-ws /skygaming-ws
EXPOSE 8080
USER nonroot:nonroot
ENTRYPOINT ["/skygaming-ws"]
