import { Data } from "@dicedhq/data";
import type { LiveVolumeArgs } from "../../commands/data/live-volume.js";

export async function run(args: LiveVolumeArgs): Promise<void> {
  const data = new Data();

  const liveVolume = await data.misc.getEventLiveVolume(args.eventId);

  console.log(JSON.stringify(liveVolume, null, 2));
}
