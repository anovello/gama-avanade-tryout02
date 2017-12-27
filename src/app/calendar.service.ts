import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
// import { Observable } from 'rxjs/Observable'
// import 'rxjs/add/operator/do'
// import 'rxjs/add/operator/map';


@Injectable()
export class CalendarService{
	
	tags: any = []

	constructor(private http: HttpClient){}

	getEventDay(date){
		return this.http.get<any>(`api/appointments?date=${date}`)
	}

	setEvent(date){
		return this.http.post<any>(`api/appointments`, date)
	}
}