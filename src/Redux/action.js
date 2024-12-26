// actions.js
import { createAction } from "@reduxjs/toolkit";

export const revertAll = createAction("REVERT_ALL");

export const revertMonitoringSlice = createAction("REVERT_MONITORING_SLICE"); // monitoring slice