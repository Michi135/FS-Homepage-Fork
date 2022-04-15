export function determineLanguage(path: string)
{
  const testLang = path.match(/^\/([^\/]*)/)
  if (testLang?.length === 2 && ['en'].includes(testLang.at(1)!))
    return <'en'>testLang.at(1)!
  else
    return 'de'
}