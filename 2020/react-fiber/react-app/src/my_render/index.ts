import Reconciler, { HostConfig } from 'react-reconciler';
import { ReactElement } from 'react';

type MyHostConfig = HostConfig<string, Record<string, any>, HTMLElement, HTMLElement, Text, any, any, any, any, any, number, number>;

const rootHostContext = {};
const childHostContext = {};

const hostConfig: MyHostConfig = {
  now: Date.now,
  getRootHostContext: () => {
    return rootHostContext;
  },
  prepareForCommit: () => { },
  resetAfterCommit: () => { },
  getChildHostContext: () => {
    return childHostContext;
  },
  shouldSetTextContent: (type, props) => {
    return typeof props.children === 'string' || typeof props.children === 'number';
  },
  /**
   This is where react-reconciler wants to create an instance of UI element in terms of the target. Since our target here is the DOM, we will create document.createElement and type is the argument that contains the type string like div or img or h1 etc. The initial values of domElement attributes can be set in this function from the newProps argument
   */
  createInstance: (type, newProps, rootContainerInstance, _currentHostContext, workInProgress) => {
    const domElement = document.createElement(type);
    Object.keys(newProps).forEach(propName => {
      const propValue = newProps[propName];
      if (propName === 'children') {
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          domElement.textContent = String(propValue);
        }
      } else if (propName === 'onClick') {
        domElement.addEventListener('click', propValue);
      } else if (propName === 'className') {
        domElement.setAttribute('class', propValue);
      } else {
        const propValue = newProps[propName];
        domElement.setAttribute(propName, propValue);
      }
    });
    return domElement;
  },
  createTextInstance: text => {
    return document.createTextNode(text);
  },
  appendInitialChild: (parent, child) => {
    parent.appendChild(child);
  },
  appendChild(parent, child) {
    parent.appendChild(child);
  },
  finalizeInitialChildren: (domElement, type, props) => {
    return true;
  },
  supportsMutation: true,
  appendChildToContainer: (parent, child) => {
    parent.appendChild(child);
  },
  prepareUpdate(domElement, oldProps, newProps) {
    return true;
  },
  commitUpdate(domElement, updatePayload, type, oldProps, newProps) {
    Object.keys(newProps).forEach(propName => {
      const propValue = newProps[propName];
      if (propName === 'children') {
        if (typeof propValue === 'string' || typeof propValue === 'number') {
          domElement.textContent = String(propValue);
        }
      } else {
        const propValue = newProps[propName];
        domElement.setAttribute(propName, propValue);
      }
    });
  },
  commitMount() {

  },
  commitTextUpdate(textInstance, oldText, newText) {
    textInstance.textContent = newText;
  },
  removeChild(parentInstance, child) {
    parentInstance.removeChild(child);
  },
  removeChildFromContainer() {

  },
  getPublicInstance() {
    return;
  },
  shouldDeprioritizeSubtree(type, props) {
    return true;
  },
  scheduleDeferredCallback() {

  },
  cancelDeferredCallback() {

  },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,

  noTimeout: -1,
  isPrimaryRenderer: true,
  supportsPersistence: false,
  supportsHydration: false,
};

const ReactReconcilerInst = Reconciler(hostConfig);

const render = (reactElement: ReactElement, domElement: HTMLElement, callback: () => void = () => {}) => {
  // Create a root Container if it doesnt exist
  if (!(domElement as any)._rootContainer) {
    (domElement as any)._rootContainer = ReactReconcilerInst.createContainer(domElement, false, false);
  }

  // update the root Container
  return ReactReconcilerInst.updateContainer(reactElement, (domElement as any)._rootContainer, null, callback);
}

export { render };
