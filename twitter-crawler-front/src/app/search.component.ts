import { Component, OnInit, Input , Output, EventEmitter } from '@angular/core';
import { Search } from './app-state/models/search.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  
  constructor() { }

  @Input() search: Search;
  @Output() getSearchEvent = new EventEmitter();

  ngOnInit(): void {
    this.getSearchEvent.emit('get search');
  }

}
