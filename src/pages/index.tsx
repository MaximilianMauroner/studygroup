import {type NextPage} from "next";
import Head from "next/head";
import {signIn, signOut, useSession} from "next-auth/react";
import {trpc} from "../utils/trpc";
import type {RouterTypes} from "../utils/trpc";
import {LoadingComponent} from "../components/loading_component";
import {useState} from "react";

type studyDate = RouterTypes['studyDate']['getAll']['output']
type singleStudyDate = RouterTypes['studyDate']['getAll']['output'][0]

const Home: NextPage = () => {
        const [userData, setUserData] = useState<studyDate>([])
        const [isLoadingMutation, setIsLoadingMutation] = useState(false);
        const [isErrorMutation, setIsErrorMutation] = useState(false);
        const {isLoading} = trpc.studyDate.getAll.useQuery(undefined, {
            onSuccess: (data) => {
                setUserData(data)
            }
        })
        return (
            <>
                <Head>
                    <title>Study Group</title>
                    <meta name="description" content="Study Group by Maximilian"/>
                    <link rel="icon" href="/favicon.ico"/>
                </Head>
                <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
                    {isErrorMutation ? <ErrorCard setError={setIsErrorMutation}/> : null}
                    <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
                        Select your Study-Day
                    </h1>

                    <div className="my-3 grid gap-4 pt-3 text-center grid-cols-2 lg:w-2/3 w-full">
                        <DayCard name={"Saturday"} description={"Saturday at 12:00"} dateEnum={"SATURDAY"}
                                 setData={setUserData} setLoading={setIsLoadingMutation} setError={setIsErrorMutation}/>
                        <DayCard name={"Sunday"} description={"Sunday at 12:00"} dateEnum={"SUNDAY"}
                                 setData={setUserData} setLoading={setIsLoadingMutation} setError={setIsErrorMutation}/>
                    </div>
                    <div className="my-3 grid gap-4 pt-3 text-center grid-cols-2 lg:w-2/3 w-full">
                        {isLoading || isLoadingMutation ? <> <LoadingComponent/> <LoadingComponent/>  </> : (<>
                            <div>
                                {userData?.map((studyDate: singleStudyDate) => (
                                    <div key={studyDate.id}>
                                        {studyDate.date === "SATURDAY" && studyDate.user.name && studyDate.user.image ?
                                            <UserCard name={studyDate.user.name}
                                                      image={studyDate.user.image}
                                                      studyDate={"SATURDAY"}/> : null}
                                    </div>
                                ))}
                            </div>
                            <div>
                                {userData?.map((studyDate: singleStudyDate) => (
                                    <div key={studyDate.id}>
                                        {studyDate.date === "SUNDAY" && studyDate.user.name && studyDate.user.image ?
                                            <UserCard key={studyDate.id} name={studyDate.user.name}
                                                      image={studyDate.user.image}
                                                      studyDate={"SUNDAY"}/> : null}
                                    </div>
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
        setData: (data: studyDate) => void;
        setLoading: (isLoading: boolean) => void;
        setError: (isError: boolean) => void;
    }
    ;

const DayCard = (
        {
            name, description, dateEnum, setData, setLoading, setError
        }
            : DayCardProps) => {
        const mutation = trpc.studyDate.selectDay.useMutation();
        const selectCard = () => {
            setLoading(true)
            mutation.mutate({dateEnum: dateEnum}, {
                onSuccess: (data: studyDate) => {
                    setData(data)
                    setLoading(false)
                },
                onError: () => {
                    setError(true)
                    setLoading(false)
                }
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
        );
    }
;

const UserCard = ({name, image, studyDate}: { name?: string, image?: string, studyDate?: string }) => {
    const borderColor = studyDate === "SATURDAY" ? "border-purple-500" : "border-indigo-500";
    return (
        <section
            className={"flex flex-col justify-center rounded border-2 mb-4 p-6 shadow-xl duration-500 motion-safe:hover:scale-105 " + borderColor}>
            {/*{image ? <img className={"rounded pb-2"} src={image}/> : null}*/}
            <h2 className="text-lg text-gray-700">{name}</h2>
        </section>
    );
}

const ErrorCard = ({setError}: { setError: (isError: boolean) => void }) => {
    return (
        <div id="alert-2" className="flex absolute text-sm top-5 right-4 p-4 bg-red-100 rounded-lg dark:bg-red-200"
             role="alert">
            <span className="font-medium pr-2">Sign-in please!</span>
            <button type="button"
                    onClick={() => setError(false)}
                    className="ml-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-red-200 dark:text-red-600 dark:hover:bg-red-300"
                    data-dismiss-target="#alert-2" aria-label="Close">
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                     xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"></path>
                </svg>
            </button>
        </div>)
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
                    onClick={sessionData ? () => signOut() : () => signIn("discord")}
                >
                    {sessionData ? "Sign out" : "Sign in"}
                </button>
            </div>
        );
    }
;
