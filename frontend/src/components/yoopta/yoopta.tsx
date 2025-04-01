import YooptaEditor, {
  createYooptaEditor,
  Elements,
  Blocks,
  useYooptaEditor,
  YooptaContentValue,
  YooptaOnChangeOptions,
} from '@yoopta/editor';

import { FormEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { WITH_BASIC_INIT_VALUE } from '../initValue';
import { InsertNote, ReadNote, SaveNote, UpdateNote } from 'wailsjs/go/main/App';
import { useStateStore } from '@/store/store';
import useDebounce from '@/hooks/use-debounce';
import { HistoryStack, HistoryStackName } from '@yoopta/editor/dist/editor/core/history';
import { MARKS, plugins, TOOLS } from './data';
import { scanEditorImages } from '@/lib/scanImage';



function WithBaseFullSetup() {
  const currentNoteIndex = useStateStore(state => state.currentNoteIndex);
  const setCurrentNoteIndex = useStateStore(state => state.setCurrentNoteIndex);
  const notes = useStateStore(state => state.notes);
  const note = notes[currentNoteIndex];
  const setNotes = useStateStore(state => state.setNotes);
  const currentTab = useStateStore(state => state.currentTab);
  const [value, setValue] = useState(WITH_BASIC_INIT_VALUE);
  const [prevImages, setPrevImages] = useState<string[]>([]);

  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const debouncedValue = useDebounce(value, 1000);

  const [title, setTitle] = useState("");

  const onChange = (newValue: YooptaContentValue, options: YooptaOnChangeOptions) => {
    setValue(newValue);
  };

  const handleChangeTitle = () => {
    const value = titleRef.current?.textContent ?? "";
    if (!note) {
      createNewNote(value);
    }
    if (currentNoteIndex === -1) return;

    const notesCopy = [...notes];
    notesCopy[currentNoteIndex].Title = value;
    setNotes(notesCopy);
    // make sure to show the placeholder
    if (value === "" && titleRef.current) titleRef.current!.textContent = ""
  }

  const onTitleChange: FormEventHandler<HTMLHeadingElement> = async (e) => {
    const value = e.currentTarget.textContent ?? "";
    if (value) setTitle(value)
  }

  const editorClick = () => {
    //editor.focus()
  }

  const onBeforeNewEditorFile = () => {
    if (prevImages.length === 0) return;
    const editorObject = editor.getEditorValue()
    const currentImages = scanEditorImages(editorObject);
    for (const image of prevImages) {
      if (!currentImages.includes(image)) {
        console.log(image)
        // Delete this image
      }
    }
  }

  const onAfterNewEditorFile = () => {
    resetHistory();
    setPrevImages(scanEditorImages(editor.getEditorValue()));
  }

  const resetHistory = () => {
    const initialValue: Record<HistoryStackName, HistoryStack[]> = {
      redos: [],
      undos: []
    }
    editor.historyStack = initialValue
  }

  const createNewNote = async (title: string) => {
    const id = await InsertNote(title, currentTab.ID)
    const newNote = { ID: id, Title: "", IsDeleted: false, TabId: currentTab.ID };
    const newNoteTitledChanged = { ID: id, Title: title, IsDeleted: false, TabId: currentTab.ID };
    setNotes([newNote, ...notes]);
    setTimeout(() => setNotes([newNoteTitledChanged, ...notes]), 0);
    setCurrentNoteIndex(0);
  }


  const saveFile = (noteId: number, editorValue: YooptaContentValue) => {
    SaveNote(currentTab.ID, noteId, JSON.stringify(editorValue))
  }

  const readFile = async () => {
    const editorValue = await ReadNote(currentTab.ID, note.ID);
    const parsedValue: YooptaContentValue = JSON.parse(editorValue);
    onBeforeNewEditorFile();
    editor.setEditorValue(parsedValue);
    editor.focus();
    onAfterNewEditorFile();
  }


  useEffect(() => {
    if (note?.ID && note?.Title) {
      UpdateNote(note.Title, note.ID)
    }
  }, [note?.Title])

  // on note change
  useEffect(() => {
    if (note && note?.Title) {
      setTitle(note.Title);
      readFile()
    }
  }, [note?.ID])

  // reset value when tab changes
  useEffect(() => {
    setTitle("");
    editor.setEditorValue({});
    onAfterNewEditorFile();
  }, [currentTab.ID])

  useEffect(() => {
    const preventLineBreaks = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        editor.insertBlock("Paragraph");
        editor.focus();
      }
    }
    if (titleRef.current) {
      titleRef.current.addEventListener('keydown', preventLineBreaks);
    }

    titleRef.current?.focus();

    return () => {
      if (titleRef.current) titleRef.current.removeEventListener('keydown', preventLineBreaks)
    }

  }, []);

  useEffect(() => {
    if (note?.ID) saveFile(note.ID, value);
  }, [debouncedValue]);

  return (
    <>
      <h1 suppressContentEditableWarning={true} ref={titleRef} onInput={handleChangeTitle} onBlur={onTitleChange} aria-placeholder="New note title" className='text-5xl md:pl-[8rem] outline-none' contentEditable="plaintext-only">{title ?? undefined}</h1>
      <div
        className="w-full min-h-screen md:pt-[1rem] md:px-[8rem] pb-[.2rem] flex justify-center"
        ref={selectionRef}
        onClick={editorClick}
      >
        <YooptaEditor
          editor={editor}
          plugins={plugins as any}
          tools={TOOLS}
          marks={MARKS}
          selectionBoxRoot={selectionRef}
          width="100%"
          value={value}
          onChange={onChange}
        />
      </div>
    </>
  );
}

export default WithBaseFullSetup;