// Gather Catering and Events — Inquiry Form API
//
// Accepts POST /submit with JSON form data and sends two emails via SMTP relay:
//   1. Confirmation to the submitter
//   2. Lead notification to the catering team
//
// SMTP relay: smtp-relay.gmail.com:25 (IP-authenticated, no credentials)
// From:       web-inquiry@gathercateringandevents.com
//
// Build:  go build -o gather-api .
// Run:    ./gather-api

package main

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"html"
	"io"
	"log"
	"net/http"
	"net/smtp"
	"strings"
	"time"
)

// ── Configuration ─────────────────────────────────────────────────────────────

const (
	smtpHost          = "smtp-relay.gmail.com"
	smtpPort          = "25"
	fromAddress       = "web-inquiry@gathercateringandevents.com"
	fromName          = "Gather Catering and Events"
	notificationEmail = "catering@gathercateringandevents.com"
	replyTo           = "catering@gathercateringandevents.com"
	listenAddr        = ":8000"
)

var allowedOrigins = map[string]bool{
	"https://gathercateringandevents.com": true,
	"https://gathercafeandevents.com":     true,
}

// ── Request model ─────────────────────────────────────────────────────────────

type inquiry struct {
	FirstName string   `json:"firstName"`
	LastName  string   `json:"lastName"`
	Email     string   `json:"email"`
	Phone     string   `json:"phone"`
	Services  []string `json:"services"`
	Budget    string   `json:"budget"`
	Details   string   `json:"details"`
	Timestamp string   `json:"timestamp"`
}

// ── Entry point ───────────────────────────────────────────────────────────────

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /submit", handleSubmit)
	mux.HandleFunc("OPTIONS /submit", handlePreflight)

	log.Printf("Gather API listening on %s", listenAddr)
	log.Fatal(http.ListenAndServe(listenAddr, corsMiddleware(mux)))
}

// ── CORS middleware ───────────────────────────────────────────────────────────

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if allowedOrigins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
		}
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		next.ServeHTTP(w, r)
	})
}

func handlePreflight(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusNoContent)
}

// ── Handler ───────────────────────────────────────────────────────────────────

