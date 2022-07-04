import { Component , Input,} from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Search} from './app-state/models/search.model';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})

export class BarChartComponent {

  constructor () { }
  @Input() search: Search;

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [
    { data: [], label: '' }
  ];

  ngOnInit () {
    // build a per day tweets dictionary based on search results
    const days_result = this.search.search_result;
    let unique_days = {};
    for (let i = 0; i < days_result.length; i++) {
        const date = days_result[i]['created_at'].substring(0, days_result[i]['created_at'].indexOf('T'));
        if (date in unique_days) {
            unique_days[date] += 1;
        } else {
            unique_days[date] = 1;
        }
    }
    // delete init values
    this.barChartLabels.pop();
    this.barChartData.pop();

    const keys = Object.keys(unique_days);
    let chart_data = [];
    keys.forEach(function(key){
        chart_data.push(unique_days[key])
    });

    // update chart
    this.barChartLabels= keys;
    this.barChartData.push(
        { data: chart_data, label: 'Tweets' });   
    } 
}
