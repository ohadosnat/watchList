/**
 * Util function to create an HTML Element
 * @param {"svg" | "path" | keyof HTMLElementTagNameMap} tag
 * @param {any} props
 * @param  {any[]} children
 * @returns {HTMLElement} HTML Element based on the given data.
 */
function createElement(tag, props, ...children) {
  let element;
  if (tag === "path" || tag === "svg") {
    element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  } else {
    element = document.createElement(tag);
  }

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith("on") && typeof value === "function") {
        element.addEventListener(key.substring(2), value);
      } else element.setAttribute(key, value);
    });
  }

  children.forEach((child) => {
    if (Array.isArray(child)) return element.append(...child);

    if (typeof child === "string" || typeof child === "number") {
      child = document.createTextNode(child);
    }

    if (child instanceof Node) element.appendChild(child);
  });

  return element;
}

export default createElement;
