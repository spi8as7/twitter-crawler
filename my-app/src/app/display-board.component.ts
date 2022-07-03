import { Component, OnInit, Input, } from '@angular/core';
import { AppService } from './app.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-display-board',
  templateUrl: './display-board.component.html',
  styleUrls: ['./display-board.component.css']
})

export class DisplayBoardComponent implements OnInit {

  constructor(private appService: AppService) { }

  @Input() users: any[];

  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.appService.getUsers().pipe(takeUntil(this.destroy$)).subscribe((users: any[]) => {
      this.users = users;
    });
  }
}
