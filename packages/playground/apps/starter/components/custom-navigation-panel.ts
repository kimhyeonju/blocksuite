import { registerTOCComponents } from '@blocksuite/blocks';
import type { EditorContainer } from '@blocksuite/editor';
import { WithDisposable } from '@blocksuite/lit';
import type { Page } from '@blocksuite/store';
import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('custom-navigation-panel')
export class CustomNavigationPanel extends WithDisposable(LitElement) {
  static override styles = css`
    .custom-navigation-container {
      position: absolute;
      top: 0;
      right: 0;
      border: 1px solid var(--affine-border-color, #e3e2e4);
      background: var(--affine-background-overlay-panel-color);
      height: 100vh;
      width: 289px;
      box-sizing: border-box;
      overflow-y: scroll;
      overflow-x: visible;
      z-index: 1;
    }
  `;
  @state()
  private _show = false;

  @property({ attribute: false })
  page!: Page;

  @property({ attribute: false })
  editor!: EditorContainer;

  private _renderPanel() {
    return html`<edgeless-toc-notes-panel
      .page=${this.page}
      .fitPadding=${[50, 300, 50, 50]}
    ></edgeless-toc-notes-panel>`;
  }

  public toggleDisplay() {
    this._show = !this._show;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this.page = this.editor.page;

    registerTOCComponents(components => {
      Object.entries(components).forEach(([name, component]) => {
        customElements.define(name, component);
      });
    });
  }

  override render() {
    return html`
      ${this._show
        ? html`
            <div class="custom-navigation-container">
              ${this._renderPanel()}
            </div>
          `
        : null}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'custom-navigation-panel': CustomNavigationPanel;
  }
}
