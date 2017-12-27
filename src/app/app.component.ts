import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import * as moment from 'moment';
import { CalendarService } from './calendar.service';

import { List } from './list.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

	rForm: FormGroup;
	title: FormControl

	year: number = 2017
	month: number = 12
	day: number = 20
	data: Array<List> = []
	date: Date = new Date(this.year, this.month - 1)
	event: any = {}
 	
 	constructor(private calendarService: CalendarService, private fb: FormBuilder) {
 		this.rForm = fb.group({
	      'title' : ['', Validators.required]
	    });
 	}

	ngOnInit() {
		// console.log(this.rForm.value.title = 'asdasd')
		this.rForm.value.title = 'asdasd'
		this.generateDate();
		this.keys();
	}

	remainingDays(date: any, start: boolean)
	{
		let data = moment(date),
			rest = 0;

		if (start === true)
		{
			switch(data.weekday()) {
			    case 0:
			        rest = 6
			        break;
			    case 1:
			        rest = 5
			        break;
			    case 2:
			        rest = 4
			        break;
			    case 3:
			        rest = 3
			        break;
			    case 4:
			        rest = 2
			        break;
			    case 5:
			        rest = 1
			        break;
			    case 6:
			        rest = 0
			        break;
			    default:
			        rest = 0
			}

			let a = data.add(rest+1, 'day');

			return a.format('YYYY-MM-DD');
		} else {
			rest = data.weekday();
			rest = rest * -1;

			let a = data.add(rest, 'day');
			return a.format('YYYY-MM-DD');
		}
	}

	formatYear()
	{
		var str = this.year.toString();
		return str.substring(str.length, 2);
	}

	formatMonth()
	{
		let month = moment(this.year+'-'+this.month);
		return month.format('MMMM');
	}

	updateDate(next: boolean)
	{
		if (next)
		{
			if (this.month < 12)
			{
				this.month++;
			} else {
				this.month = 1;
				this.year++;
			}
		} else {
			if (this.month > 1)
			{
				this.month--;
			}else{
				this.month = 12;
				this.year--;
			}
		}
		this.date = new Date(this.year, this.month - 1);
		this.generateDate();
	}

	generateDate()
	{
		this.data = [];

		let firstDay = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
		let lastDay = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);

		for (let m = moment(this.remainingDays(firstDay, false)); m.isBefore(this.remainingDays(lastDay, true)); m.add(1, 'days')) {
			
			let da = {
				data: m.format('YYYY-MM-DD'), 
				day: m.format('DD'),
				month: m.format('MM'),
				week: m.format('dddd'),
				event: false,
				current: parseInt(m.format('M')) === this.month
			};

			if (this.day === parseInt(m.format('DD')) && parseInt(m.format('M')) === this.month)
			{
				this.displayEvent(da);
			}
			this.data.push(da);

			this.calendarService.getEventDay(m.format('YYYY-MM-DD'))
		                      .subscribe(res => {

		                      	if (res.length > 0)
		                      	{
		                      		let selected = this.data.find(v => v.data == res[0].date)
		                      		if(selected)
		                      		{
		                      			selected.event = true;
		                      		}
		                      	}
		          
		                      })
			
		}
	}

	strToInt(str)
	{
		return parseInt(str);
	}

	displayEvent(obj)
	{
		if(obj.current)
		{
			this.event = {
				date: obj.data,
				day: obj.day,
				week: obj.week,
				event: []
			};

			this.calendarService.getEventDay(obj.data)
			                      .subscribe(res => {
			                      	
			                      	if (res.length > 0)
			                      	{
			                      		res.forEach(v => {
			                      			this.event.event.push(v.title);
			                      		});
			                      	}		          
			                      });
			this.day = parseInt(obj.day) 
		}
	}

	keys()
	{
		return Object.keys(this.event).length;
	}

	addEvent(event)
	{
		this.calendarService.setEvent({date: this.event.date, title: event.title}).subscribe(res => {
			let selected = this.data.find(v => v.data == this.event.date)

      		if(selected)
      		{
      			selected.event = true;
      		}

      		this.event.event.push(event.title)
      		this.rForm.reset();
		})
	}
	
}