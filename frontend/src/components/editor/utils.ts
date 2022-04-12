function getDocumentRange()
{
  if (typeof window === 'undefined')
    return undefined

  return document.getSelection()?.getRangeAt(0)
}

export { getDocumentRange }


/**
 * if editor empty add paragraph
 */