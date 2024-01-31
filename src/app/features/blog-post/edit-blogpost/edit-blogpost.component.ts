import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BlogPostService } from '../services/blog-post.service';
import { BlogPost } from '../models/blog-post.model';
import { CategoryService } from '../../category/services/category.service';
import { Category } from '../../category/models/category.model';
import { UpdateBlogPost } from '../models/update-blog-post.model';
import { ImageService } from 'src/app/shared/components/image-selector/image.service';

@Component({
  selector: 'app-edit-blogpost',
  templateUrl: './edit-blogpost.component.html',
  styleUrls: ['./edit-blogpost.component.css']
})
export class EditBlogpostComponent implements OnInit, OnDestroy {
  
  id:string |null = null;
  model?:BlogPost;
  isImageSelectorVisible:boolean = false;


  routeSubscription?:Subscription;
  getBlogPostSubscription?:Subscription;
  updateBlogPostSubscrition?:Subscription;
  categories$?:Observable<Category[]>;
  selectedCategories?:string[];
  deleteBlogPostSubscription?:Subscription;
  imageSelectSubscription?:Subscription;

  constructor(private route: ActivatedRoute, private blogPostService: BlogPostService, private categoryService:CategoryService, private router:Router, private imageService:ImageService){

  }
  
  ngOnInit(): void {

    this.categories$ = this.categoryService.getAllCategories();

    this.routeSubscription =  this.route.paramMap.subscribe({
        next : (params) => {
          this.id = params.get('id');

          // Get blog post from API
          if(this.id){
            this.getBlogPostSubscription = this.blogPostService.getBlogPostById(this.id).subscribe(
              {
                next: (response) => {
                  this.model = response;
                  this.selectedCategories = response.categories.map(x=>x.id)
                }
              }
            );
          }
          this.imageSelectSubscription = this.imageService.onSelectImage()
          .subscribe({
            next: (response => {
              if(this.model){
                this.model.featuredImageUrl = response.url;
                this.isImageSelectorVisible = false;
              }
            })
          })
        }
      });
  }

  onFormSubmit()
  {
    //convert this model to the request model
    if(this.model && this.id)
    {
      var updateBlogPost:UpdateBlogPost = {
        author: this.model.author,
        content:this.model.content,
        shortDescription :this.model.shortDescription,
        featuredImageUrl:this.model.featuredImageUrl,
        isVisible:this.model.isVisible,
        publishedDate:this.model.publishedDate,
        title:this.model.title,
        urlHandle:this.model.urlHandle,
        categories:this.selectedCategories?? []
      }

      this.updateBlogPostSubscrition = this.blogPostService.updateBlogPost(this.id, updateBlogPost).subscribe(
        {
          next: (response) => {
            this.router.navigateByUrl('/admin/blogposts');
          }
        }
      );
    }
  }

  onDelete(): void {
    if (this.id) {
      // Display a confirmation dialog
      const isConfirmed = window.confirm('Are you sure you want to delete this blog post?');
  
      // Check if the user confirmed the deletion
      if (isConfirmed) {
        this.deleteBlogPostSubscription = this.blogPostService.deleteBlogPost(this.id)
          .subscribe({
            next: (response) => {
              this.router.navigateByUrl('admin/blogposts');
            }
          });
      }
    }
  }
  
  openImageSelector():void{
    this.isImageSelectorVisible = true;
  }

  closeImageSelector():void{
    this.isImageSelectorVisible = false;
  }
  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.getBlogPostSubscription?.unsubscribe();
    this.updateBlogPostSubscrition?.unsubscribe();
    this.deleteBlogPostSubscription?.unsubscribe();
    this.imageSelectSubscription?.unsubscribe();
  }

}
