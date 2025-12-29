import type { ListenerData } from "@shared/index";
import { createState } from "state-pool";

const recentDataState = createState<ListenerData>({data: {}})
const tunnelPowerState = createState<boolean>(false)

export { recentDataState, tunnelPowerState }
