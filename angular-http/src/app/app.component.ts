import { Component, OnInit } from '@angular/core';
import { Post } from './post.model';
import { PostService } from './post.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];
  isFetching = false;
  error: string = null;

  constructor(private postService: PostService) {
  }

  ngOnInit() {
    this.onFetchPosts()
  }

  onCreatePost(postData: Post) {
    this.postService.createAndStorePost(postData.title, postData.content)
      .subscribe(responseData => {
        console.log(responseData.headers)
        this.onFetchPosts();
      });

  }

  onFetchPosts() {
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(posts => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.error = error.message;
    });
  }

  onClearPosts() {
    this.postService.clearPosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }
}