func handleSubmit(w http.ResponseWriter, r *http.Request) {
	var data inquiry
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		jsonError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(data.FirstName) == "" ||
		strings.TrimSpace(data.LastName) == "" ||
		strings.TrimSpace(data.Email) == "" {
		jsonError(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	if data.Timestamp == "" {
		data.Timestamp = time.Now().UTC().Format(time.RFC3339)
	}

	log.Printf("Inquiry received: %s %s <%s>", data.FirstName, data.LastName, data.Email)

	failed := false

	if err := sendConfirmation(data); err != nil {
		log.Printf("Confirmation email failed: %v", err)
		failed = true
	} else {
		log.Printf("Confirmation sent to %s", data.Email)
	}

	if err := sendNotification(data); err != nil {
		log.Printf("Notification email failed: %v", err)
		failed = true
	} else {
		log.Printf("Notification sent to %s", notificationEmail)
	}

	if failed {
		jsonError(w, "Email delivery failed", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}

func jsonError(w http.ResponseWriter, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}

// ── SMTP ──────────────────────────────────────────────────────────────────────

func sendMail(to, subject, plainBody, htmlBody, replyToAddr string) error {
	const boundary = "GatherBoundary42"

	header := fmt.Sprintf(
		"From: %s <%s>\r\nTo: %s\r\nSubject: %s\r\nReply-To: %s\r\n"+
			"MIME-Version: 1.0\r\nContent-Type: multipart/alternative; boundary=%q\r\n\r\n",
		fromName, fromAddress, to, subject, replyToAddr, boundary,
	)

	body := fmt.Sprintf(
		"--%s\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n%s\r\n\r\n"+
			"--%s\r\nContent-Type: text/html; charset=utf-8\r\n\r\n%s\r\n\r\n"+
			"--%s--",
		boundary, plainBody,
		boundary, htmlBody,
		boundary,
	)

	c, err := smtp.Dial(smtpHost + ":" + smtpPort)
	if err != nil {
		return fmt.Errorf("dial: %w", err)
	}
	defer c.Close()

	if ok, _ := c.Extension("STARTTLS"); ok {
		cfg := &tls.Config{ServerName: smtpHost}
		if err := c.StartTLS(cfg); err != nil {
			return fmt.Errorf("starttls: %w", err)
		}
	}

	if err := c.Mail(fromAddress); err != nil {
		return fmt.Errorf("MAIL FROM: %w", err)
	}
	if err := c.Rcpt(to); err != nil {
		return fmt.Errorf("RCPT TO: %w", err)
	}

	wc, err := c.Data()
	if err != nil {
		return fmt.Errorf("DATA: %w", err)
	}
	if _, err := io.WriteString(wc, header+body); err != nil {
		return fmt.Errorf("write: %w", err)
	}
	if err := wc.Close(); err != nil {
		return fmt.Errorf("close data: %w", err)
	}

	return c.Quit()
}

// ── Email builders ────────────────────────────────────────────────────────────

func sendConfirmation(data inquiry) error {
	services := strings.Join(data.Services, ", ")
	if services == "" {
		services = "Not specified"
	}
	budget := data.Budget
	if budget == "" {
		budget = "Not provided"
	}

	subject := "Thank you for your inquiry \u2014 Gather Catering and Events"

	plain := strings.Join([]string{
		"Hi " + data.FirstName + ",",
		"",
		"Thank you for reaching out to Gather Catering and Events! We\u2019re so glad you got in touch.",
		"",
		"We\u2019ve received your inquiry and one of our team members will be in touch within 24\u201348 business hours to discuss how we can help bring your vision to life.",
		"",
		"Your Details:",
		"Services: " + services,
		"Budget: " + budget,
		"",
		"In the meantime, feel free to reply to this email if you have any questions.",
		"",
		"Warm regards,",
		"The Gather Catering and Events Team",
	}, "\n")

	safeName := html.EscapeString(data.FirstName)
	safeServices := html.EscapeString(services)
	detailLines := "<strong>Your Details:</strong><br>Services Interested In: " + safeServices
	if data.Budget != "" {
		detailLines += "<br>Budget: " + html.EscapeString(data.Budget)
	}

	htmlBody := `<!DOCTYPE html><html><head><meta charset="utf-8">` +
		`<link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap" rel="stylesheet">` +
		`</head><body style="margin:0;padding:0;background-color:#f4f1ea">` +
		`<div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;color:#2c3e50">` +
		`<div style="background-color:#2c3e50;padding:30px;text-align:center">` +
		`<h1 style="color:#f9e3b4;margin:0;font-size:28px">Thank You, ` + safeName + `!</h1>` +
		`</div>` +
		`<div style="padding:30px;background-color:#f4f1ea">` +
		`<p style="font-size:16px;line-height:1.6;color:#2c3e50">` +
		`We` + "\u2019" + `re so glad you reached out! We` + "\u2019" + `ve received your inquiry and are excited to learn more about your upcoming event.` +
		`</p>` +
		`<p style="font-size:16px;line-height:1.6;color:#2c3e50">` +
		`One of our team members will be in touch within <strong>24` + "\u2013" + `48 business hours</strong> to discuss how we can help bring your vision to life. In the meantime, feel free to reply to this email if you have any questions.` +
		`</p>` +
		`<div style="background-color:rgba(249,227,180,0.3);border-left:4px solid #f9e3b4;padding:15px;margin:25px 0">` +
		`<p style="margin:0;font-size:16px;color:#2c3e50">` + detailLines + `</p>` +
		`</div>` +
		`<p style="font-size:16px;line-height:1.6;color:#2c3e50;margin-bottom:0">` +
		`Warm regards,<br><strong>The Gather Catering and Events Team</strong>` +
		`</p>` +
		`</div>` +
		`<div style="background-color:#2c3e50;padding:20px;text-align:center">` +
		`<p style="font-family:'Abril Fatface',serif;color:#f9e3b4;margin:0;font-size:36px;letter-spacing:0.05em">GATHER</p>` +
		`</div>` +
		`</div></body></html>`

	return sendMail(data.Email, subject, plain, htmlBody, replyTo)
}

func sendNotification(data inquiry) error {
	services := strings.Join(data.Services, ", ")
	if services == "" {
		services = "None selected"
	}
	phone := data.Phone
	if phone == "" {
		phone = "Not provided"
	}
	budget := data.Budget
	if budget == "" {
		budget = "Not provided"
	}
	details := data.Details
	if details == "" {
		details = "None"
	}

	subject := fmt.Sprintf("New Website Lead - %s %s", data.FirstName, data.LastName)

	plain := strings.Join([]string{
		"New inquiry submitted via the Gather website:",
		"",
		"Name: " + data.FirstName + " " + data.LastName,
		"Email: " + data.Email,
		"Phone: " + phone,
		"",
		"Services Interested In: " + services,
		"Budget: " + budget,
		"",
		"Additional Details:",
		details,
		"",
		"---",
		"Submitted: " + data.Timestamp,
	}, "\n")

	safeName := html.EscapeString(data.FirstName + " " + data.LastName)
	safeEmail := html.EscapeString(data.Email)
	detailsHTML := strings.ReplaceAll(html.EscapeString(details), "\n", "<br>")

	htmlBody := fmt.Sprintf(
		`<h2 style="font-family:sans-serif;">New Website Lead &mdash; %s</h2>`+
			`<table style="border-collapse:collapse;font-family:sans-serif;">`+
			`<tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Name:</td><td style="padding:8px;">%s</td></tr>`+
			`<tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Email:</td><td style="padding:8px;"><a href="mailto:%s">%s</a></td></tr>`+
			`<tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Phone:</td><td style="padding:8px;">%s</td></tr>`+
			`<tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Services:</td><td style="padding:8px;">%s</td></tr>`+
			`<tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Budget:</td><td style="padding:8px;">%s</td></tr>`+
			`<tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Details:</td><td style="padding:8px;">%s</td></tr>`+
			`</table><hr>`+
			`<p style="color:#999;font-size:12px;">Submitted: %s</p>`,
		safeName,
		safeName,
		safeEmail, safeEmail,
		html.EscapeString(phone),
		html.EscapeString(services),
		html.EscapeString(budget),
		detailsHTML,
		html.EscapeString(data.Timestamp),
	)

	return sendMail(notificationEmail, subject, plain, htmlBody, data.Email)
}
