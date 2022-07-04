import { Component, OnInit, Input , Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  
  constructor() { }

  @Input() users: any[];
  @Output() getUsersEvent = new EventEmitter();

  ngOnInit(): void {
    this.getUsersEvent.emit('get all users');
  }

}
