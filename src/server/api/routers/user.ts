import { hash } from "@/lib/argon";
import { userCreateSchema, userEditSchemaServer } from "@/validators/user";
import { TRPCError } from "@trpc/server";
import {
  adminOrHostProcedure,
  adminProcedure,
  createTRPCRouter,
} from "../trpc";
import { z } from "zod";
import { UserRole } from "@prisma/client";

export const userRouter = createTRPCRouter({
  getAll: adminProcedure.query(async ({ ctx }) =>
    ctx.db.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        address: true,
        email: true,
        phone: true,
        dni: true,
        role: true,
        createdAt: true,
      },
    }),
  ),
  getWaiters: adminOrHostProcedure.query(async ({ ctx }) =>
    ctx.db.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        address: true,
        email: true,
        phone: true,
        dni: true,
        role: true,
        createdAt: true,
        activeOrdersCount: true,
      },
      where: { role: UserRole.WAITER },
    }),
  ),
  create: adminProcedure
    .input(userCreateSchema)
    .mutation(async ({ ctx, input: userCreateData }) => {
      const existsEmail = await ctx.db.user.findUnique({
        where: { email: userCreateData.email },
      });

      if (existsEmail)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El email del usuario ya existe",
        });

      const existsDni = await ctx.db.user.findUnique({
        where: { dni: userCreateData.dni },
      });

      if (existsDni)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El dni del usuario ya existe",
        });

      const hashedPassword = await hash(userCreateData.password);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userCreated } = await ctx.db.user.create({
        data: {
          firstName: userCreateData.firstName,
          lastName: userCreateData.lastName,
          dni: userCreateData.dni,
          email: userCreateData.email,
          password: hashedPassword,
          phone: userCreateData.phone,
          role: userCreateData.role,
          address: userCreateData.address,
        },
      });

      return userCreated;
    }),
  edit: adminProcedure
    .input(userEditSchemaServer)
    .mutation(async ({ ctx, input: { userId, ...user } }) => {
      const existsEmail = await ctx.db.user.findUnique({
        where: { email: user.email, NOT: { id: userId } },
      });

      if (existsEmail)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El email del usuario ya existe",
        });

      const existsDni = await ctx.db.user.findUnique({
        where: { dni: user.dni, NOT: { id: userId } },
      });

      if (existsDni)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El dni del usuario ya existe",
        });

      if (user.password.length > 8) {
        user.password = await hash(user.password);
      } else {
        user.password = undefined!;
        user.confirmedPassword = undefined!;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userEdited } = await ctx.db.user.update({
        data: user,
        where: { id: userId },
      });

      return userEdited;
    }),
  delete: adminProcedure
    .input(z.number())
    .mutation(({ ctx, input: userId }) =>
      ctx.db.user.delete({ where: { id: userId } }),
    ),
});
