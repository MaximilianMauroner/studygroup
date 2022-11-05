import {z} from "zod";
import {StudyDate, ExerciseDate} from "@prisma/client"
import {router, publicProcedure, protectedProcedure} from "../trpc";


export const studyDateRouter = router({
    getAll: publicProcedure.query(({ctx}) => {
        return ctx.prisma.studentStudyDate.findMany({
            include: {
                user: true
            }
        });
    }),
    selectDay: protectedProcedure
        .input(
            z.object({
                dateEnum: z.string(),
            })
        )
        .mutation(async ({ctx, input}) => {
                let studyDate = undefined
                let exerciseDate = undefined;

                if (StudyDate.SATURDAY === input.dateEnum) {
                    studyDate = StudyDate.SATURDAY;
                } else if (StudyDate.SUNDAY === input.dateEnum) {
                    studyDate = StudyDate.SUNDAY;
                }

                if (ExerciseDate.MONDAY === input.dateEnum) {
                    exerciseDate = ExerciseDate.MONDAY;
                } else if (ExerciseDate.WEDNESDAY === input.dateEnum) {
                    exerciseDate = ExerciseDate.WEDNESDAY;
                }


                const userId = ctx.session.user.id;
                if (exerciseDate) {
                    await ctx.prisma.studentStudyDate.upsert({
                        where: {
                            userId: userId
                        },
                        update: {
                            userId: userId,
                            exerciseDate: exerciseDate,
                        },
                        create: {
                            userId: userId,
                            exerciseDate: exerciseDate
                        },
                    });
                } else if (studyDate) {
                    await ctx.prisma.studentStudyDate.upsert({
                        where: {
                            userId: userId
                        },
                        update: {
                            userId: userId,
                            date: studyDate,
                        },
                        create: {
                            userId: userId,
                            date: studyDate,
                            exerciseDate: ExerciseDate.NULL
                        },
                    });
                }
                return ctx.prisma.studentStudyDate.findMany({
                    include: {
                        user: true
                    },
                });
            }
        )
});
