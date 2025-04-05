import { useEffect } from "react";

const useAutosize = (
    textAreaRef: HTMLTextAreaElement | null,
    value: string,
    defaultHeight = "0px"
) => {
    useEffect(() => {
        if (textAreaRef) {
            textAreaRef.style.height = defaultHeight;
            const scrollHeight = textAreaRef.scrollHeight;
            textAreaRef.style.height = scrollHeight + "px";
        }
    }, [textAreaRef, value, defaultHeight]);
};

export default useAutosize;
