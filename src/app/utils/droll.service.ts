import { Injectable } from '@angular/core';
import * as droll from 'droll';

@Injectable({
  providedIn: 'root'
})
export class DrollService {
  constructor() { }

  validate(formula: string): boolean {
    return droll.validate(formula) as boolean;
  }

  parse(formula: string): DrollFormula {
    return droll.parse(formula) as DrollFormula;
  }

  roll(formula: string): DrollResult {
    return droll.roll(formula) as DrollResult;
  }
}

export interface DrollFormula {
  numDice: number;
  numSides: number;
  modifier: number;
  minResult: number;
  maxResult: number;
  avgResult: number;
}

export interface DrollResult {
  /**
   * The results of each dice roll
   */
  rolls: number[];
  /**
   * The optional modifier. Default is zero.
   */
  modifier: number;
  /**
   * The sum of the rolls plus the modifier
   */
  total: number;
  toString(): string;
}