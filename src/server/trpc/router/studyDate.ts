import {z} from "zod";
import {StudyDate} from "@prisma/client"
import {router, publicProcedure, protectedProcedure} from "../trpc";


export const studyDateRouter = router({
    getAll: publicProcedure.query(({ctx}) => {
        return ctx.prisma.studentStudyDate.findMany({
            include: {
                user: true
            },
            orderBy: {
                date: 'asc',
            },
        });
    }),
    selectDay: protectedProcedure
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
                return ctx.prisma.studentStudyDate.findMany({
                    include: {
                        user: true
                    },
                    orderBy: {
                        date: 'asc',
                    },
                });
            }
        )
});
