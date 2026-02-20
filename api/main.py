"""
Gather Catering and Events — Inquiry Form API

Receives form submissions from the website and sends two emails via SMTP relay:
  1. Confirmation to the submitter
  2. Lead notification to the catering team

SMTP relay: smtp-relay.gmail.com:25 (IP-authenticated, no credentials required)
From address: web-inquiry@gathercateringandevents.com
"""

import smtplib
import logging
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

# ── Configuration ──────────────────────────────────────────────────────────────

SMTP_HOST = "smtp-relay.gmail.com"
SMTP_PORT = 25
FROM_ADDRESS = "web-inquiry@gathercateringandevents.com"
FROM_NAME = "Gather Catering and Events"
NOTIFICATION_EMAIL = "catering@gathercateringandevents.com"
REPLY_TO = "catering@gathercateringandevents.com"

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

# ── App setup ──────────────────────────────────────────────────────────────────

app = FastAPI(title="Gather Inquiry API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://gathercateringandevents.com", "https://gathercafeandevents.com"],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)

# ── Request model ──────────────────────────────────────────────────────────────

class InquiryForm(BaseModel):
    firstName: str
    lastName: str
    email: EmailStr
    phone: Optional[str] = ""
    services: Optional[List[str]] = []
    budget: Optional[str] = ""
    details: Optional[str] = ""
    timestamp: Optional[str] = ""

# ── SMTP helper ────────────────────────────────────────────────────────────────

def send_email(to: str, subject: str, plain: str, html: str, reply_to: str = None):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{FROM_NAME} <{FROM_ADDRESS}>"
    msg["To"] = to
    if reply_to:
        msg["Reply-To"] = reply_to

    msg.attach(MIMEText(plain, "plain"))
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
        server.sendmail(FROM_ADDRESS, [to], msg.as_string())

# ── Email builders ─────────────────────────────────────────────────────────────

def build_confirmation(data: InquiryForm):
    services_str = ", ".join(data.services) if data.services else "Not specified"
    budget_str = data.budget or "Not provided"
    timestamp = data.timestamp or datetime.utcnow().isoformat()

    subject = "Thank you for your inquiry \u2014 Gather Catering and Events"

    plain = "\n".join([
        f"Hi {data.firstName},",
        "",
        "Thank you for reaching out to Gather Catering and Events! We\u2019re so glad you got in touch.",
        "",
        "We\u2019ve received your inquiry and one of our team members will be in touch within 24\u201348 business hours to discuss how we can help bring your vision to life.",
        "",
        "Your Details:",
        f"Services: {services_str}",
        f"Budget: {budget_str}",
        "",
        "In the meantime, feel free to reply to this email if you have any questions.",
        "",
        "Warm regards,",
        "The Gather Catering and Events Team",
    ])

    detail_lines = f"<strong>Your Details:</strong><br>Services Interested In: {services_str}"
    if data.budget:
        detail_lines += f"<br>Budget: {data.budget}"

    html = (
        '<!DOCTYPE html><html><head><meta charset="utf-8">'
        '<link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap" rel="stylesheet">'
        '</head><body style="margin:0;padding:0;background-color:#f4f1ea">'
        '<div style="font-family:\'Helvetica Neue\',Arial,sans-serif;max-width:600px;margin:0 auto;color:#2c3e50">'
          '<div style="background-color:#2c3e50;padding:30px;text-align:center">'
            f'<h1 style="color:#f9e3b4;margin:0;font-size:28px">Thank You, {data.firstName}!</h1>'
          '</div>'
          '<div style="padding:30px;background-color:#f4f1ea">'
            '<p style="font-size:16px;line-height:1.6;color:#2c3e50">'
              'We\u2019re so glad you reached out! We\u2019ve received your inquiry and are excited to learn more about your upcoming event.'
            '</p>'
            '<p style="font-size:16px;line-height:1.6;color:#2c3e50">'
              'One of our team members will be in touch within <strong>24\u201348 business hours</strong> to discuss how we can help bring your vision to life. In the meantime, feel free to reply to this email if you have any questions.'
            '</p>'
            '<div style="background-color:rgba(249,227,180,0.3);border-left:4px solid #f9e3b4;padding:15px;margin:25px 0">'
              f'<p style="margin:0;font-size:16px;color:#2c3e50">{detail_lines}</p>'
            '</div>'
            '<p style="font-size:16px;line-height:1.6;color:#2c3e50;margin-bottom:0">'
              'Warm regards,<br>'
              '<strong>The Gather Catering and Events Team</strong>'
            '</p>'
          '</div>'
          '<div style="background-color:#2c3e50;padding:20px;text-align:center">'
            '<p style="font-family:\'Abril Fatface\',serif;color:#f9e3b4;margin:0;font-size:36px;letter-spacing:0.05em">GATHER</p>'
          '</div>'
        '</div>'
        '</body></html>'
    )

    return subject, plain, html


