import { Component, OnInit, Inject } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

 
  dish: Dish;
  promotion: Promotion;
  leader: Leader;
  dishErrorMess: string;
  leaderErrorMess: string;
  promotionErrorMess: string;

  constructor(private dishService: DishService, 
    private promotionService: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    // this.dishes = this.dishService.getDishes();
    // this.promotions = this.promotionService.getPromotions();
    this.dishService.getFeaturedDish().subscribe((dish) => this.dish = dish, disherrmess => this.dishErrorMess = <any>disherrmess);
    this.promotionService.getFeaturedPromotion().subscribe((promo) => this.promotion = promo, promotionerrmess => this.promotionErrorMess = <any>promotionerrmess);
    this.leaderService.getFeaturedLeader().subscribe((leader) => this.leader = leader, leadererrmess => this.leaderErrorMess = <any>leadererrmess);
  }

}
