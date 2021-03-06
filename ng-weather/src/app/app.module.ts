import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { TooltipModule } from 'ng2-tooltip-directive';

import { AppComponent } from './app.component';
import { HeadingComponent } from './heading/heading.component';
import { LocationComponent } from './location/location.component';
import { ChartsComponent } from './charts/charts.component';
import { FormatDatePipe } from './charts/charts.component';
import { TableComponent } from './table/table.component';
import { TableRowComponent } from './table-row/table-row.component';

@NgModule({
  declarations: [
    AppComponent,
    HeadingComponent,
    LocationComponent,
    ChartsComponent,
    TableComponent,
    TableRowComponent,
    FormatDatePipe
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ChartsModule,
    TooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
