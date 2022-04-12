type Rule = {
    id: string,
    element: string,
    style?: Record<string, string>
    allowed?: string,
}

const paragraph: Rule = {
  id: 'p',
  element: 'p',
  allowed: 'inline*'
}

const underlined: Rule = {
  id: 'underline',
  element: 'SPAN',
  allowed: 'inline*',
  style: {
    'text-decoration': 'underline'
  }
}

const overline: Rule = {
  id: 'underline',
  element: 'SPAN',
  style: {
    'text-decoration': 'overline'
  }
}

const lineTrough: Rule = {
  id: 'line-trough',
  element: 'SPAN',
  style: {
    'text-decoration': 'line-through'
  }
}

const strong: Rule = {
  id: 'strong',
  element: 'STRONG'
}

const em: Rule = {
  id: 'em',
  element: 'EM'
}


export const blockElements =
{
  id: 'block',
  elements: new Set<Rule>([paragraph])
}

export const inlineElements = {

}