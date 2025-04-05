import { ImageSize, SaveFile } from "wailsjs/go/main/App"

type FileType = "image" | "video" | "auto"

export const saveFile = async (file: File, type: FileType) => {
    const arrayBuffer = await file.arrayBuffer();
    const u = new Uint8Array(arrayBuffer);
    //const data = u.toString();
    const data = JSON.stringify(Array.from(u))
    const filename = Date.now() + "_" + file.name;
    const extension = filename.split(".")[filename.split(".").length - 1];
    const tabId = parseInt(window.sessionStorage.getItem("tabId") || "");
    const noteId = parseInt(window.sessionStorage.getItem("noteId") || "");
    const url = await SaveFile(data, tabId, noteId, filename);
    let width: number = 0;
    let height: number = 0;
    if (type === "image") {
        [width, height] = await ImageSize(data);
    }

    switch (type) {
        case "image":
            return ({
                src: url,
                alt: 'local',
                sizes: {
                    width: width,//data.width,
                    height: height//data.height,
                },
            })
        case "video":
            return ({ src: url, format: extension, name: file.name, size: file.size })
            return ({
                src: url,
                alt: 'local',
                /*sizes: {
                    width: 1024,//data.width,
                    height: 1024//data.height,
                },*/
            })

        default:
            return ({ src: url, format: file.type, name: filename, size: file.size })
    }


}