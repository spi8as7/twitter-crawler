import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from './app.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  display = false;
  display_result = false;
  display_chart = false;

  constructor(private appService: AppService) {}

  title = 'twitter-crawler-front';

  searchForm = new FormGroup({
    keyword: new FormControl('', Validators.nullValidator && Validators.required),
    start_time: new FormControl('', Validators.nullValidator && Validators.required),
    end_time: new FormControl('', Validators.nullValidator && Validators.required)
  });

  searches: any[] = [];
  search: any;
  selected_search_id: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  onSubmit() {
    const current_time = new Date();
    let time_limit = new Date();
    time_limit.setDate(current_time.getDate() - 7);
    let start_time = this.searchForm.value.start_time;
    start_time.setHours(current_time.getHours());
    start_time.setMinutes(current_time.getMinutes());
    start_time.setSeconds(current_time.getSeconds());
    start_time.setMilliseconds(current_time.getMilliseconds());
    let end_time = this.searchForm.value.end_time;
    end_time.setHours(current_time.getHours());
    end_time.setMinutes(current_time.getMinutes());
    end_time.setSeconds(current_time.getSeconds());
    end_time.setMilliseconds(current_time.getMilliseconds());

    if ((start_time > current_time) || (end_time > current_time)) {
      alert("Can't provide data for future date");
      this.searchForm.reset();
      return; 
    }

    if (start_time > end_time) {
      alert("Starting time should be greater than the ending time");
      this.searchForm.reset();
      return;
    }

    if((start_time < time_limit) || (end_time < time_limit)) {
      alert("Twitter API can provide data only for the last 7 days");
      this.searchForm.reset();
      return;
    }
    
    this.searchForm.patchValue(
      { start_time:this.searchForm.value.start_time.toISOString(),
        end_time:this.searchForm.value.end_time.toISOString() 
      });

    this.appService.addSearch(this.searchForm.value).pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.searchForm.reset();
      this.getAllSearches();
    });
  }

  getAllSearches() {
    this.appService.getSearches().pipe(takeUntil(this.destroy$)).subscribe((searches: any[]) => {
        this.searches = searches;
    });
  }

  getSearch() {
    this.appService.getSearch(this.selected_search_id).subscribe(
      (response) => {                           
        this.search = response; 
      },
      (error) => {                             
        console.error('Request failed with error');
      })
  }

  openChart(){
    this.clearDisplays();
    this.display_chart = true;
  }

  getSelectedSearch(selected_search_id:string) {
    console.log(selected_search_id);
    this.selected_search_id=selected_search_id;
  }

  clearDisplays() {
    this.display_result = false;
    this.display = false;
    this.display_chart = false;
  }

  onShowResult() {
    this.getSearch();
    this.clearDisplays()
    this.display_result = true;
  }

  onPress() {
    this.clearDisplays();
    this.display = true;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

