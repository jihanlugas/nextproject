import { NextPage, } from "next";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { isEmptyObject } from "../../utils/Validate";
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { UseProjectForm, UseSubmitProject } from "../../hooks/useMutation";
import { Form, Formik, FieldArray, FormikValues, ArrayHelpers, FormikErrors } from "formik";
import * as Yup from 'yup';
import TextField from "../formik/TextField";
import ButtonSubmit from "../formik/ButtonSubmit";



interface Props {
    show: boolean;
    onClickOverlay: Function;
    selectedId: number;
    notif: {
        error: Function,
        info: Function,
        success: Function,
        warning: Function,
    };
}

const initDefault = {
    id: 0,
    name: "",
    location: "",
    description: "",
    startAt: "",
    endAt: ""
}

const schema = Yup.object().shape({
    name: Yup.string().required().label("Project Name"),
    location: Yup.string().required().label("Project Location"),
    description: Yup.string().required().label("Project Description"),
    startAt: Yup.string().required().label("Project Start"),
    endAt: Yup.string().required().label("Project End"),
});

const ModalCreateProject: NextPage<Props> = ({ show, onClickOverlay, selectedId = 0, notif }) => {

    const [init, setInit] = useState<any>({});

    const form = UseProjectForm()
    const submit = UseSubmitProject()

    useEffect(() => {
        if (show) {
            // if (selectedId === 0) {
            //     setInit(initDefault)
            // } else {
            form.mutate(selectedId, {
                onSuccess: (res) => {
                    if (res.success) {
                        setInit(res.data)
                    } else if (res.errors) {
                        console.log("res.errors => ", res.errors)
                    }
                }
            })
            // }
        }
    }, [selectedId, show])

    const handleSubmit = (values: FormikValues, setErrors) => {
        submit.mutate(values, {
            onSuccess: (res) => {
                if (res.success) {
                    notif.success(res.message)
                    setInit({})
                    onClickOverlay(0, true)
                } else if (res.errors) {
                    notif.error(res.message)
                    res.errors.validate && setErrors(res.errors.validate)
                }
            },
            onError: (error) => {
                console.log(error)
            }
        })
    }

    return (
        <Modal show={show} onClickOverlay={onClickOverlay}>
            <div className={"w-full h-full p-4"}>
                {isEmptyObject(init) || form.isLoading ? (
                    <div className={"w-full h-full flex justify-center items-center"}>
                        <AiOutlineLoading3Quarters className={"animate-spin"} size={"4em"} />
                    </div>
                ) : (
                    <Formik
                        initialValues={init}
                        enableReinitialize={true}
                        onSubmit={(values, { setErrors }) => handleSubmit(values, setErrors)}
                        validationSchema={schema}
                    >
                        {({ values, errors }) => {
                            return (
                                <Form className={"flex flex-col w-full"}>
                                    <div className={"flex justify-between items-center text-xl mb-2"}>
                                        Project
                                    </div>
                                    <div className={"w-full grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4"}>
                                        <div className={"flex w-full"}>
                                            <TextField
                                                label={"Project Name"}
                                                name={"name"}
                                                type={"text"}
                                            />
                                        </div>
                                        <div className={"flex w-full"}>
                                            <TextField
                                                label={"Project Location"}
                                                name={"location"}
                                                type={"text"}
                                            />
                                        </div>
                                        <div className={"flex w-full"}>
                                            <TextField
                                                label={"Project Description"}
                                                name={"description"}
                                                type={"text"}
                                            />
                                        </div>
                                        <div className={"flex w-full"}>
                                            <TextField
                                                label={"Project Start"}
                                                name={"startAt"}
                                                type={"text"}
                                            />
                                        </div>
                                        <div className={"flex w-full"}>
                                            <TextField
                                                label={"Project End"}
                                                name={"endAt"}
                                                type={"text"}
                                            />
                                        </div>
                                    </div>
                                    <div className={"flex mb-4"}>
                                        <ButtonSubmit
                                            label={"Save"}
                                            disabled={submit.isLoading}
                                        />
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                )}
            </div>
        </Modal>
    )
}

export default ModalCreateProject;