import { Component, OnInit } from '@angular/core';
import { InfosService } from './services/infosService.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'DiagFluxPro';
  activeLink = "diagnostic";

  constructor(
    public infosService: InfosService
  ) { }

  ngOnInit(): void {
    this.infosService.initTuc().subscribe((tuc) => this.infosService.setTuc(tuc)); //Async and background loading of huge file
  }

  /*
  Callback function to save data
  */
  async chooseFile(ev: Event) {
    if (ev.target == null) return;
    let target: HTMLInputElement = ev.target as HTMLInputElement;
    let fichiers = target.files;
    if (fichiers == null) return;
    let fichierAEnvoyer = fichiers[0];
    let data: string = await fichierAEnvoyer.text();
    this.infosService.setInfos(data);
  }

  /*
  Function to save data
  */
  save() {
    let today = new Date();
    let filename = "Dossier du_";
    if (this.infosService.infos.dateRdv != "") {
      today = new Date(this.infosService.infos.dateRdv);
      today.setDate(today.getDate() + 1);
    }
    filename += today.getUTCDate() + "_" + (today.getMonth() + 1) + "_" + today.getFullYear() + ".json";
    let blob = new Blob([JSON.stringify(this.infosService.infos)], {
      type: 'text/json;charset=utf-8;'
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = (navigator.userAgent.indexOf('Safari') != -1);
    //Si Safari alor ouvrir dans une nouvelle fenetre pour sauver le fichier
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename);
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

}


