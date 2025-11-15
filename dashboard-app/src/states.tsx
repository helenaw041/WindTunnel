import type { ListenerData } from "@shared/index";
import { createState } from "state-pool";

const recentDataState = createState<ListenerData>({data: {}})

export { recentDataState }
