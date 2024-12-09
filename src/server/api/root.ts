import { customerRouter } from "@/server/api/routers/customer";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { productRouter } from "./routers/product";
import { sectionRouter } from "./routers/section";
import { categoryRouter } from "./routers/category";
import { orderRouter } from "./routers/order";
import { tableRouter } from "./routers/table";
import { reservationRouter } from "./routers/reservation";
import { waitlistRouter } from "./routers/waitlist";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  customer: customerRouter,
  user: userRouter,
  product: productRouter,
  section: sectionRouter,
  category: categoryRouter,
  order: orderRouter,
  table: tableRouter,
  reservation: reservationRouter,
  waitlist: waitlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
