import type dayjs from "dayjs"
import type { Event, WithContext, Place } from "schema-dts"

const NW2: Place = {
  "@type": "Place",
  "name": "NW2-Gebäude",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Universitätsstraße 30",
    "addressLocality": "Bayreuth",
    "postalCode": "95447",
    "addressRegion": "BY",
    "addressCountry": "DE"
  }
}

const fsUrl = "https://fsmpi.uni-bayreuth.de"

export interface EventTime
{
  start: dayjs.Dayjs
  end: dayjs.Dayjs
}

export interface Images
{
  "1x1": string
  "4x3": string
  "16x9": string
}

function generateEvent(eventTime: EventTime, images: Images, costs: number, performer: string): WithContext<Event>
{
  const start = eventTime.start.toString()
  const end = eventTime.end.toString()

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "NW2-Party",
    "startDate": start,
    "endDate": end,
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": NW2,
    "image": [
      fsUrl + images["1x1"],
      fsUrl + images["4x3"],
      fsUrl + images["16x9"]
    ],
    "description": "NW2-Party der Fachschaft MPI",
    "offers": {
      "@type": "Offer",
      "price": costs.toFixed(2),
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStoreOnly",
      "validFrom": start,
      "validThrough": end
    },
    "performer": {
      "@type": "PerformingGroup",
      "name": performer
    },
    "organizer": {
      "@type": "Organization",
      "name": "FSMPI",
      "url": fsUrl
    }
  }
}

export default generateEvent