// features/registry.js
// Collects every feature folder inside src/features automatically.
// A feature is any folder here with an index.js that default-exports:
//   { name: "...", slots: { "slot-name": Component, ... } }
// Drag a feature folder into src/archive to turn it off; drag it back to turn it on.
const context = require.context("./", true, /^\.\/[^/]+\/index\.js$/);

const features = context.keys().map((key) => context(key).default).filter(Boolean);

export function getSlotComponents(slotName) {
  return features
    .filter((feature) => feature.slots && feature.slots[slotName])
    .map((feature) => ({ name: feature.name, Component: feature.slots[slotName] }));
}

export default features;
