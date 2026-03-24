
import datetime

import requests

from .config import AIRTABLE_BASE_ID, AIRTABLE_PAT, logger


def log_call_to_airtable(
    caller_number: str,
    duration_seconds: float,
    transcript: str,
    started_at: datetime.datetime,
    lead_name: str = "",
    lead_email: str = "",
    lead_budget: str = "",
    lead_property_type: str = "",
) -> None:
    url = f"https://api.airtable.com/v0/{AIRTABLE_BASE_ID}/call_logs"
    headers = {
        "Authorization": f"Bearer {AIRTABLE_PAT}",
        "Content-Type": "application/json",
    }
    payload = {
        "fields": {
            "caller_number":    caller_number,
            "duration_seconds": round(duration_seconds),
            "transcript":       transcript,
            "created_at":       started_at.strftime("%Y-%m-%dT%H:%M:%S.000Z"),
            "lead_name":        lead_name,
            "lead_email":       lead_email,
            "lead_budget":      lead_budget,
            "lead_property_type": lead_property_type,
        }
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        logger.info(f"Call logged to Airtable: {response.json().get('id')}")
    except requests.exceptions.HTTPError as e:
        logger.error(f"Airtable HTTP error: {e} — response: {e.response.text}")
    except Exception as e:
        logger.error(f"Airtable logging failed (non-critical): {e}")
