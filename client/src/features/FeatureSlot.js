// features/FeatureSlot.js
// A spot on a page where features can show up. Renders nothing if no
// active feature fills this slot, so archiving a feature never breaks the page.
// Any other props are passed through to the feature, so a page can share
// settings with it or hear back from it (for example onEnter).
import { getSlotComponents } from "./registry";

export default function FeatureSlot({ name, ...props }) {
  return getSlotComponents(name).map(({ name: featureName, Component }) => (
    <Component key={featureName} {...props} />
  ));
}
