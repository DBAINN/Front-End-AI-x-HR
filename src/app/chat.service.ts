import { Injectable } from '@angular/core';
import { PdfService } from './pdf.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private pdfservice:PdfService) { }

  updateChatResponse(identifier: string, item: string, answer: string, pages: string | number[], isChapterTitle = false, isAnswered = true) {
    const tableBody = document.querySelector('#chatResponsesTable tbody');

    if (!tableBody) {
      console.error("Table body not found.");
      return;
    }
    const newRow = document.createElement('tr');
    newRow.classList.add('border-bottom'); // Aggiungi la classe CSS per il bordo inferiore
    const answerStyle = isAnswered ? '' : 'color: red;';

    let pagesHtml: string;
    if (Array.isArray(pages)) {
      pagesHtml = pages.map(page =>
        `<span class="page-link" data-page="${page}" title="Vai a pagina ${page}">${page}</span>`
      ).join(', ');
    } else {
      pagesHtml = '-';
    }

    newRow.innerHTML = `
      <td style="font-size:14px; padding:10px; border-bottom: 1px solid #ccc;">${identifier}</td>
      <td style="font-size:14px; text-align:left; padding-left: 20px; padding:10px; border-bottom: 1px solid #ccc;">${isChapterTitle ? '<b>' + item + '</b>' : item}</td>
      <td style="font-size:14px; text-align:left; padding-left: 20px; padding:10px; border-bottom: 1px solid #ccc;">${answer}</td>
      <td style="font-size:14px; padding:10px; border-bottom: 1px solid #ccc;">${pagesHtml}</td>
    `;
// Ottieni tutti gli elementi <span> con la classe 'page-link'
const pageLinks = document.querySelectorAll('.page-link');

// Itera su ogni elemento e aggiungi l'evento di hover
pageLinks.forEach((pageLink: Element, index: number) => {
  // Effettua un type assertion per convertire l'elemento generico in un HTMLElement
  const pageLinkElement = pageLink as HTMLElement;

  pageLinkElement.addEventListener('mouseenter', () => {
    // Cambia il cursore quando il mouse entra nell'elemento
    pageLinkElement.style.cursor = 'pointer';
  });

  pageLinkElement.addEventListener('mouseleave', () => {
    // Ripristina il cursore quando il mouse esce dall'elemento
    pageLinkElement.style.cursor = 'auto';
  });

  pageLinkElement.addEventListener('click', async () => {
    // Ottieni il numero di pagina dall'attributo 'data-page'
    const pageNumber = pageLinkElement.dataset['page'];
    if (pageNumber) {
      // Converti il numero di pagina in un numero intero
      const pageNum = parseInt(pageNumber);
      // Ottieni l'URL del PDF utilizzando il servizio PdfService
      const pdfUrl = this.pdfservice.getPdfUrl();
      // Chiamata alla funzione per aprire il PDF alla pagina specificata
      if (pdfUrl) {
        // Utilizza pdfUrl per comporre l'URL del PDF insieme al numero di pagina
        const timestamp = new Date().getTime();
        const pdfWithPage = `http://localhost:5000/pos/${pdfUrl}?t=${timestamp}#page=${pageNum}`;
        window.open(pdfWithPage, '_blank');
      } else {
        console.error('Nome del PDF non disponibile.');
      }
    }
  });
});


     // Aggiungiamo la classe CSS direttamente alle righe dispari
     if (tableBody.children.length % 2 === 0) {
      newRow.classList.add('odd-row');
    }

    tableBody?.appendChild(newRow);
  }
}


