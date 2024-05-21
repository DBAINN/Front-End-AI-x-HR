import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse} from '@angular/common/http';
import { throwError,Observable,catchError} from 'rxjs';
import { ChatService } from '../../chat.service';

// Definizione dell'interfaccia per l'oggetto 'item'
interface Item {
  chiave: string;
  domanda: string;
  [Symbol.iterator](): IterableIterator<any>;
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:5000';
  constructor(private http: HttpClient,private chatService: ChatService){}
  uploadPOS(pdfFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('pdfFile', pdfFile);
    // Imposta l'opzione withCredentials a true
    const options = {
      headers: new HttpHeaders(),
      withCredentials:true
    };

    return this.http.post<any>(`${this.apiUrl}/uploadPOS`, formData,options);
  }
  async askQuestionsFromChecklist(checklist: any[]) {
    console.log(checklist);
    await new Promise(r => setTimeout(r, 2000)); // Attesa iniziale di 2 secondi

    for (const chapter of checklist) {
        // Verifica se 'chapter.content.elementi' è un oggetto valido
        if (typeof chapter.content.elementi === 'object' && chapter.content.elementi !== null) {
            this.chatService.updateChatResponse(`${chapter.number}.`, chapter.content.capitolo, '', '', true, false);
            // Itera sulle chiavi dell'oggetto 'elementi'
            for (const letter in chapter.content.elementi) {
                if (Object.prototype.hasOwnProperty.call(chapter.content.elementi, letter)) {
                    const item = chapter.content.elementi[letter];
                    console.log("Sending question to server...");
                    await this.sendQuestionToServer(`${chapter.number}.${letter}`, item, item.chiave, item.domanda); // Modifica qui
                }
            }
        } else {
            console.error("Invalid 'elementi' object in chapter:", chapter);
        }
    }
}



private async sendQuestionToServer(letter: string, item: Item, key: string, question: string): Promise<void> {
  const data = JSON.stringify({ art: letter, question: question, key: key });
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  const options = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials:true,
  };

  try {
      const response = await this.http.post<any>(`${this.apiUrl}/submit_answer`, data, options).toPromise();
      
      // Aggiornamento dell'interfaccia utente con la risposta ricevuta
      this.chatService.updateChatResponse(letter, item.chiave, response.answer, response.page, false, true);      
      console.log("Question answered by server:", response);
  } catch (error) {
      console.error("Error sending question to server:", error);
      throw error; // Rilancia l'errore per gestirlo altrove se necessario
  }
}
uploadFolder(zipFile: File): Observable<any> {
  const formData = new FormData();
  formData.append('zipFile', zipFile);
  const headers = new HttpHeaders();
  return this.http.post<any>(`${this.apiUrl}/uploadFolder`, formData, { headers }).pipe(
    catchError(error => {
      console.error('Error uploading folder:', error);
      return throwError(error);
    })
  );
}
downloadExcel(): void {
  const options = {
    responseType: 'blob' as 'json', // Indica al server di restituire un blob (file binario)
  };

  this.http.get('http://localhost:5000/downloadExcel', options).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Errore durante il downlaod del file excel', error);
      return throwError('Errore durante il download del file excel.');
    })
  ).subscribe((response: any) => {
    // Crea un URL temporaneo per il blob
    const url = window.URL.createObjectURL(response);
    
    // Crea un link <a> invisibile per avviare il download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Incongruenze_rilevate.xlsx'; // Nome del file scaricato
    link.click();

    // Rilascia l'URL temporaneo
    window.URL.revokeObjectURL(url);
  });
}
downloadZipFile(filename: string): Observable<Blob> {
  // Costruisci l'URL per richiedere il file ZIP dal backend
  const url = `http://localhost:5000/documents/${filename}`;
  
  // Esegui la richiesta HTTP per scaricare il file ZIP
  return this.http.get(url, { responseType: 'blob' });
}
uploadFile(file: File): Observable<any> {
  const apiUrl='http://127.0.0.1:5000/';
  const formData: FormData = new FormData();
  formData.append('file', file, file.name);

  return this.http.post<any>(apiUrl, formData).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Errore durante la richiesta al backend:', error);
      return throwError(() => new Error('Errore durante la richiesta al backend.')); // Propaga l'errore
    })
  );
}
}

