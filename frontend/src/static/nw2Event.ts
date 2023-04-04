import dateFormat from "dateformat"

import type { Event, WithContext, Place } from "schema-dts"

const summertime = "02:00"
const wintertime = "01:00"

function timeoffset(summer: boolean = true)
{
  return summer ? summertime : wintertime
}

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
  start: Date
  end: Date
  summertime: boolean
}

export interface Images
{
  "1x1": string
  "4x3": string
  "16x9": string
}

function generateEvent(eventTime: EventTime, images: Images, costs: number, performer: string): WithContext<Event>
{
  const suffix = timeoffset(eventTime.summertime)

  const start = dateFormat(eventTime.start, "yyyy-mm-dd'T'HH:MM+") + suffix
  const end = dateFormat(eventTime.end, "yyyy-mm-dd'T'HH:MM+") + suffix

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