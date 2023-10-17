import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { FormItem } from 'packages/form/src/types';

@customElement('ty-input')
export class TyInput<T> extends LitElement {

  static styles = css`
    input {
      border-radius: 5px;

      &.invalid {
        border-width: 0.1em;
        border-style: solid;
        border-color: #ff4b4b
      }
    }
  `
  
  @property({ type: Object })
  item!: FormItem<T>;

  render() {
      return html`
        <input type="text" .value=${this.item.value as string} @input=${this._inputListener}>
      `
  }

  private _inputListener(e: InputEvent) {
    this.item.value = (e.target as HTMLInputElement).value as T;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ty-input": TyInput<unknown>
  }
}