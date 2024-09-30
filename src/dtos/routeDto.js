export class routeDto{
   constructor(
      {day, places,foods}
   ) {
      this.day = day;
      this.places= places;
      this.foods=foods;
   }
}

export class placeDto{
   constructor({
      name,
      hours,
      tips
               }){
      this.name=name;
      this.hours=hours;
      this.tips=tips;
   }
}