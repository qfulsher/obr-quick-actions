import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { DrollService } from '../../utils/droll.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import OBR from '@owlbear-rodeo/sdk';

const ID = "com.obr-quick-actions";

@Component({
  selector: 'app-main-popover',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './main-popover.component.html',
  styleUrl: './main-popover.component.scss'
})
export class MainPopoverComponent implements OnInit, OnDestroy {
  newActionForm: FormGroup;
  nameInvalid = signal<boolean|null>(null);
  toHitInvalid = signal<boolean|null>(null);
  damageInvalid = signal<boolean|null>(null);

  rollNotificationId: string|undefined;

  actions: Action[] = [{
    name: 'Attack',
    toHit: '1d20',
    damage: '1d6'
  }];

  subscriptions: Subscription[] = [];
  
  constructor(private drollService: DrollService) {
    this.newActionForm = new FormGroup({
      name: new FormControl<string|null>(null, [Validators.required]),
      toHit: new FormControl<string|null>(null, [Validators.required, this.diceFormulaValidator()]),
      damage: new FormControl<string|null>(null, [Validators.required, this.diceFormulaValidator()]),
    });
  }

  ngOnInit() {
    this.subscriptions.push(this.newActionForm.statusChanges.subscribe(() => {
        this.nameInvalid.set(this.newActionForm.get('name')?.invalid ?? null);
        this.toHitInvalid.set(this.newActionForm.get('toHit')?.invalid ?? null);
        this.damageInvalid.set(this.newActionForm.get('damage')?.invalid ?? null);
    }));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private diceFormulaValidator(): ValidatorFn {
    return (control: AbstractControl<string>): ValidationErrors | null => 
      control.value && this.drollService.validate(control.value) ? null : {
        invalidFormula: {value: control.value}
      };
  }

  async roll(formula: string): Promise<void> {    
    const result = this.drollService.roll(formula);
    console.dir(result);

    await this.dismissNotification();
    
    this.rollNotificationId = await OBR.notification.show(`Result: ${result}`);
    
    setTimeout(() => this.dismissNotification(), 10_000);
  }

  async dismissNotification() {
    if (!this.rollNotificationId) {
      return;
    }

    try {
      await OBR.notification.close(this.rollNotificationId);
    } finally {
      this.rollNotificationId = undefined;
    }
  }

  makeNewAction() {
    if (this.newActionForm.invalid) {
      return;
    }

    const toHitFormula = this.newActionForm.controls['toHit'].value;
    const damageFormula = this.newActionForm.controls['damage'].value;

    if(!this.drollService.validate(toHitFormula) || !this.drollService.validate(damageFormula)) {
      console.log('invalid');
      return;
    }

    console.dir(this.drollService.parse(toHitFormula));
    console.dir(this.drollService.parse(damageFormula));

    this.actions.push(this.newActionForm.value);
    this.newActionForm.reset();
  }

  deleteAction(action: Action) {
    this.actions = this.actions.filter(a => a !== action);
  }
}

export interface Action {
  name: string;
  toHit: string;
  damage: string;
}