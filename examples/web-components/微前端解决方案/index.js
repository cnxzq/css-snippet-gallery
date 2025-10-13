const template = document.createElement("template");

class Button extends HTMLElement {
  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    this.$button = this._shadowRoot.querySelector("button");

    this.$button.addEventListener("click", () => {
      console.log("do something");
    });
  }

  get label() {
    console.log('5 button--get');
    return this.getAttribute("label");
  }

  set label(value) {
    console.log("2 button--set");
    this.setAttribute("label", value);
  }

  static get observedAttributes() {
    console.log("1 button--static--get");
    return ["label"];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    console.log("3 button--attributeChangedCallback");
    this.render();
  }

  render() {
    console.log("4 button--render");
    this.$button.innerHTML = this.label;
  }
}

window.customElements.define("my-button", Button);
