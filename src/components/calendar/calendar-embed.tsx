"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarEmbedProps {
  calendarLink: string;
  founderName: string;
}

export function CalendarEmbed({ calendarLink, founderName }: CalendarEmbedProps) {
  const isCalendly = calendarLink.includes("calendly.com");
  const isCalDotCom = calendarLink.includes("cal.com");

  // For embedding, we can use an iframe for Calendly and Cal.com
  const embedUrl = isCalendly
    ? `${calendarLink}?embed_type=Inline&embed_domain=rounddrop.com`
    : isCalDotCom
    ? `${calendarLink}?embed=true`
    : null;

  if (embedUrl) {
    return (
      <div className="space-y-3">
        <h3 className="font-medium">Book a Call with {founderName}</h3>
        <div className="rounded-lg border overflow-hidden" style={{ height: "630px" }}>
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            title={`Book a call with ${founderName}`}
          />
        </div>
      </div>
    );
  }

  // Fallback: external link
  return (
    <div className="space-y-3">
      <h3 className="font-medium">Book a Call with {founderName}</h3>
      <Button asChild variant="outline" className="w-full">
        <a href={calendarLink} target="_blank" rel="noopener noreferrer">
          <ExternalLink className="mr-2 h-4 w-4" />
          Open Calendar to Book
        </a>
      </Button>
    </div>
  );
}
