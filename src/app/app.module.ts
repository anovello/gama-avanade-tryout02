import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';

import { AppComponent } from './app.component';
import { AppointmentsSeed }  from './appointments.seed';
import { MomentModule } from 'angular2-moment';

import { CalendarService } from './calendar.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MomentModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(
      AppointmentsSeed, { dataEncapsulation: false }
    )
  ],
  providers: [CalendarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
