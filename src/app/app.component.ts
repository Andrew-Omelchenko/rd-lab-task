import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Observer, Subscription, from, of, concat, fromEvent } from 'rxjs';
import { reduce, map, filter, first, delay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  subscriptions: Array<Subscription> = [];

  ngOnInit() {
    // Task 1:
    // From an array emit items one by one [1,2,3];
    // from([1,2,3])
    // of([1,2,3])
    const arr: Array<number> = [1, 2, 3];
    console.log('task1: from() - flattened');
    const fromSubscription = from(arr)
      .subscribe((element: number) => console.log(element));
    this.subscriptions.push(fromSubscription);
    console.log('task1: of() - unflattened');
    const ofSubscription = of(arr)
      .subscribe((arr: number[]) => {
        for (let elem in arr) console.log(elem);
      });
    this.subscriptions.push(ofSubscription);

    // Task 2:
    // Combine the results and multiply they
    // const getConversionRate$ = Rx.Observable.of(0.5);
    // const getAmountToConvert$ = Rx.Observable.of(100);
    const getConversionRate$: Observable<number> = of(0.5);
    const getAmountToConvert$: Observable<number> = of(100);
    console.log('task2: combine and multiply');
    const concatSubscription = concat(getConversionRate$, getAmountToConvert$)
      .pipe(
        reduce((acc: number, value: number) => acc * value, 1)
      )
      .subscribe((result: number) => console.log(result));
    this.subscriptions.push(concatSubscription);

    // Task 3:
    // Create an observable from window mouse clicks and show coordinates in console.
    console.log('task3: mouse clicks');
    const coordsSubscription = fromEvent<MouseEvent>(document, 'click')
      .subscribe((event: MouseEvent) => 
        console.log(`x-coord: ${event.screenX}`, `y-coord: ${event.screenY}`)
      );
    this.subscriptions.push(coordsSubscription);
    
    // Task 4:
    // Convert a promise to an observable
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('resolved!')
      }, 1000)
    });
    console.log('task4: from promise');
    const timeoutSubscription = from(promise)
      .subscribe((result: string) => console.log('Async task4 result: ', result));
    this.subscriptions.push(timeoutSubscription);

    // Task 6:
    // Create observable of array, map each value to logarithm and show result in console.
    // [10, 100, 1000]
    const arr2: Array<number> = [10, 100, 1000];
    console.log('task6: map each value to logarithm');
    const lgSubscription = from(arr2)
      .pipe(
        map((val: number) => Math.log10(val))
      )
      .subscribe((lgVal: number) => console.log(lgVal));
    this.subscriptions.push(lgSubscription);

    // Task 7:
    // Get only first value from Observable.
    console.log('task7: the first name');
    const firstFromSubscription = from(['Richard', 'Erlich', 'Dinesh', 'Gilfoyle'])
      .pipe(first())
      .subscribe((name: string) => console.log(name));
    this.subscriptions.push(firstFromSubscription);

    // Task 8:
    // Get value from Observable A, then emit Observable B
    const A$: Observable<number> = of(0.5).pipe(delay(1500));
    const B$: Observable<number> = of(100);
    console.log('task8:');
    const withDelaySubscription = concat(A$, B$)
      .subscribe((value: number) => console.log(`task8 async value: ${value}`));
    this.subscriptions.push(withDelaySubscription);

    // Task 9:
    // Get values while the 'name' length === 5
    const names: Observable<string> = of('Sharon', 'Sue', 'Sally', 'Steve');
    console.log('task9: filter array of names');
    const strFilterSubscription = names
      .pipe(
        filter((name: string) => name.length === 5)
      )
      .subscribe((name: string) => console.log(name));
    this.subscriptions.push(strFilterSubscription);

    // Task 10:
    // Handle an error and show previous results in console
    const observable: Observable<string> = Observable
      .create((observer: Observer<string>) => {
        observer.next('good');
        observer.next('great');
        observer.next('grand');
        throw 'catch me!';
        observer.next('wonderful');
      });
    console.log('task10: with error thown');
    const withErrorSubscription = observable
      .subscribe(
        (wellness: string) => console.log(`good message: ${wellness}`),
        (error: string) => console.log(`error thrown: ${error}`)
      );
    this.subscriptions.push(withErrorSubscription);
  }

  ngOnDestroy() {
    // Unsubscribe from Subscriptions
    this.subscriptions.forEach(
      (subscription: Subscription) => { subscription.unsubscribe(); }
    );
  }
}
