import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DiagnosticComponent } from './components/diagnostic/diagnostic.component';
import { TarificationComponent } from './components/tarification/tarification.component';
import { PropositionComponent } from './components/proposition/proposition.component';


const routes: Routes = [
  { path: 'diagnostic', component: DiagnosticComponent, },
  { path: 'tarification', component: TarificationComponent },
  { path: 'proposition', component: PropositionComponent },
  { path: '**', redirectTo: 'diagnostic' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
