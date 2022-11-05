import {router} from "../trpc";
import {authRouter} from "./auth";
import {studyDateRouter} from "./studyDate";

export const appRouter = router({
  studyDate: studyDateRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
