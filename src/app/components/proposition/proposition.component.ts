import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { InfosService } from '../../services/infosService.service';


@Component({
  selector: 'app-proposition',
  templateUrl: './proposition.component.html',
  styleUrls: ['./proposition.component.scss']
})
export class PropositionComponent implements OnInit {

  @ViewChild('invoice') invoiceElement!: ElementRef;
  inProgress = false;
  today = new Date();
  finProposition = new Date();

  constructor(
    public infosService: InfosService
  ) { }

  ngOnInit(): void {
    this.today = new Date();
    this.finProposition.setDate(this.today.getDate() + 15);
  }

  getLibelleAgence() {
    let agCode = this.infosService.infos.agenceCollab;
    if (agCode == "") {
      return "Unknown unit";
    } else {
      let ag = this.infosService.getTuc().find(elt => elt.ag == agCode);
      if (ag != undefined) { return ag.nom; } else { return ""; }
    }
  }
  getRueAgence() {
    let agCode = this.infosService.infos.agenceCollab;
    if (agCode == "") {
      return "";
    } else {
      let ag = this.infosService.getTuc().find(elt => elt.ag == agCode);
      if (ag != undefined) { return ag.rue; } else { return ""; }
    }
  }
  getVilleAgence() {
    let agCode = this.infosService.infos.agenceCollab;
    if (agCode == "") {
      return "";
    } else {
      let ag = this.infosService.getTuc().find(elt => elt.ag == agCode);
      if (ag != undefined) { return ag.ville; } else { return ""; }
    }
  }

  getCatBasket(cat: string) {
    return this.infosService.infos.basket.filter((e: any) => e.categorie == cat)
  }

  public generatePDF(): void {
    this.inProgress = true;
    html2canvas(this.invoiceElement.nativeElement).then(canvas => {
      const imgtype = "jpeg";
      const imgData = canvas.toDataURL('image/png')
      var doc = new jsPDF('p', 'mm', 'a4');
      var pageWidth = 210;
      var pageHeight = 297;
      var imgWidth = pageWidth;
      var imgHeight = canvas.height * pageWidth / canvas.width;

      var heightLeft = imgHeight;
      var position = 0;
      doc.addImage(imgData, imgtype, 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 1) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, imgtype, 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      let fn = "Proposition_"
      if (this.infosService.infos.RS != "") {
        fn += this.infosService.infos.RS;
      }
      else {
        fn += "societe_";
      }
      doc.save(fn+" du_" + this.today.getUTCDate() + "_" + (this.today.getMonth()+1) + "_" + this.today.getFullYear() + ".pdf")

      this.inProgress = false;
    });
  }

}
