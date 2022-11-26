import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';

import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

import { HelpDialogComponent } from '../help/help.component';
import { InfosService } from '../../services/infosService.service';


@Component({
  selector: 'app-diagnostic',
  templateUrl: './diagnostic.component.html',
  styleUrls: ['./diagnostic.component.scss']
})
export class DiagnosticComponent implements OnInit {
  RSFormControl = new FormControl('', [Validators.required]);
  dateRdvFormControl = new FormControl('', [Validators.required]);
  dataSourceEncaissement = new MatTableDataSource<any>(this.infosService.getEncaissements());
  encaissementCategoriesFilter: any = [];
  displayedEncaissementColumns = ["select", "categ", "situation", "besoin", "solution", "url", "modeop"]
  selectedEncaissementCategories = [];
  selectionEncaissement = new SelectionModel<any>(true, []);

  dataSourcePaiement = new MatTableDataSource<any>(this.infosService.getPaiements());
  paiementCategoriesFilter: any = [];
  displayedPaiementColumns = ["select", "categ", "situation", "besoin", "solution", "url", "modeop"]
  selectedPaiementCategories = [];
  selectionPaiement = new SelectionModel<any>(true, []);

  //compteCategories = ["Accéder à mes comptes", "Réaliser des virements supérieurs à 45k€ ou affecter plusieurs utilisateurs", "Utiliser le même support pour plusieurs établissements", "Disposer d'une solution pour préparer mes remises de prévélement"];
  compteCategories = ["Access to my accounts", "Make transfers over €45k or assign multiple users", "Use the same medium for several establishments", "Have a solution to prepare my remittances"];
  compteCategoriesFilter: any = [];
  selectedCompteCategories = [];


  constructor(
    private dialog: MatDialog,
    private dateAdapter: DateAdapter<Date>,
    public infosService: InfosService
  ) { }

  ngOnInit(): void {
    this.dateAdapter.setLocale('fr');
    this.dataSourceEncaissement.filterPredicate = (data: any, filter: string) => {
      return this.encaissementCategoriesFilter.includes(data.categ);
    };
    this.dataSourcePaiement.filterPredicate = (data: any, filter: string) => {
      return this.paiementCategoriesFilter.includes(data.categ);
    };

  }

  applyEncaissementCategoryFilter(ev: any) {
    let id = ev.source.id.split("_")[1]; //the catégory id Encaissement and Paiement have to be differentiated => e_xx et p_xx; then we suppress suffixes
    if (ev.checked) {
      this.encaissementCategoriesFilter.push(id);
    } else {
      this.encaissementCategoriesFilter = this.encaissementCategoriesFilter.filter((elt: any) => elt != id);
    }
    this.dataSourceEncaissement.filter = "juste_pour_declencher";
  }
  applyPaiementCategoryFilter(ev: any) {
    let id = ev.source.id.split("_")[1]; //the catégory id Encaissement and Paiement have to be differentiated => e_xx et p_xx; then we suppress suffixes
    if (ev.checked) {
      this.paiementCategoriesFilter.push(id);
    } else {
      this.paiementCategoriesFilter = this.paiementCategoriesFilter.filter((elt: any) => elt != id);
    }
    this.dataSourcePaiement.filter = "juste_pour_declencher";
  }

  applyCompteCategoryFilter(ev: any) {
    let id = ev.source.id.split("_")[1]; //the catégory id Encaissement and Paiement have to be differentiated => e_xx et p_xx; then we suppress suffixes
    if (ev.checked) {
      this.compteCategoriesFilter.push(id);
    } else {
      this.compteCategoriesFilter = this.compteCategoriesFilter.filter((elt: any) => elt != id);
    }
  }

  isInComptesCategory(id: any) {
    return this.compteCategoriesFilter.includes(id);
  }

  autresBanques() {
    return this.infosService.getAutresBanques();
  }
  calculateICI() {
    return "*12345678" + this.infosService.infos.iciAgence.padStart(5, '0') + this.infosService.infos.iciCompte.padStart(10, '0') + this.infosService.infos.iciLC.toUpperCase() + "*"
  }

  openHelpDialog(data: any) {
    let dialogRef = this.dialog.open(HelpDialogComponent);
    dialogRef.componentInstance.htmlContent = data;
  }
}
