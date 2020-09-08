export function registerComponent (component, componentName) {
  let name = componentName || component.name
  if (!name) {
    throw new Error('not found name of component')
  }
  if (this.components) {
    this.components[name] = component
  } else {
    this.components = {
      [name]: component
    }
  }
}
