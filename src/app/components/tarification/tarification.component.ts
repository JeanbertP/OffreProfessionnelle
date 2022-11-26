import { Component, Inject, OnInit } from '@angular/core';
// import { ElementRef, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { MatTableDataSource } from '@angular/material/table';


import { InfosService } from '../../services/infosService.service';

@Component({
  selector: 'app-tarification',
  templateUrl: './tarification.component.html',
  styleUrls: ['./tarification.component.scss']
})
export class TarificationComponent implements OnInit {
  // @ViewChild() myNameElem: ElementRef;
  dataSourceBAQ = new MatTableDataSource<any>(this.infosService.getBAQ());
  displayedBAQColumns = ["select", "pdt", "periodicite", "tarif", "reduction", "delegataire", "tarifreel"]

  dataSourceBAD = new MatTableDataSource<any>(this.infosService.getBAD());
  displayedBADColumns = ["select", "pdt", "periodicite", "tarif", "reduction", "delegataire", "tarifreel"]

  dataSourceMOP = new MatTableDataSource<any>(this.infosService.getMOP());
  displayedMOPColumns = ["select", "pdt", "periodicite", "tarif", "reduction", "delegataire", "tarifreel"]


  constructor(
    public infosService: InfosService,
    private dialog: MatDialog,
    @Inject(DOCUMENT) document: Document,
  ) { }

  ngOnInit() {
    //ajout automatique des produits qui sont par défaut (auto-sélectionnés)
    let potentialDefautProduct = this.infosService.getBAQ().filter((elt: any) => elt.autoselectedpdt == true);
    potentialDefautProduct.forEach(
      (elt) => {
        if (!this.isInBasket(elt, 'BAQ'))
          this.infosService.infos.basket.push(elt);
      }
    );
    potentialDefautProduct = this.infosService.getBAD().filter((elt: any) => elt.autoselectedpdt == true);
    potentialDefautProduct.forEach(
      (elt) => {
        if (!this.isInBasket(elt, 'BAD'))
          this.infosService.infos.basket.push(elt);
      }
    );
    potentialDefautProduct = this.infosService.getMOP().filter((elt: any) => elt.autoselectedpdt == true);
    potentialDefautProduct.forEach(
      (elt) => {
        if (!this.isInBasket(elt, 'MOP'))
          this.infosService.infos.basket.push(elt);
      }
    );
  }

  reductionSelection(ev: any, row: any, i: any, cat: any) {
    // Find the selected item in the listbox
    let reducIndex = row.reductionTab.findIndex((elt: any) => elt == ev.value);
    // Handling of particular cases :
    //   1) Case when the price "Tarif" is enable according to the reduction "Réduction" : if RFS or Free Entry, you can type the value
    if (row.reductionTab[reducIndex] == "RFS" || row.reductionTab[reducIndex] == "Free entry") {
      row.saisielibre = true;
    } else {
      row.saisielibre = false;
    }
    row.reductionindex = reducIndex;
    row.delegataire = row.delegataireTab[reducIndex];
    row.tarifreel = row.tarifTab[reducIndex];

    //   2) Case when the choice of the reduction must be identical for the all products
    if (row.reductionsassociees.length > 0) {
      let scopedProducts = <any>[];
      // Get the product description which are products with the pricing is linked to a master pricing 
      // NB : autoselectedreduction==false is just to speed up the loop in the array
      //Note : possible improvement : merge the 3 files, add a category level
      if (cat == "BAQ") scopedProducts = this.infosService.getBAQ().filter((elt: any) => elt.autoselectedreduction == true && row.reductionsassociees.includes(elt.pdt));
      if (cat == "BAD") scopedProducts = this.infosService.getBAD().filter((elt: any) => elt.autoselectedreduction == true && row.reductionsassociees.includes(elt.pdt));
      if (cat == "MOP") scopedProducts = this.infosService.getMOP().filter((elt: any) => elt.autoselectedreduction == true && row.reductionsassociees.includes(elt.pdt));
      scopedProducts.forEach((pdtassotrouve: any) => {
        pdtassotrouve.delegataire = pdtassotrouve.delegataireTab[reducIndex];
        pdtassotrouve.tarifreel = pdtassotrouve.tarifTab[reducIndex];
        //   3) Case when the reduction choice must be identical for all the products
        //      AND if one reduction choice allows a free entry
        if (row.reductionTab[reducIndex]  == "Free entry") {
          pdtassotrouve.saisielibre = true;
          pdtassotrouve.autoselectedreductiondependance= false; //indicates that if the value could be displayed 
        } else {
          pdtassotrouve.autoselectedreductiondependance = true;
          pdtassotrouve.saisielibre = false;
        }
      });
    }
  }

  inOutBasket(ev: any, r: any, cat: any) {
    if (ev.checked) { //to avoid to test explicitally that the product is in the basket
      // Add the product
      this.infosService.infos.basket.push(r as never);
      // If the products are linked, they are also added
      if (r.pdtassocies.length > 0) {
        let scopedProducts = <any>[];
        // Retrieve the linked products
        // NB : selectable==false is just to speed up
        if (cat == "BAQ") scopedProducts = this.infosService.getBAQ().filter((elt: any) => elt.selectable == false && r.pdtassocies.includes(elt.pdt));
        else if (cat == "BAD") scopedProducts = this.infosService.getBAD().filter((elt: any) => elt.selectable == false && r.pdtassocies.includes(elt.pdt));
        else if (cat == "MOP") scopedProducts = this.infosService.getMOP().filter((elt: any) => elt.selectable == false && r.pdtassocies.includes(elt.pdt));
        this.infosService.infos.basket = this.infosService.infos.basket.concat(scopedProducts);
      }
    }
    else {
      // Remove the product
      this.infosService.infos.basket = this.infosService.infos.basket.filter((elt: any) => elt.pdt != r.pdt);
      // Remove the linked product
      if (r.pdtassocies.length > 0) {
        r.pdtassocies.forEach((pdtasso: any) => {
          this.infosService.infos.basket = this.infosService.infos.basket.filter((elt: any) => elt.pdt != pdtasso)
        });
      }
    }
  }

  isInBasket(row: any, cat: any) {
    return -1 != this.infosService.infos.basket.findIndex((elt: any) => row.pdt == elt.pdt);
  }

  setMail() {
    this.infosService.infos.mailCollab = this.infosService.infos.prenomCollab + "." + this.infosService.infos.nomCollab + "@acme.com"
  }
}
