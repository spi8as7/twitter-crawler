import { Component, OnInit, Input , Output, EventEmitter } from '@angular/core';
import { User} from '../app/app-state/models/user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  
  constructor() { }

  @Input() user: User;
  @Output() getUserEvent = new EventEmitter();

  ngOnInit(): void {
    this.getUserEvent.emit('get user');
  }

}
