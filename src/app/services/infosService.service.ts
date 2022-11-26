import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import  autresBanques from '../../assets/params/autresbanques.json';
import encaissements from '../../assets/params/encaissements.json';
import encaissementCategories from '../../assets/params/encaissementcategories.json';
import paiements from '../../assets/params/paiements.json';
import paiementCategories from '../../assets/params/paiementcategories.json';
import baq from '../../assets/params/baq.json';
import bad from '../../assets/params/bad.json';
import mop from '../../assets/params/mop.json';
import { Infos } from '../models/infos';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfosService {
    public infos: Infos = new Infos();
    public tuc:any[]=[];

    constructor(
        private http: HttpClient,
        ) {
     }

    setInfos(i:string) {
        this.infos=JSON.parse(i);
     }
    getAutresBanques() {
        return autresBanques;
    }
    getEncaissements() {
        return encaissements;
    }
    getEncaissementCategories() {
        return encaissementCategories;
    }
    getPaiements() {
        return paiements;
    }
    getPaiementCategories() {
        return paiementCategories;
    }
    getBAQ() {
        return baq;
    }
    getBAD() {
        return bad;
    }
    getMOP() {
        return mop;
    }
    initTuc() {
        let httpHeaders = new HttpHeaders({
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
        });
        return this.http.get("./assets/params/tuc.json"
            , {
                headers: httpHeaders,
                responseType: 'json',
                observe: 'response',
            })
            .pipe(
                map((res) => {
                    return JSON.parse(JSON.stringify(res.body));
                })
                ,
                catchError(this.errorHandle)
            );
    }
    getTuc() {
        return this.tuc;
    }
    setTuc(arr:any) {
        this.tuc = arr;
        return this.tuc;
    }

    errorHandle(error: any) {
        let errorMessage="";
        if (error == undefined || error == null) {
            errorMessage = "Erreur indéterminée à l'appel du service";
        }
        if (error.error) {
            errorMessage = `Erreur ${error.status} : ${error.error.code} : ${error.error.message} `;
        } else {
            errorMessage = `Erreur ${error.status} : Service en erreur (${error.message})`;
        }
        console.log('===================errorHandle : errorMessage=', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
