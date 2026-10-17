import { Car, Coffee, CupSoda, Droplets, Fan, Layers, Luggage, Shirt, Sofa, Trees, Wifi, Sparkles } from 'lucide-react'

// Map from the `icon` names used in src/data/property.js to line icons.
const icons = {
  trees: Trees,
  sofa: Sofa,
  fan: Fan,
  towels: Layers,
  wifi: Wifi,
  coffee: Coffee,
  droplets: Droplets,
  car: Car,
  luggage: Luggage,
  shirt: Shirt,
  glass: CupSoda,
}

export function Icon({ name, ...props }) {
  const Component = icons[name] ?? Sparkles
  return <Component aria-hidden="true" strokeWidth={1.25} {...props} />
}
