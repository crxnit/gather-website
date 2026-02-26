FROM golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod main.go ./
RUN CGO_ENABLED=0 go build -o /gather-api .

FROM alpine:3.20
RUN adduser -D -u 1000 appuser
COPY --from=build /gather-api /gather-api
USER appuser
EXPOSE 8000
ENTRYPOINT ["/gather-api"]
