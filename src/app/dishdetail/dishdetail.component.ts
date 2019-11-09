import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dish } from '../shared/dish';
import { visibility, flyInOut, expand } from '../animations/app.animation';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    visibility(), flyInOut(), expand()
  ]
})
export class DishdetailComponent implements OnInit {
  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: 5,
      comment:  ['', [Validators.required, ]],
      date : ''
    });

    this.commentForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data?: any){
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
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
  }

  onSubmit(){
    // get date here and set to the current form value.
    var d = new Date();
    var now = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+ d.getDate();
    this.commentForm.value.date = now;
    console.log(this.commentForm.value);
    this.dishCopy.comments.push(this.commentForm.value);
    this.dishservice.putDish(this.dishCopy).subscribe(dish => {
      this.dish = dish; 
      this.dishCopy = dish
    }, errmess => {
      this.dish = null;
      this.dishCopy = null;
      this.errMess = <any>errmess;
    });
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment:  '',
      date : ''
    });
    this.commentFormDirective.resetForm();
  }

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages = {
    'author': {
      'required':      'Author Name is required.',
      'minlength':     'Author Name must be at least 2 characters long.',
      'maxlength':     'AuthorName cannot be more than 25 characters long.'
    },
    'comment': {
      'required':      'Comment is required.'
    }
  }

  dish : Dish;
  dishCopy : Dish;
  dishIds: string[];
  prev: string;
  next: string;
  input : boolean = false;
  errMess: string;

  @ViewChild('fform') commentFormDirective;
  commentForm: FormGroup;
  visibility = 'shown';
  

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    @Inject('BaseURL') private BaseURL,
    private fb: FormBuilder) {
      this.createForm();
     }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => {this.visibility = 'hidden'; return this.dishservice.getDish(params['id']); } ) )
    .subscribe(dish => { this.dish = dish; this.dishCopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
     errmess => this.errMess = <any>errmess);
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }

}
