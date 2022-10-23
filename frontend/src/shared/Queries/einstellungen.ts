import gql from "graphql-tag"
import { useQuery } from '@vue/apollo-composable'

type ReturnType = {
  einstellungen: {
    data: {
      attributes: {
        plakat: {
          data: {
            attributes: {
              url: string
            }
          }
        },
        keinePanik: {
          data: {
            attributes: {
              url: string
            }
          }
        },
        Ferien: boolean
      }
    }
  }
}

export default () => useQuery<ReturnType>(gql`
    {einstellungen{data{attributes{
    plakat{data{attributes{url}}}
    keinePanik{data{attributes{url}}}
    Ferien
    }}}}
`)