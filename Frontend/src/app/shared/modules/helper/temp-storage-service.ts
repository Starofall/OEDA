import { Injectable } from '@angular/core';

// https://stackoverflow.com/questions/34088209/how-to-pass-object-from-one-component-to-another-in-angular-2
@Injectable()
export class TempStorageService {

  private new_value: any | boolean = false;

  constructor() {
  }

  public getNewValue(): any | boolean {
    return this.new_value;
  }

  public setNewValue(new_value: any): void {
    this.new_value = new_value;
  }

  public clearNewValue(): void {
    this.new_value = false;
  }
}
