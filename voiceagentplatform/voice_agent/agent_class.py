import logging
from typing import Annotated

import requests
from livekit.agents import llm

from .config import (
    CAL_API_KEY,
    CAL_EVENT_TYPE_ID,
)

logger = logging.getLogger("voice-agent")


class RealEstateTools:
    @llm.function_tool(description="Book a site visit or appointment using Cal.com")
    async def book_calendar_appointment(
        self,
        name: Annotated[str, "The caller's full name"],
        email: Annotated[str, "The caller's email address"],
        start_time: Annotated[
            str,
            "The ISO8601 start time for the booking in UTC (e.g., 2024-03-25T10:00:00Z)",
        ],
    ) -> str:
        """Books an appointment on Cal.com and triggers a confirmation email."""
        if not CAL_API_KEY or not CAL_EVENT_TYPE_ID:
            return "Error: Calendar system not configured."

        url = "https://api.cal.com/v2/bookings"
        headers = {
            "Authorization": f"Bearer {CAL_API_KEY}",
            "Content-Type": "application/json",
            "cal-api-version": "2024-08-13",
        }
        payload = {
            "eventTypeId": int(CAL_EVENT_TYPE_ID),
            "start": start_time,
            "attendee": {
                "name": name,
                "email": email,
                "timeZone": "Asia/Kolkata",
            },
        }

        try:
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            if response.status_code == 201:
                return f"Successfully booked appointment for {name} at {start_time}. A confirmation email has been sent."
            else:
                logger.error(f"Cal.com error: {response.text}")
                return "I'm sorry, I encountered an error while booking. Let me try again or take your details for a callback."
        except Exception as e:
            logger.error(f"Cal.com exception: {e}")
            return "Connection error with the booking system."

    @llm.function_tool(description="Transfer the call to a senior real estate expert or manager")
    async def transfer_call(self, reason: str) -> str:
        """Trigger a SIP transfer to a human agent."""
        logger.info(f"Agent requested transfer: {reason}")
        return f"TRANSFER: Connecting you to a specialist now. Reason: {reason}"
