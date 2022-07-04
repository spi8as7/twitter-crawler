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

  @Input() searches: any[];
  @Output() selectedSearchEvent = new EventEmitter<string>();

  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnInit(): void {
    this.appService.getSearches().pipe(takeUntil(this.destroy$)).subscribe((searches: any[]) => {
      this.searches = searches;
    });
  }

  selectedSearch(value: string) {
    this.selectedSearchEvent.emit(value);
  }

}
