import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Observer, Subscription, from, of, concat, fromEvent } from 'rxjs';
import { reduce, map, mergeMap, switchMap, filter, first, delay, partition } from 'rxjs/operators';

import { Notification } from './notification.model';

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
        for (let element in arr) console.log(element);
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
      .subscribe((result: string) => console.log(`Async task4 result: ${result}`));
    this.subscriptions.push(timeoutSubscription);

    // Task 5:
    // Create simple 'hot' and 'cold' Observable.
    // cold observable
    const coldObservable: Observable<number> = Observable
      .create((observer: Observer<number>) => {
        observer.next(Math.random());
      });
    console.log('task5: cold observable');
    // subscription 1
    const coldSubscription1 = coldObservable.subscribe((data) => {
      console.log(`cold data #1: ${data}`);
    });
    // subscription 2
    const coldSubscription2 = coldObservable.subscribe((data) => {
      console.log(`cold data #2: ${data}`);
    });
    this.subscriptions.push(coldSubscription1);
    this.subscriptions.push(coldSubscription2);
    // hot observable
    const random: number = Math.random();
    const hotObservable: Observable<number> = Observable.create((observer) => {
      observer.next(random);
    });
    console.log('task5: hot observable');
    // subscription 1
    const hotSubscription1 = hotObservable.subscribe((data) => {
      console.log(`hot data #1: ${data}`);
    });
    // subscription 2
    const hotSubscription2 = hotObservable.subscribe((data) => {
      console.log(`hot data #2: ${data}`);
    });
    this.subscriptions.push(hotSubscription1);
    this.subscriptions.push(hotSubscription2);

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
    console.log('task10: with error thrown');
    const withErrorSubscription = observable
      .subscribe(
        (wellness: string) => console.log(`good message: ${wellness}`),
        (error: string) => console.log(`error thrown: ${error}`)
      );
    this.subscriptions.push(withErrorSubscription);

    // Task 11:
    const notifications: Array<Notification> = [ 
      { userId: 1, name: 'A1', delay: 100 }, // should be shown
      { userId: 1, name: 'A2', delay: 1500 }, // shouldn't be shown
      { userId: 1, name: 'A3', delay: 2500 }, // shouldn't be shown
      { userId: 1, name: 'A4', delay: 3500 }, // should be shown
      { userId: 2, name: 'B1', delay: 200 }, // should be shown
      { userId: 2, name: 'B2', delay: 300 }, // shouldn't be shown
      { userId: 2, name: 'B3', delay: 3500 }, // should be shown
    ];
    console.log('task11:');  
    const setOfDistinct = new Map<number, number>();
    const notificationsSubscription = from(notifications)
      .pipe(
        mergeMap((notification: Notification) => {
          return of(notification)
            .pipe(
              delay(notification.delay),
              map((item: Notification) => {
                const { userId, delay } = item;
                if (setOfDistinct[userId] && delay - setOfDistinct[userId] <= 3000) return null;
                setOfDistinct[userId] = delay;
                return item;
              }),
              filter((item: Notification) => item !== null)
            );
        })
      )
      .subscribe((notification: Notification) => console.log(`task11 async item: `, notification));
    this.subscriptions.push(notificationsSubscription);
  }

  ngOnDestroy() {
    // Unsubscribe from Subscriptions
    this.subscriptions.forEach(
      (subscription: Subscription) => { subscription.unsubscribe(); }
    );
  }
}
