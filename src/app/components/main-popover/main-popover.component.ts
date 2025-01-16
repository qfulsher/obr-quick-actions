import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RandomService } from '../../utils/random.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

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

  actions: Action[] = [];

  subscriptions: Subscription[] = [];
  
  constructor(private randomService: RandomService) {
    this.newActionForm = new FormGroup({
      name: new FormControl<string|null>(null, [Validators.required]),
      // TODO: Dice format validation
      toHit: new FormControl<string|null>(null, [Validators.required]),
      damage: new FormControl<string|null>(null, [Validators.required]),
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

  makeNewAction() {
    if (this.newActionForm.invalid) {
      return;
    }

    this.actions.push(this.newActionForm.value);
    this.newActionForm.reset();
  }
}

export interface Action {
  name: string;
  toHit: string;
  damage: string;
}
