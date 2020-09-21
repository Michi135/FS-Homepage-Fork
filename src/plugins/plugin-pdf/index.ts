//const pdf = require("pdfjs-dist")
import * as pdf from "pdfjs-dist"



export interface Pdf {


}

export interface Page {

}

export const getDocument = async (path: string): Promise<pdf.PDFLoadingTask<pdf.PDFDocumentProxy>> => {
  return pdf.getDocument(path)
}

const setup = () => {
  const pdfjsWorker = require('pdfjs-dist/lib/pdf.worker.js');
  pdf.GlobalWorkerOptions.workerSrc = pdfjsWorker
}

setup()
/*
var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 0.8,
    canvas = document.getElementById('the-canvas'),
    ctx = canvas.getContext('2d');
*/
/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 *//*
export function renderPage(pdfDoc: pdf.PDFDocumentProxy, canvas: HTMLCanvasElement, num: number) {
pageRendering = true;
// Using promise to fetch the page
pdfDoc.getPage(num).then(function(page) {
 var viewport = page.getViewport({scale: scale});
 canvas.height = viewport.height;
 canvas.width = viewport.width;

 // Render PDF page into canvas context
 var renderContext = {
   canvasContext: ctx,
   viewport: viewport
 };
 var renderTask = page.render(renderContext);

 // Wait for rendering to finish
 renderTask.promise.then(function() {
   pageRendering = false;
   if (pageNumPending !== null) {
     // New page rendering is pending
     renderPage(pdfDoc, canvas,  pageNumPending);
     pageNumPending = null;
   }
 });
});
}

/**
* If another page rendering in progress, waits until the rendering is
* finised. Otherwise, executes rendering immediately.
*/
/*
function queueRenderPage(pdfDoc: pdf.PDFDocumentProxy, canvas: HTMLCanvasElement, num: number) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(pdfDoc, canvas, num);
  }
}*/

/**
 * Displays previous page.
 */
/*
function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}
document.getElementById('prev').addEventListener('click', onPrevPage);
*/
/**
 * Displays next page.
 */
/*
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}
document.getElementById('next').addEventListener('click', onNextPage);

/**
 * Asynchronously downloads PDF.
 *//*
pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
pdfDoc = pdfDoc_;
document.getElementById('page_count').textContent = pdfDoc.numPages;

// Initial/first page rendering
renderPage(pageNum);
});*/