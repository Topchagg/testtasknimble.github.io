import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";

import { InputField, ReactiveForm, useCreateForm,fieldSettings, setGlobalObject, useActionOnSubmit, formIsValid, ImageField, SelectField } from "reactive-fast-form"
import isAlpha from "validator/lib/isAlpha"
import isEmail from "validator/lib/isEmail"

import { usePostRequest } from "../../shared/sharedApi";

import {LoadingItem} from "../../shared/sharedApi";

import {downloadImgTo } from "../../lib/firebase/firbaseScripts";

import './ui/formCreateContact.css'

const FormCreateContact:FC<{setFunc?:Dispatch<SetStateAction<any>>,data?:any}> = (props) => {

    const url = 'https://cors-anywhere.herokuapp.com/https://live.devnimble.com/api/v1/contact';
    const token = 'VlP9cwH6cc7Kg2LsNPXpAvF6QNmgZn';

    const [form,setForm,trigger] = useCreateForm(['firstName','lastName','email','image','type'])
    const [preview, setPreview] = useState<string>()
    const [imageUrl,setImageUrl] = useState<string>()

    const {loading,data,error,postRequest} = usePostRequest(url,token)

    const settings:fieldSettings = {
        validClass:"valid default-field",
        invalidClass:"invalid default-field",
        resetAfterSubmit:true
    }

    useActionOnSubmit(async () => {
        if(formIsValid(form, {'firstName':'lastName'})){
            let img = null
            if(form['image'].value){
                img = await downloadImgTo(form['image'].value,'/image')
                setImageUrl(img) 
            } 
            
            let name = form['firstName'].value
            let lastName = form['lastName'].value

            if(name.length === 0){
                name = null
            }else if(lastName.length === 0){ // Нужно доработать библиотеку :) Чтоб избавиться от таких проверок 
                lastName = null
            }

            const data = {
                    avatar_url:img,
                    record_type: form['type'].value,
                    privacy: {
                    edit: null,
                    read: null,
                    },
                    owner_id: null,
                    fields: {
                        "email": [{
                            "value": form['email'].value,
                            "modifier":''
                        }],
                        "last name": [{
                            "value":lastName,
                            "modifier":''
                        }],
                        "first name": [{
                            "value":name,
                            "modifier":''
                        }],
                    }
    
                }     
                setPreview('')
                postRequest(data)

                if(true){
                    const localData = props.data
                    localData.unshift(data)
                    props.setFunc([...localData])
                }
        }else {
            alert('1. Name or Lastname have to be filled, 2. Email is required field and have to be valid email value')
        }
    },trigger)

    useEffect(() => {
        if(form['image'].value !== undefined){
            const image:Blob = form['image'].value
                if(image){
                    const objectUrl = URL.createObjectURL(image)
                    setPreview(objectUrl)
                }
        }
        if(error !== null){
            if(typeof imageUrl  === 'string'){
                // delete img if was error in sending to the server
            }
            alert(error)
        }
    },[form['image'].value,error])

    return (
        <>
        <div className="form-create-contact-wrapper">
            <ReactiveForm setObject={form} setFunc={setForm}>
                {loading && <LoadingItem/>}
                <div>
                    {!form['firstName'].isValid && <>Valid only alphabets!</>}
                    <InputField name="firstName" max={20} allowNull validFunc={isAlpha} {...settings} placeholder="Name"/>
                </div>
                <div>
                    {!form['lastName'].isValid && <>Valid only alphabets!</>}
                    <InputField name="lastName" max={20} allowNull validFunc={isAlpha} {...settings} placeholder="Surname"/>
                </div>
                <div>
                    {!form['email'].isValid && <div>Invalid email</div>}
                    <InputField name="email" validFunc={isEmail} isTrigger {...settings} placeholder="Email" type="email"/>
                </div>
                <div>
                    <ImageField name="image" maxBytes={10000000} id="image" updateOnChange allowNull/>
                </div>
                <div>
                    <SelectField name="type" classNameSelectField="create-contact-select-field mt-5" defaultValue="person">
                        <option value={'person'}>Person</option>
                        <option value={'company'}>Company</option>
                    </SelectField>
                </div>
            </ReactiveForm> 

            <label htmlFor="image">
                    <div className="create-contact-image-wrapper">
                        {preview && <img src={preview} className="image" alt="" /> || <div className="l-text">Image</div> } 
                    </div>
            </label>
        </div>
        <button onClick={() => setGlobalObject(setForm)} className="btn l-text mt-5 center">**Create new contact**</button>
            {data && <div className="center mt-5">Succesfully created!</div>} {error && <div className="center">error</div>}
        </>
    )
}

export default FormCreateContact