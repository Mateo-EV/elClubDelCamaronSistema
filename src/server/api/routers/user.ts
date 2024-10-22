import { userCreateSchema } from "@/validators/user";
import { adminProcedure, createTRPCRouter } from "../trpc";
import { hash } from "@/lib/argon";

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

  create: adminProcedure
    .input(userCreateSchema)
    .mutation(async ({ ctx, input: userCreateData }) => {
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
});
