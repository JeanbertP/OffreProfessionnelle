import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { DiagnosticComponent } from './components/diagnostic/diagnostic.component';
import { TarificationComponent } from './components/tarification/tarification.component';
import { PropositionComponent } from './components/proposition/proposition.component';
import { HelpDialogComponent } from './components/help/help.component';

@NgModule({
  declarations: [
    AppComponent,
    HelpDialogComponent,
    DiagnosticComponent,
    TarificationComponent,
    PropositionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    // MatDatepickerModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
