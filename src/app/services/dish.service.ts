import { Injectable, Inject } from '@angular/core';
import { Dish } from '../shared/dish'
// import { DISHES } from '../shared/dishes';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { Promotion } from '../shared/promotion';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private http: HttpClient, 
    private processHTTPMshService: ProcessHTTPMsgService){ }

  getDishes(): Observable<Dish[]>{
    return this.http.get<Dish[]>(baseURL + 'dishes').pipe(catchError(this.processHTTPMshService.handleError));      
  }

  getDish(id: string): Observable<Dish>{
    return this.http.get<Dish>(baseURL + 'dishes/' + id).pipe(catchError(this.processHTTPMshService.handleError));  
  }

  getFeaturedDish(): Observable<Dish>{
    return this.http.get<Dish[]>(baseURL + 'dishes?featured=true').pipe(map(dishes => dishes[0])).pipe(catchError(this.processHTTPMshService.handleError));  
  }

  getDishIds(): Observable<string[] | any>{
    return this.getDishes().pipe(map(dishes => dishes.map(dish => dish.id))).pipe(catchError(error => error));
  }
}
