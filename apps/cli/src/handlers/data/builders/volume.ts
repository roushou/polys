import { Data, type TimePeriod } from "@dicedhq/data";
import type { VolumeArgs } from "../../../commands/data/builders/volume.js";

export async function run(args: VolumeArgs): Promise<void> {
  const data = new Data();

  const volume = await data.builders.volume(args.timePeriod as TimePeriod);

  console.log(JSON.stringify(volume, null, 2));
}
