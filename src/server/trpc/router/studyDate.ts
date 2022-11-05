import {z} from "zod";
import {StudyDate} from "@prisma/client"
import {router, publicProcedure, protectedProcedure} from "../trpc";

const getAllStudyDates = async (ctx: any) => {
    return ctx.prisma.studentStudyDate.findMany({
        include: {
            user: true
        },
        orderBy: {
            date: 'asc',
        },
    });
}

export const studyDateRouter = router({
    hello: publicProcedure
        .input(z.object({text: z.string().nullish()}).nullish())
        .query(({input}) => {
            return {
                greeting: `Hello ${input?.text ?? "world"}`,
            };
        }),
    getAll: publicProcedure.query(({ctx}) => {
        return getAllStudyDates(ctx)
    }),

    selectDay: protectedProcedure
        // using zod schema to validate and infer input values
        .input(
            z.object({
                dateEnum: z.string(),
            })
        )
        .mutation(async ({ctx, input}) => {
                let date = undefined
                if (StudyDate.SUNDAY === input.dateEnum) {
                    date = StudyDate.SUNDAY;
                } else {
                    date = StudyDate.SATURDAY;
                }
                const userId = ctx.session.user.id;

                await ctx.prisma.studentStudyDate.upsert({
                    where: {
                        userId: userId
                    },
                    update: {
                        userId: userId,
                        date: date,
                    },
                    create: {
                        userId: userId,
                        date: date
                    },
                });
                return getAllStudyDates(ctx)
            }
        )
});
