import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

def send_match_notification_email(to_email: str, user_name: str, lost_item_name: str, found_item_name: str, confidence_score: float) -> bool:
    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        print(f"[EMAIL SIMULATION] High confidence match ({confidence_score}%) found for '{user_name}' ({to_email}) between lost item '{lost_item_name}' and found item '{found_item_name}'.")
        return True

    subject = f"Match Alert ({confidence_score}% Match) - Campus Lost & Found Assistant"
    body = f"""Hi {user_name},

Our AI system has detected a potential match for your reported lost item!

Item details:
- Lost Item: {lost_item_name}
- Matched Found Item: {found_item_name}
- Match Confidence Score: {confidence_score}%

Please log into the Campus Lost & Found Assistant portal to review the match and claim your item from the Campus Lost & Found Office.

Best regards,
Campus Lost & Found Office Team
"""
    try:
        msg = MIMEMultipart()
        msg['From'] = settings.EMAIL_FROM
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"[EMAIL ALERT ERROR] Failed to send email to {to_email}: {e}")
        return False
