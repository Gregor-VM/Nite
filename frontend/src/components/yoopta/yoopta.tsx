import YooptaEditor, {
  createYooptaEditor,
  YooptaContentValue,
  YooptaOnChangeOptions,
} from '@yoopta/editor';
import { YOOPTA_INIT_VALUE } from './initValue';

import { useEffect, useMemo, useRef, useState } from 'react';
import { InsertNote, ReadNote, SaveNote, UpdateNote } from 'wailsjs/go/main/App';
import { useStateStore } from '@/store/store';
import useDebounce from '@/hooks/use-debounce';
import { HistoryStack, HistoryStackName } from '@yoopta/editor/dist/editor/core/history';
import { MARKS, plugins, TOOLS } from './data';

import './styles.css';
import useAutosize from '@/hooks/use-autoResize';
import { main } from 'wailsjs/go/models';


function Yoopta() {
  const currentNoteIndex = useStateStore(state => state.currentNoteIndex);
  const setCurrentNoteIndex = useStateStore(state => state.setCurrentNoteIndex);
  const notes = useStateStore(state => state.notes);
  const note = notes[currentNoteIndex];
  const setNotes = useStateStore(state => state.setNotes);
  const currentTab = useStateStore(state => state.currentTab);
  const setIsTyping = useStateStore(state => state.setIsTyping);
  const [value, setValue] = useState(YOOPTA_INIT_VALUE);
  const [title, setTitle] = useState("");

  const editor = useMemo(() => createYooptaEditor(), []);
  const selectionRef = useRef(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const isReadingNote = useRef(false);

  const debouncedValue = useDebounce(value, 1000);
  useAutosize(titleRef.current, title);

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

  const onAfterNewEditorFile = () => {
    resetHistory();
    isReadingNote.current = false;
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


  const saveFile = (note: main.Note, editorValue: YooptaContentValue) => {
    SaveNote(note.TabId, note.ID, JSON.stringify(editorValue))
  }

  const readFile = async () => {
    const editorValue = await ReadNote(note.TabId, note.ID);
    const parsedValue: YooptaContentValue = JSON.parse(editorValue);
    editor.setEditorValue(parsedValue);

    // focus first element automatically
    // this avoid scroll to top issue when focusing the element for the first time
    const firstBlock = Object.keys(parsedValue)[0];
    editor.focusBlock(parsedValue[firstBlock].id)


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
      isReadingNote.current = true;
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

  // reset value when noteId change to new note
  useEffect(() => {
    if (currentNoteIndex === -1) {
      setTitle("");
      editor.setEditorValue({});
      onAfterNewEditorFile();
      titleRef.current?.focus();
    }
  }, [currentNoteIndex])

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
    if (isReadingNote.current) return;
    if (note?.ID) saveFile(note, debouncedValue);
  }, [debouncedValue]);

  return (
    <div className='overflow-y-auto h-[94vh] pt-3'>
      <textarea onKeyDown={() => setIsTyping(true)} ref={titleRef} value={title} onChange={onTitleChange} placeholder='New note title' className='text-5xl leading-tight md:pl-[8rem] px-[4rem] outline-none w-11/12 resize-none overflow-hidden'></textarea>
      <div
        className="pt-0 md:px-[8rem] px-[4rem] pb-[.2rem]"
        ref={selectionRef}
        onKeyDown={() => setIsTyping(true)}
      >
        <YooptaEditor
          editor={editor}
          plugins={plugins as any}
          tools={TOOLS}
          marks={MARKS}
          selectionBoxRoot={selectionRef}
          width="100%"
          value={value}
          className='h-full'
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default Yoopta;