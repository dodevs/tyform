import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { FormItem } from 'tyform/types';

@customElement('ty-error')
export class TyError<T = unknown> extends LitElement {

  static styles = css`
    small {
        color: #ff4b4b;
    }
  `
  
  @property({ type: Object})
  item!: FormItem<T>;

  @state()
  private errors!: string;

  render() {
      this.item.subscribe(item => {
        this.errors = item.error.join(', ');
      })

      return html`
        <small>${this.errors}</small>
      `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ty-error": TyError
  }
}