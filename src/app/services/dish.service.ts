import { Injectable } from '@angular/core';
import { Dish } from '../shared/dish';
/* import { DISHES } from '../shared/dishes'; */
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';    
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor( private http:HttpClient) { }

  /* getDishes(): Promise<Dish[]> {
    return new Promise(resolve=>{
      //SIMIULATE SERVER LETENCY OF 2s
      setTimeout(()=>resolve(DISHES),2000);
    });
  } */
  // using observables and then convert them to promises 
  
/*   getDishes(): Promise<Dish[]> {
    return of(DISHES).pipe(delay(2000)).toPromise();
  }
 */
 // using observables 
  getDishes(): Observable<Dish[]> {
   // return of(DISHES).pipe(delay(2000));
    return this.http.get<Dish[]>(baseURL+'dishes');
  }

  getDish(id: string):Observable<Dish> {
    //return of(DISHES.filter((dish) => (dish.id === id))[0]).pipe(delay(2000));
    return this.http.get<Dish>(baseURL+'dishes/' +id)
  }

  getFeaturedDish(): Observable<Dish>{
    //return of(DISHES.filter((dish) => (dish.featured))[0]).pipe(delay(2000));
    return this.http.get<Dish>(baseURL + 'dishes?featured=true')
    .pipe(map(dishes=>dishes[0]))
  }

  getDishIds(): Observable<string[] | any> {
   // return of(DISHES.map(dish => dish.id ));
   return this.getDishes().pipe(map(dishes => dishes.map(dish => dish.id)))
  }
}
