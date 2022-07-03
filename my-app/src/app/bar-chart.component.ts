import { Component , Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { User} from '../app/app-state/models/user.model';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})

export class BarChartComponent implements OnInit{

  constructor() { }

  @Input() user: User;

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [
    { data: [45, 37, 60, 70, 46, 33], label: 'Best Fruits' }
  ];

  ngOnInit(): void {
    let days = this.user.search_result;
    
    for (let i = 0; i < days.length; i++) {
        days[i].created_at.setMilliseconds(0);
        days[i].created_at.setSeconds(0);
        days[i].created_at.setMinutes(0);
        days[i].created_at.setHours(0);
        console.log(days[i]['created_at']);
    }

    const unique_days = Array.from(new Set(days));
    console.log(unique_days);
    this.barChartData = [
        { data: [0, 37, 0, 0, 46, 33], label: 'Best Fruits' }
      ];
  }

  
}