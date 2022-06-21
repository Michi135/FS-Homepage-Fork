import img1x1 from "@static/party_plakat_2022_1x1.jpg"
import img4x3 from "@static/party_plakat_2022_4x3.jpg"
import img16x9 from "@static/party_plakat_2022_16x9.jpg"

export default {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "NW2-Party",
  "startDate": "2022-06-30T21:30+02:00",
  "endDate": "2022-07-01T03:00+02:00",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
  "location": {
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
  },
  "image": [
    "https://fsmpi.uni-bayreuth.de" + img1x1,
    "https://fsmpi.uni-bayreuth.de" + img4x3,
    "https://fsmpi.uni-bayreuth.de" + img16x9
  ],
  "description": "NW2-Party der Fachschaft MPI",
  "offers": {
    "@type": "Offer",
    "price": "5",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStoreOnly",
    "validFrom": "2022-06-30T21:30+02:00",
    "validThrough": "2022-07-01T03:00+02:00"
  },
  "performer": {
    "@type": "PerformingGroup",
    "name": "Asskicker"
  },
  "organizer": {
    "@type": "Organization",
    "name": "FSMPI",
    "url": "https://fsmpi.uni-bayreuth.de"
  }
}