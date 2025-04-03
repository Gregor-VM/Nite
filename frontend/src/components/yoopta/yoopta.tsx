import YooptaEditor, {
  createYooptaEditor,
  Elements,
  Blocks,
  useYooptaEditor,
  YooptaContentValue,
  YooptaOnChangeOptions,
} from '@yoopta/editor';

import { useEffect, useMemo, useRef, useState } from 'react';
import { WITH_BASIC_INIT_VALUE } from '../initValue';
import { InsertNote, ReadNote, SaveNote, UpdateNote } from 'wailsjs/go/main/App';
import { useStateStore } from '@/store/store';
import useDebounce from '@/hooks/use-debounce';
import { HistoryStack, HistoryStackName } from '@yoopta/editor/dist/editor/core/history';
import { MARKS, plugins, TOOLS } from './data';


function WithBaseFullSetup() {
  const currentNoteIndex = useStateStore(state => state.currentNoteIndex);
  const setCurrentNoteIndex = useStateStore(state => state.setCurrentNoteIndex);
  const notes = useStateStore(state => state.notes);
  const note = notes[currentNoteIndex];
  const setNotes = useStateStore(state => state.setNotes);
  const currentTab = useStateStore(state => state.currentTab);
  const [value, setValue] = useState(WITH_BASIC_INIT_VALUE);

  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);

  const debouncedValue = useDebounce(value, 1000);

  const [title, setTitle] = useState("");
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const onChange = (newValue: YooptaContentValue, options: YooptaOnChangeOptions) => {
    setValue(newValue);
  };

  const onTitleChange: React.ChangeEventHandler<HTMLTextAreaElement> = async (e) => {
    const value = e.target.value ?? "";
    if (value) setTitle(value)

    if (!note) {
      createNewNote(value);
    }
    if (currentNoteIndex === -1) return;

    const notesCopy = [...notes];
    notesCopy[currentNoteIndex].Title = value;
    setNotes(notesCopy);
    setTitle(value);
  }

  const editorClick = () => {
    //editor.focus()
  }

  const onAfterNewEditorFile = () => {
    resetHistory();
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
    window.sessionStorage.setItem("noteId", String(id));
  }


  const saveFile = (noteId: number, editorValue: YooptaContentValue) => {
    SaveNote(currentTab.ID, noteId, JSON.stringify(editorValue))
  }

  const readFile = async () => {
    const editorValue = await ReadNote(currentTab.ID, note.ID);
    const parsedValue: YooptaContentValue = JSON.parse(editorValue);
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
      window.sessionStorage.setItem("noteId", String(note?.ID));
    }
  }, [note?.ID])

  // reset value when tab changes
  useEffect(() => {
    setTitle("");
    editor.setEditorValue({});
    onAfterNewEditorFile();
    window.sessionStorage.setItem("tabId", String(currentTab?.ID));
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
      <textarea ref={titleRef} value={title} onChange={onTitleChange} placeholder='New note title' className='text-5xl md:pl-[8rem] outline-none w-11/12 h-14 resize-none overflow-hidden'></textarea>
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