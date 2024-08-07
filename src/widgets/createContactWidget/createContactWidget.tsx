import { Dispatch, FC, SetStateAction, useState } from "react"

import { AnimatePresence, motion } from "framer-motion"

import FormCreateContact from "../../features/formCreateContact/formCreateContact"


import './ui/createContactWidget.css'

const CreateContactWidget:FC<{setFunc?:Dispatch<SetStateAction<any>>, data?:any}> = (props) => {

    const [isHide, setIsHide] = useState(true)

    return (
        <>
            {isHide &&
            <motion.div className="to-unhide-btn xl-text default-hide-btn" onClick={() => setIsHide(!isHide)}>
                Create contact user
            </motion.div>
            }
            <AnimatePresence>
            {isHide || 
            
                    <motion.div className="sticky create-contact-widget"
                    initial={{y:-400}}
                    animate={{y:0}}
                    exit={{y:-400}}
                    transition={{duration:0.4}}
                    >
                        <div className="create-contact-wrapper">
                            <FormCreateContact  setFunc={props.setFunc} data={props.data}/>
                        </div>
                        <div className="default-hide-btn xl-text" onClick={() => setIsHide(!isHide)}>
                            Hide
                        </div>
                    </motion.div>
            }
            </AnimatePresence>
        </>
    )
}

export default CreateContactWidget