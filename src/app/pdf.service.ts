import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private pdf_path:string | undefined;
  private success_request:boolean=false;
  constructor() { }
  setPdfUrl(pdfUrl: string) {
    this.pdf_path = pdfUrl;
  }

  getPdfUrl(): string | undefined {
    return this.pdf_path;
  }
  setSuccessRequest(value: boolean): void {
    this.success_request = value;
  }

  getSuccessRequest(): boolean {
    return this.success_request;
  }
}
