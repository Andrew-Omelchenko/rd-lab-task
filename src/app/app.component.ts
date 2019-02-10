import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, from, of, concat, fromEvent } from 'rxjs';
import { reduce } from 'rxjs/operators';
import { pipe } from '@angular/core/src/render3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'rd-lab-task';
  fromSubscription: Subscription;
  ofSubscription: Subscription;
  concatSubscription: Subscription;
  coordsSubscription: Subscription;

  ngOnInit() {
    // Task 1:
    // From an array emit items one by one [1,2,3];
    // from([1,2,3])
    // of([1,2,3])
    const arr: Array<number> = [1, 2, 3];
    console.log('task1: from() - flattened');
    this.fromSubscription = from(arr)
      .subscribe((element: number) => console.log(element));
    console.log('task1: of() - unflattened');
    this.ofSubscription = of(arr)
      .subscribe((arr: number[]) => {
        for (let elem in arr) console.log(elem);
      });

    // Task 2:
    // Combine the results and multiply they
    // const getConversionRate$ = Rx.Observable.of(0.5);
    // const getAmountToConvert$ = Rx.Observable.of(100);
    const getConversionRate$: Observable<number> = of(0.5);
    const getAmountToConvert$: Observable<number> = of(100);
    console.log('task2: combine and multiply');
    this.concatSubscription = concat(getConversionRate$, getAmountToConvert$)
      .pipe(
        reduce((acc: number, value: number) => acc * value, 1)
      )
      .subscribe(result => console.log(result));

    // Task 3:
    // Create an observable from window mouse clicks and show coordinates in console.
    console.log('task3: mouse clicks');
    this.coordsSubscription = fromEvent<MouseEvent>(document, 'click')
      .subscribe(event => console.log(`x-coord: ${event.screenX}`, `y-coord: ${event.screenY}`));
  }

  ngOnDestroy() {
    // Unsubscribe from Subscriptions
    // Task 1:
    this.fromSubscription.unsubscribe();
    this.ofSubscription.unsubscribe();
    // Task 2:
    this.concatSubscription.unsubscribe();
    // Task 3:
    this.coordsSubscription.unsubscribe();
  }
}
