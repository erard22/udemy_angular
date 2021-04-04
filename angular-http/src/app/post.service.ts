import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({providedIn: 'root'})
export class PostService {

  constructor(private http: HttpClient) {

  }

  createAndStorePost(title: string, content: string): Observable<any> {
    const postData: Post = {title: title, content: content};
    return this.http.post(
      'https://udemy-angular-erard22-default-rtdb.firebaseio.com/posts.json',
      postData,
      {
        // to get the full response as response
        observe: 'response'
      }
    );
  }

  fetchPosts(): Observable<Post[]> {
    return this.http
      .get<{ [key: string]: Post }>('https://udemy-angular-erard22-default-rtdb.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({'Custom-Header': 'Hello'}),
          params: new HttpParams().set('print', 'pretty')
        }
      )
      .pipe(
        map(responseData => {
          const postArray: Post[] = []
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              // the curly brackets and the points create a new object out of the current data
              postArray.push({...responseData[key], id: key})
            }
          }
          return postArray;
        }),
        catchError(err => throwError(new Error('Could not get Posts. Details: ' + err.message)))
      );
  }

  clearPosts(): Observable<any> {
    return this.http.delete(
      'https://udemy-angular-erard22-default-rtdb.firebaseio.com/posts.json',
      {
        observe: 'events',
        responseType: 'text'
      }
    ).pipe(
      tap(event => {
        console.log(event)
        if (event.type === HttpEventType.Sent){
          console.log('request sent');
        }
        if (event.type === HttpEventType.Response) {
          console.log('response arrived')
        }
      })
    );
  }
}