def build_notification(data: InquiryForm):
    services_str = ", ".join(data.services) if data.services else "None selected"
    timestamp = data.timestamp or datetime.utcnow().isoformat()

    subject = f"New Website Lead - {data.firstName} {data.lastName}"

    plain = "\n".join([
        "New inquiry submitted via the Gather website:",
        "",
        f"Name: {data.firstName} {data.lastName}",
        f"Email: {data.email}",
        f"Phone: {data.phone or 'Not provided'}",
        "",
        f"Services Interested In: {services_str}",
        f"Budget: {data.budget or 'Not provided'}",
        "",
        "Additional Details:",
        data.details or "None",
        "",
        "---",
        f"Submitted: {timestamp}",
    ])

    details_html = (data.details or "None").replace("\n", "<br>")
    html = (
        f'<h2 style="font-family:sans-serif;">New Website Lead \u2014 {data.firstName} {data.lastName}</h2>'
        '<table style="border-collapse:collapse;font-family:sans-serif;">'
        f'<tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Name:</td><td style="padding:8px;">{data.firstName} {data.lastName}</td></tr>'
        f'<tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Email:</td><td style="padding:8px;"><a href="mailto:{data.email}">{data.email}</a></td></tr>'
        f'<tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Phone:</td><td style="padding:8px;">{data.phone or "Not provided"}</td></tr>'
        f'<tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Services:</td><td style="padding:8px;">{services_str}</td></tr>'
        f'<tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Budget:</td><td style="padding:8px;">{data.budget or "Not provided"}</td></tr>'
        f'<tr><td style="padding:8px;font-weight:bold;vertical-align:top;">Details:</td><td style="padding:8px;">{details_html}</td></tr>'
        '</table>'
        '<hr>'
        f'<p style="color:#999;font-size:12px;">Submitted: {timestamp}</p>'
    )

    return subject, plain, html

# ── Endpoint ───────────────────────────────────────────────────────────────────

@app.post("/submit")
def submit_inquiry(data: InquiryForm):
    log.info("Received inquiry from %s %s <%s>", data.firstName, data.lastName, data.email)

    errors = []

    try:
        subject, plain, html = build_confirmation(data)
        send_email(data.email, subject, plain, html, reply_to=REPLY_TO)
        log.info("Confirmation email sent to %s", data.email)
    except Exception as e:
        log.error("Failed to send confirmation email: %s", e)
        errors.append("confirmation")

    try:
        subject, plain, html = build_notification(data)
        send_email(NOTIFICATION_EMAIL, subject, plain, html, reply_to=data.email)
        log.info("Notification email sent to %s", NOTIFICATION_EMAIL)
    except Exception as e:
        log.error("Failed to send notification email: %s", e)
        errors.append("notification")

    if errors:
        raise HTTPException(status_code=500, detail="Email delivery failed")

    return {"status": "success"}
