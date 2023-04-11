import dayjs from 'dayjs'
//@ts-ignore
import utc from 'dayjs/plugin/utc'
//@ts-ignore
import timezone from 'dayjs/plugin/timezone'
//import customParseFormat from 'dayjs/plugin/customParseFormat'

let initDone = false
export default () =>
{
  if (!initDone)
  {
    initDone = true
    dayjs.extend(utc)
    dayjs.extend(timezone)
    dayjs.tz.setDefault("Europe/Berlin")
  }
  return { dayjs }
}