import {type NextPage} from "next";
import Head from "next/head";
import {signIn, signOut, useSession} from "next-auth/react";
import {trpc} from "../utils/trpc";
import {LoadingComponent} from "../components/loading_component";
import {useState} from "react";

const Home: NextPage = () => {
        const [userData, setUserData] = useState<any>([])
        const [isLoadingMutation, setIsLoadingMutation] = useState(false);
        const {isLoading} = trpc.studyDate.getAll.useQuery(undefined, {
            onSuccess: (data) => {
                setUserData(data)
            }
        })
        return (
            <>
                <Head>
                    <title>Study Helper</title>
                    <meta name="description" content="Study Helper by Maximilian"/>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>
                <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
                    <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
                        Select your Day
                    </h1>

                    <div className="my-3 grid gap-4 pt-3 text-center grid-cols-2 lg:w-2/3 w-full">
                        <DayCard name={"Saturday"} description={"Saturday at 12:00"} dateEnum={"SATURDAY"}
                                 setData={setUserData} setLoading={setIsLoadingMutation}/>
                        <DayCard name={"Sunday"} description={"Sunday at 12:00"} dateEnum={"SUNDAY"}
                                 setData={setUserData} setLoading={setIsLoadingMutation}/>
                    </div>
                    <div className="my-3 grid gap-4 pt-3 text-center grid-cols-2 lg:w-2/3 w-full">
                        {isLoading || isLoadingMutation ? <> <LoadingComponent/> <LoadingComponent/>  </> : (<>
                            <div>
                                {userData?.map((date: any) => (
                                    <>
                                        {date.date === "SATURDAY" && date.user.name && date.user.image ?
                                            <UserCard key={date.id} name={date.user.name} image={date.user.image}
                                                      studyDate={"SATURDAY"}/> : null}
                                    </>
                                ))}
                            </div>
                            <div>
                                {userData?.map((date: any) => (
                                    <>
                                        {date.date === "SUNDAY" && date.user.name && date.user.image ?
                                            <UserCard key={date.id} name={date.user.name} image={date.user.image}
                                                      studyDate={"SUNDAY"}/> : null}
                                    </>
                                ))}
                            </div>
                        </>)}
                    </div>
                    <AuthShowcase/>
                </main>
            </>
        );
    }
;

export default Home;

type DayCardProps =
    {
        name: string;
        description: string;
        dateEnum: string;
        setData: (data: any) => void;
        setLoading: (isLoading: boolean) => void;
    }
    ;

const DayCard = (
        {
            name, description, dateEnum, setData, setLoading
        }
            : DayCardProps) => {
        const mutation = trpc.studyDate.selectDay.useMutation();
        const selectCard = () => {
            setLoading(true)
            mutation.mutate({dateEnum: dateEnum}, {
                onSuccess: (data) => {
                    setData(data)
                    setLoading(false)
                },
            });
        }
        const borderColor = dateEnum === "SATURDAY" ? "border-purple-500" : "border-indigo-500";
        return (
            <button onClick={() => selectCard()}>
                <section
                    className={"flex flex-col justify-center rounded border-2 p-6 shadow-xl duration-500 motion-safe:hover:scale-105 "
                        + borderColor}>
                    <h2 className="text-lg text-gray-700">{name}</h2>
                    <p className="text-sm text-gray-600">{description}</p>
                </section>
            </button>
        )
            ;
    }
;

const UserCard = (
    {
        name, image, studyDate
    }
        : { name?: string, image?: string, studyDate?: string }) => {
    const borderColor = studyDate === "SATURDAY" ? "border-purple-500" : "border-indigo-500";
    return (
        <section
            className={"flex flex-col justify-center rounded border-2 mb-4 p-6 shadow-xl duration-500 motion-safe:hover:scale-105 " + borderColor}>
            {/*{image ? <img className={"rounded pb-2"} src={image}/> : null}*/}
            <h2 className="text-lg text-gray-700">{name}</h2>
        </section>
    );
}


const AuthShowcase: React.FC = () => {
        const {data: sessionData} = useSession();

        return (
            <div className="mt-5 pt-5 flex flex-col items-center justify-center gap-2">
                {sessionData && (
                    <p className="text-2xl text-blue-500">
                        Logged in as {sessionData?.user?.name}
                    </p>
                )}
                <button
                    className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
                    onClick={sessionData ? () => signOut() : () => signIn()}
                >
                    {sessionData ? "Sign out" : "Sign in"}
                </button>
            </div>
        );
    }
;
