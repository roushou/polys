import type { SportsMetadata } from "@dicedhq/gamma";
import { Gamma } from "@dicedhq/gamma";
import type { ListOptions } from "../../../commands/gamma/sports/list.js";

export async function run(options: ListOptions): Promise<void> {
  const gamma = new Gamma();

  let sports: SportsMetadata[] = [];

  if (options.sport) {
    const sport = await gamma.sport.listBySport(options.sport);
    sports = sport ? [sport] : [];
  } else if (options.tag) {
    sports = await gamma.sport.listByTag(options.tag);
  } else if (options.series) {
    sports = await gamma.sport.listBySeries(options.series);
  } else {
    sports = await gamma.sport.list();
  }

  console.log(JSON.stringify(sports, null, 2));
}
