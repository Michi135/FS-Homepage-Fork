interface MetaEntry {
  [key: string]: string
}

const metaEntries: MetaEntry[] =
    [
      {
        "charset": "UTF-8"
      },
      {
        "name": "viewport",
        "content": "width=device-width, initial-scale=1.0"

      },
      /*{
        "http-equiv": "X-UA-Compatible",
        "content": "ie=edge"
      },*/
      {
        "name": "description",
        "content": "Fachschaft Mathe/Physik/Informatik"
      },
      {
        "name": "google-site-verification",
        "content": "BH6NGa-Zbe3kfHNiFuIvNUOSm8myjW8Amr8i5P_tXaE"
      }
    ]

export function getMeta(): string
{
  let out: string = ""
  metaEntries.forEach(element =>
  {
    out += `<meta `
    for (let key in element)
    {
      out += `${key}="${element[key]}"`
    }
    out += `>`
  })

  return out
}
