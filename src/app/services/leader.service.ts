import { Injectable } from '@angular/core';
import { Leader } from '../shared/leader';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

// import { LEADERS } from '../shared/leaders';
import { baseURL } from '../shared/baseurl';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  constructor(private http: HttpClient) { }

  getLeaders(): Observable<Leader[]>{
    return this.http.get<Leader[]>(baseURL + 'leadership');    
  }

  getLeader(id: string): Observable<Leader>{
    return this.http.get<Leader>(baseURL + 'leadership/' + id);    
  }

  getFeaturedLeader(): Observable<Leader>{
    return this.http.get<Leader>(baseURL + 'leadership?featured=true').pipe(map(leaders => leaders[0]));    
  }
}
