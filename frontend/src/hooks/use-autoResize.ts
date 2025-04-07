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

    useEffect(() => {
        if (!textAreaRef) return;
        const resize_ob = new ResizeObserver(function (entries) {
            if (textAreaRef) {
                textAreaRef.style.height = defaultHeight;
                const scrollHeight = textAreaRef.scrollHeight;
                textAreaRef.style.height = scrollHeight + "px";
            }
        });
        resize_ob.observe(textAreaRef);
        return () => {
            resize_ob.unobserve(textAreaRef);
        }
    }, [textAreaRef]);
};

export default useAutosize;
