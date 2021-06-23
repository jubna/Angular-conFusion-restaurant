import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
 
  dish: Dish;
  errMess:string;
  dishIds: string[];
  prev: string;
  next: string;
  //newcomment: Comment
  date:string;
  comment: Comment
  dishcopy:Dish;

  @ViewChild('cform') CommentFormDirective;
 
CommentForm: FormGroup;
 
  

  
  constructor( private route:ActivatedRoute, private dishService:DishService,
    private location:Location , private fb:FormBuilder ,@Inject('BaseURL') private BaseURL ) { 
      this.createForm()
    }


    formErrors = {
      'author': '',
      'comment': ''
    };
  
    validationMessages = {
      'author': {
        'required':      'Name is required.',
        'minlength':     'Name must be at least 2 characters long.',
      },
      
      'comment': {
        'required':      'Comment is required.'
      }
    };

    createForm(){
      this.CommentForm=this.fb.group({
      author:['',[Validators.required,Validators.minLength(2)]],
      rating:'',
      comment:['',Validators.required]});
  
      this.CommentForm.valueChanges
      .subscribe(data=>{
        this.onValueChanged(data)});
  
        this.onValueChanged();  // (re)set validation messages now
    }

    onValueChanged(data?:any){
      if(!this.CommentForm){return;}
      const form=this.CommentForm;
      for(const field in this.formErrors){
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }

    onSubmit() {
   

    this.comment = this.CommentForm.value;
    this.comment.date = new Date().toISOString();
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy)
    .subscribe(dish=>{this.dish=dish;this.dishcopy=dish;},
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; })
    this.CommentFormDirective.resetForm();
    this.CommentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });
    }

  ngOnInit(): void {

  /*   let id=this.route.snapshot.params['id'];
    this.dishService.getDish(id)
    .subscribe(dish=>this.dish=dish) */
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish;this.dishcopy=dish; this.setPrevNext(dish.id); (errmess)=>this.errMess=<any>errmess });
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  goBack(): void{
    this.location.back();
  }
  
}
