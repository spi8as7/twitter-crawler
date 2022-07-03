import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { AppService } from './app.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-display-board',
  templateUrl: './display-board.component.html',
  styleUrls: ['./display-board.component.css']
})

export class DisplayBoardComponent implements OnInit {

  selectedItem : any;

  constructor(private appService: AppService) { }

  @Input() users: any[];
  @Output() selectedSearchEvent = new EventEmitter<string>();

  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.appService.getUsers().pipe(takeUntil(this.destroy$)).subscribe((users: any[]) => {
      this.users = users;
    });
  }

  selectedSearch(value: string) {
    console.log(value);
    this.selectedSearchEvent.emit(value);
  }

}
