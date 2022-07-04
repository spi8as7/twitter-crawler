import { Component, OnInit, Input , Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-searches',
  templateUrl: './searches.component.html',
  styleUrls: ['./searches.component.css']
})
export class SearchesComponent implements OnInit {
  
  constructor() { }

  @Input() searches: any[];
  @Output() getSearchesEvent = new EventEmitter();

  ngOnInit(): void {
    this.getSearchesEvent.emit('get all searches');
  }

}
