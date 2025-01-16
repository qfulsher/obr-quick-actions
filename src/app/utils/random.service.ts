import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomService {
  constructor() { }

  getRandomNumber(max: number): number {
    return this.getRandomInt(max);
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
