import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import User from "../../components/layout/User";
import Head from "next/head";
import { GoPlus, GoSearch } from 'react-icons/go'
import { UsePage } from '../../hooks/useMutation';
import { withNotif } from '../../hoc/withNotif';
import { withQuery } from '../../hoc/withQuery';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";


interface Props {
    notif: {
        error: Function,
        info: Function,
        success: Function,
        warning: Function,
    }
}

const defaultPaginate = {
    page: 1,
    perPage: 10,
    search: "",
}

interface paginate {
    page: number;
    perPage: number;
    search: string;
}

const Project: NextPage<Props> = ({ notif }) => {

    const [search, setSearch] = useState("")
    const [project, setProject] = useState<{ [key: string]: any; }>([]);
    const [paginate, setPaginate] = useState<paginate>(defaultPaginate)
    const [toogle, setToggle] = useState<boolean>(true);

    const { isLoading, mutate } = UsePage("/projects")

    useEffect(() => {
        mutate(paginate, {
            onSuccess: (res) => {
                if (res.success) {
                    setProject(res.data)
                }
            }
        })
    }, [toogle, paginate])

    const onClickOverlay = () => {
        console.log("onClickOverlay")
    }

    const perPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log("perPage")
    }

    const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }

    console.log("Project => ", project)



    return (
        <User>
            <Head>
                <title>Project</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={"flex flex-col p-4 w-full"}>
                <div className="mb-2">
                    <span className="text-xl py-2">Project</span>
                </div>
            </div>
            <div className={"flex flex-col w-full"}>
            </div>
            <div className={"flex px-4 py-2 w-full justify-end"}>
                <button className={"bg-green-400 p-2 rounded text-gray-100 font-bold flex items-center"} onClick={() => onClickOverlay()}>
                    <span><GoPlus className={"mr-2 font-bold"} size={"1.2em"} /></span>
                    <span>Create</span>
                </button>
            </div>
            <div className={"flex flex-col px-4 py-2 w-full"}>
                <div className={"flex flex-row justify-between items-center mb-4"}>
                    <div className={"flex flex-row items-center"}>
                        <div className={""}>
                            Per Page
                        </div>
                        <div className={""}>
                            <select className={"p-2 w-16 rounded bg-transparent"} name="" id="" onChange={perPage}>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                    <div className={"relative"}>
                        <div className={"absolute h-10 w-10 flex justify-center items-center right-0"}>
                            <GoSearch className={"text-gray-400"} size={"1.2em"} />
                        </div>
                        <input
                            type="text"
                            className={"w-full border-2 rounded h-10 pl-2 pr-10 bg-gray-100"}
                            placeholder={"Search"}
                            value={search}
                            onChange={handleChangeSearch}
                        />
                    </div>
                </div>
            </div>
            <div className={""}>
                {isLoading ? (
                    <div className={""}>
                        {[0, 1, 2, 3, 4].map((data, key) => {
                            return (
                                <div className={"px-4 mb-4"} key={key}>
                                    <Skeleton className={"h-16"} />
                                </div>
                            )
                        })}
                    </div>
                ) : project.length === 0 ? (
                    <div className={""}>
                        <div>No Data</div>
                    </div>
                ) : (
                    <div className={""}>
                        {project.map((data, key) => {
                            return (
                                <div className={"px-4 mb-4"} key={key}>
                                    <div className={"bg-gray-50 shadow p-2 rounded"}>
                                        <div className={"bg-gray-700 text-gray-100 p-2 rounded mb-1 text-lg"}>
                                            <div>{data.name}</div>
                                        </div>
                                        <div>{data.location}</div>
                                        <div>{data.description}</div>
                                        <div>{data.startAt}</div>
                                        <div>{data.endAt}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </User>
    )
}

export default withNotif(withQuery(Project))

