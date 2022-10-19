import img1x1 from "@static/party_plakat_2022WS_1x1.jpg"
import img4x3 from "@static/party_plakat_2022WS_4x3.jpg"
import img16x9 from "@static/party_plakat_2022WS_16x9.jpg"

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

const startDate = "2022-11-17T21:30+" + timeoffset(false)
const endDate = "2022-07-01T03:00+" + timeoffset(false)

const event: WithContext<Event> = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "NW2-Party",
  "startDate": startDate,
  "endDate": endDate,
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
  "location": NW2,
  "image": [
    fsUrl + img1x1,
    fsUrl + img4x3,
    fsUrl + img16x9
  ],
  "description": "NW2-Party der Fachschaft MPI",
  "offers": {
    "@type": "Offer",
    "price": "5",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStoreOnly",
    "validFrom": startDate,
    "validThrough": endDate
  },
  "performer": {
    "@type": "PerformingGroup",
    "name": "Asskicker"
  },
  "organizer": {
    "@type": "Organization",
    "name": "FSMPI",
    "url": fsUrl
  }
}

export default event