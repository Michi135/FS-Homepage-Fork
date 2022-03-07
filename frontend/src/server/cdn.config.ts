const cdnStyles =
    [
      {
        link: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css"
      }
    ]

export function getStyles(): string
{
  let out: string = ""
  cdnStyles.forEach(element =>
  {
    out += `<link href="${element.link}" rel="stylesheet" crossorigin="anonymous">`
  })

  return out
}