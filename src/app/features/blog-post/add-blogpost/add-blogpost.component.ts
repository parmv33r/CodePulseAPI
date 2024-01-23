import { Component, OnDestroy, OnInit } from '@angular/core';
import { AddBlogPost } from '../models/add-blog-post.model';
import { BlogPostService } from '../services/blog-post.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';

@Component({
  selector: 'app-add-blogpost',
  templateUrl: './add-blogpost.component.html',
  styleUrls: ['./add-blogpost.component.css']
})

export class AddBlogpostComponent implements OnDestroy, OnInit {
  model: AddBlogPost;
  categories$?:Observable<Category[]>;

  private addBlogPostSubscription?: Subscription;
  constructor(private blogPostService : BlogPostService, private router : Router, private categoryService:CategoryService){
    this.model = {
      title:'',
      shortDescription:'',
      content:'',
      featuredImageUrl:'',
      urlHandle:'',
      author:'',
      publishedDate: new Date(),
      isVisible: true,
      categories:[]
    };
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAllCategories();
  }
  

  onFormSubmit():void{
    console.log(this.model);
    this.blogPostService.createBlogPost(this.model)
    .subscribe({
      next: (response) => {
        this.router.navigateByUrl('/admin/blogposts');
      }
    })
  }

  ngOnDestroy(): void {
    this.addBlogPostSubscription?.unsubscribe();
  }

}
