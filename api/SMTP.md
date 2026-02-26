# SMTP Implementation: Why We Use `net/textproto` Instead of `net/smtp`

## The Problem

Go's standard `net/smtp` package hardcodes the EHLO hostname as `"localhost"` when using `smtp.Dial()` or `smtp.NewClient()`. This cannot be changed before the initial EHLO is sent because `NewClient()` calls its internal `hello()` method automatically during construction.

Google's SMTP relay (`smtp-relay.gmail.com`) rejects `EHLO localhost` with:

```
421-4.7.0 Try again later, closing connection. (EHLO)
```

The `net/smtp` package then silently falls back to `HELO localhost` (which has no extension support), leaving the connection in a degraded state. When `MAIL FROM` is subsequently sent, the relay closes the connection, producing the misleading error:

```
MAIL FROM: EOF
```

### Why `smtp.Client.Hello()` Doesn't Help

The `smtp.Client` type does expose a `Hello(localName string)` method for setting a custom EHLO hostname. However, since `NewClient()` already triggers the EHLO during construction, calling `Hello()` afterward returns an error: `"smtp: Hello called after other methods"`. There is no way to inject a custom hostname before the first EHLO fires.

## The Solution

We drive the SMTP conversation directly using `net/textproto`, which gives us full control over the EHLO hostname and every step of the protocol:

```go
conn, err := net.DialTimeout("tcp", "smtp-relay.gmail.com:25", 10*time.Second)
tc := textproto.NewConn(conn)

tc.ReadResponse(220)                          // Read greeting
tc.Cmd("EHLO gathercateringandevents.com")    // Our domain, not "localhost"
tc.ReadResponse(250)                          // EHLO accepted
tc.Cmd("MAIL FROM:<sender@example.com>")
tc.ReadResponse(250)
tc.Cmd("RCPT TO:<recipient@example.com>")
tc.ReadResponse(250)
tc.Cmd("DATA")
tc.ReadResponse(354)
w := tc.DotWriter()                           // Handles dot-stuffing
io.WriteString(w, message)
w.Close()
tc.ReadResponse(250)
tc.Cmd("QUIT")
```

This mirrors exactly what works when testing with `nc` (netcat) — which is how we confirmed the relay was fine and isolated the bug to Go's `net/smtp`.

## Debugging Timeline

The issue was initially misdiagnosed as TLS-related because the `net/smtp` package silently swallowed the 421 EHLO rejection and fell through to `MAIL FROM`, which then failed with a generic `EOF`. The root cause was only identified after wrapping the TCP connection with a logging shim that captured the raw SMTP conversation:

```
[smtp:recv] "220 smtp-relay.gmail.com ESMTP ..."
[smtp:send] "EHLO localhost\r\n"
[smtp:recv] "421-4.7.0 Try again later, closing connection. (EHLO)\r\n..."
[smtp:send] "HELO localhost\r\n"
```

## Key Takeaways

1. **`net/smtp` is unsuitable for SMTP relays that reject `EHLO localhost`** — this includes Google Workspace's SMTP relay service.
2. **`net/textproto` is a reliable alternative** — it handles the text protocol fundamentals (command/response, dot encoding) while giving you full control over the SMTP conversation.
3. **When debugging SMTP issues in Go, log the raw wire bytes** — Go's `net/smtp` error messages obscure the actual server responses. A `Read`/`Write` wrapper on the `net.Conn` reveals the truth immediately.
4. **Always test SMTP from inside the runtime environment** — `nc` (netcat) from within the Docker container confirmed the network path worked, isolating the problem to Go's SMTP client code.
