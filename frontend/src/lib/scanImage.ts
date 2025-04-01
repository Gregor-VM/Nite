import { YooptaContentValue } from "@yoopta/editor";

export const scanEditorImages = (editor: YooptaContentValue): string[] => {
    const currentImages: string[] = [];
    const editorObject = editor;
    for (const key of Object.keys(editorObject)) {
        if (editorObject[key].type === "Image" && (editorObject[key].value[0] as any).type === "image") {
            const imageSrc = (editorObject[key].value[0] as any).props.src;
            const imageSrcSplitted = imageSrc.split("/");
            const filename = imageSrcSplitted[imageSrcSplitted.length - 1];
        }
    }
    return currentImages;
}