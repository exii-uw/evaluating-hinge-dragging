const nBlocks = 3;
const blockLabels = new Array(nBlocks)
  .fill(0)
  .map((_, idx) => `${idx + 1}/${nBlocks}`);

// Random orders for 20 participants, pre-computed
const prototype_order = [
  ["flat", "24mm", "1mm", "x1fold", "6mm", "12mm"],
  ["flat", "12mm", "x1fold", "24mm", "1mm", "6mm"],
  ["flat", "6mm", "24mm", "1mm", "12mm", "x1fold"],
  ["flat", "1mm", "12mm", "6mm", "x1fold", "24mm"],
  ["flat", "x1fold", "6mm", "12mm", "24mm", "1mm"],
  ["flat", "6mm", "1mm", "24mm", "x1fold", "12mm"],
  ["flat", "12mm", "x1fold", "6mm", "1mm", "24mm"],
  ["flat", "x1fold", "6mm", "12mm", "24mm", "1mm"],
  ["flat", "24mm", "12mm", "1mm", "6mm", "x1fold"],
  ["flat", "1mm", "24mm", "x1fold", "12mm", "6mm"],
  ["flat", "6mm", "24mm", "1mm", "x1fold", "12mm"],
  ["flat", "12mm", "6mm", "x1fold", "1mm", "24mm"],
  ["flat", "x1fold", "1mm", "24mm", "12mm", "6mm"],
  ["flat", "1mm", "12mm", "6mm", "24mm", "x1fold"],
  ["flat", "24mm", "x1fold", "12mm", "6mm", "1mm"],
  ["flat", "12mm", "1mm", "x1fold", "6mm", "24mm"],
  ["flat", "1mm", "24mm", "6mm", "x1fold", "12mm"],
  ["flat", "6mm", "12mm", "24mm", "1mm", "x1fold"],
  ["flat", "x1fold", "6mm", "12mm", "24mm", "1mm"],
  ["flat", "24mm", "x1fold", "1mm", "12mm", "6mm"],
  ["flat", "24mm", "x1fold", "1mm", "6mm", "12mm"],
  ["flat", "6mm", "24mm", "12mm", "1mm", "x1fold"],
  ["flat", "12mm", "6mm", "x1fold", "24mm", "1mm"],
  ["flat", "1mm", "12mm", "24mm", "x1fold", "6mm"],
  ["flat", "x1fold", "1mm", "6mm", "12mm", "24mm"],
  ["flat", "x1fold", "24mm", "1mm", "12mm", "6mm"],
  ["flat", "12mm", "1mm", "x1fold", "6mm", "24mm"],
  ["flat", "6mm", "12mm", "24mm", "1mm", "x1fold"],
  ["flat", "24mm", "6mm", "12mm", "x1fold", "1mm"],
  ["flat", "1mm", "x1fold", "6mm", "24mm", "12mm"],
  ["flat", "x1fold", "12mm", "6mm", "1mm", "24mm"],
  ["flat", "6mm", "24mm", "1mm", "x1fold", "12mm"],
  ["flat", "1mm", "x1fold", "12mm", "24mm", "6mm"],
  ["flat", "24mm", "6mm", "x1fold", "12mm", "1mm"],
  ["flat", "12mm", "1mm", "24mm", "6mm", "x1fold"],
  ["flat", "6mm", "1mm", "12mm", "x1fold", "24mm"],
  ["flat", "24mm", "x1fold", "6mm", "1mm", "12mm"],
  ["flat", "12mm", "24mm", "1mm", "6mm", "x1fold"],
  ["flat", "1mm", "12mm", "x1fold", "24mm", "6mm"],
  ["flat", "x1fold", "6mm", "24mm", "12mm", "1mm"],
];

const conditions_order = [
  ["pen", "touch"],
  ["touch", "pen"],
];

export interface Block {
  index: number;
  id: string;
  configuration: string; // unique combo of input type and prototype
  condition: string;
  prototype: string;
  title: string;
  description: string;
  disableNext: boolean;
}

export interface BlockSequence {
  isX1Fold: boolean;
  configuration: string;
  blocks: Block[];
}

export const configurationsFor = (participantIdx: number) =>
  prototype_order[participantIdx % prototype_order.length].flatMap(
    (prototype) =>
      conditions_order[participantIdx % conditions_order.length].map(
        (condition) => ({
          id: `${prototype}-${condition}`,
          condition,
          prototype,
        })
      )
  );

const nFlatBlocks = 2;
const getFlatBlocks = (condition: string, confIdx: number): Block[] => [
  {
    index: confIdx,
    id: `flat-${condition}-0`,
    configuration: `flat-${condition}`,
    condition,
    prototype: "flat",
    title: `flat / ${condition} (1/1)`,
    description: `Drag with ${condition} input on a flat prototype (1/1)`,
    disableNext: true,
  },
];

export const blockSequenceFor = (participantIdx: number): BlockSequence[] =>
  configurationsFor(participantIdx).map((conf, confIdx) => ({
    isX1Fold: conf.prototype === "x1fold",
    configuration: conf.id,
    blocks:
      conf.prototype === "flat"
        ? getFlatBlocks(conf.condition, confIdx)
        : blockLabels.map((label, idx) => ({
            ...conf,
            index: (confIdx - 2) * blockLabels.length + idx + nFlatBlocks, // only have 1 flat block
            disableNext: idx === 0, // Facilitator must press Next at start of each blocksequence
            id: `${conf.prototype}-${conf.condition}-${idx}`,
            configuration: conf.id,
            title: `${conf.prototype} / ${conf.condition} (${label})`,
            description: `Drag with ${conf.condition} input on a prototype with a ${conf.prototype} curve (${label})`,
          })),
  }));
