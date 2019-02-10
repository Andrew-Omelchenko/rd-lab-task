import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription, from, of, concat, fromEvent } from 'rxjs';
import { reduce, map, first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  fromSubscription: Subscription;
  ofSubscription: Subscription;
  concatSubscription: Subscription;
  coordsSubscription: Subscription;
  timeoutSubscription: Subscription;
  lgSubscription: Subscription;
  firstFromSubscription: Subscription;

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
    
    // Task 4:
    // Convert a promise to an observable
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('resolved!')
      }, 1000)
    });
    console.log('task4: from promise');
    this.timeoutSubscription = from(promise)
      .subscribe((result: string) => console.log('Async task4 result: ', result));

    // Task 6:
    // Create observable of array, map each value to logarithm and show result in console.
    // [10, 100, 1000]
    const arr2: Array<number> = [10, 100, 1000];
    console.log('task6: map each value to logarithm');
    this.lgSubscription = from(arr2)
      .pipe(
        map((val: number) => Math.log10(val))
      )
      .subscribe((lgVal: number) => console.log(lgVal));

    // Task 7:
    // Get only first value from Observable.
    console.log('task7: the first name');
    this.firstFromSubscription = from(['Richard', 'Erlich', 'Dinesh', 'Gilfoyle'])
      .pipe(first())
      .subscribe((name: string) => console.log(name));
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
    // Task 4:
    this.timeoutSubscription.unsubscribe();
    // Task 6:
    this.lgSubscription.unsubscribe();
    // Task 7:
    this.firstFromSubscription.unsubscribe();
  }
}
