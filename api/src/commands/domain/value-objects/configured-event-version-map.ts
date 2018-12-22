import deepFreeze from "deep-freeze";

export interface ConfiguredEventVersionMapInterface {
  source: string;
  target: string;
}

export class ConfiguredEventVersionMap
  implements ConfiguredEventVersionMapInterface {
  public source: string;
  public target: string;

  constructor({ source, target }: ConfiguredEventVersionMapInterface) {
    // TODO: security scrub source and target
    this.source = source;
    this.target = target;
    deepFreeze(this);
  }
}
