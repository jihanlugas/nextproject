import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import User from "../../components/layout/User";
import Head from "next/head";
import { GoPlus, GoSearch } from 'react-icons/go'
import { UsePage } from '../../hooks/useMutation';
import { withNotif } from '../../hoc/withNotif';
import { withQuery } from '../../hoc/withQuery';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ModalCreateProject from "../../components/modal/ModalCreateProject";
import { FiEdit2, FiTrash } from 'react-icons/fi'



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

    const [search, setSearch] = useState("");
    const [show, setShow] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<number>(0);
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

    const onClickOverlay = (id: number = 0, refresh: boolean = false) => {
        setSelectedId(id)
        setShow(!show)
        if (refresh) {
            setToggle(!toogle)
        }
    }

    const perPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log("perPage")
    }

    const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value)
    }

    const handleDelete = (id: number) => {
        console.log("handleDelete ", id)
    }

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
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4 px-4">
                            {project.map((data, key) => {
                                return (
                                    <div className={"bg-gray-50 shadow rounded "} key={key}>
                                        <div className={"px-2 pt-2 mb-2"}>
                                            <div className={"bg-gray-700 text-gray-100 p-2 rounded mb-1 text-lg"}>
                                                <div>{data.name}</div>
                                            </div>
                                            <div>{data.location}</div>
                                            <div>{data.description}</div>
                                            <div>{data.startAt}</div>
                                            <div>{data.endAt}</div>
                                        </div>
                                        <div className={"mb-2"}>
                                            <div className={"flex justify-center items-center"}>
                                                <div className={"p-2 flex justify-center items-center mx-2 bg-gray-700 text-gray-100 rounded-full"} onClick={() => onClickOverlay(data.id)}>
                                                    <FiEdit2 size={"1em"} />
                                                </div>
                                                <div className={"p-2 flex justify-center items-center mx-2 bg-gray-700 text-gray-100 rounded-full"} onClick={() => handleDelete(data.id)}>
                                                    <FiTrash size={"1em"} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"p-2 mb-2"}>
                                            <div className={"grid grid-cols-3 gap-2"}>
                                                <div className={"border rounded p-2 flex justify-center items-center"}>Task</div>
                                                <div className={"border rounded p-2 flex justify-center items-center"}>Store</div>
                                                <div className={"border rounded p-2 flex justify-center items-center"}>Store</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
            <ModalCreateProject
                show={show}
                onClickOverlay={onClickOverlay}
                selectedId={selectedId}
                notif={notif}
            />
        </User>
    )
}

export default withNotif(withQuery(Project))

