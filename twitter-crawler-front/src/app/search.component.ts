import { Component, OnInit, Input , Output, EventEmitter } from '@angular/core';
import { Search } from './app-state/models/search.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  
  constructor() { }
  showModal : boolean;
  twitt_id : string;

  @Input() search: Search;
  @Output() getSearchEvent = new EventEmitter();
  // @Input()twitt_id : string;

  ngOnInit(): void {
    this.getSearchEvent.emit('get search');
  }

  onClick(selected_twitt_id)
  {
    this.twitt_id =selected_twitt_id; 
    this.showModal = true;
  }
  //Bootstrap Modal Close event
  hide()
  {
    this.showModal = false;
  }

}
