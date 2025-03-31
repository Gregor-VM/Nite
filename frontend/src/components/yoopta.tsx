import YooptaEditor, {
  createYooptaEditor,
  Elements,
  Blocks,
  useYooptaEditor,
  YooptaContentValue,
  YooptaOnChangeOptions,
} from '@yoopta/editor';

import Paragraph from '@yoopta/paragraph';
import Blockquote from '@yoopta/blockquote';
import Embed from '@yoopta/embed';
import Image from '@yoopta/image';
import Link from '@yoopta/link';
import Callout from '@yoopta/callout';
import Video from '@yoopta/video';
import File from '@yoopta/file';
import Accordion from '@yoopta/accordion';
import { NumberedList, BulletedList, TodoList } from '@yoopta/lists';
import { Bold, Italic, CodeMark, Underline, Strike, Highlight } from '@yoopta/marks';
import { HeadingOne, HeadingThree, HeadingTwo } from '@yoopta/headings';
import Code from '@yoopta/code';
import Table from '@yoopta/table';
import Divider from '@yoopta/divider';
import ActionMenuList, { DefaultActionMenuRender } from '@yoopta/action-menu-list';
import Toolbar, { DefaultToolbarRender } from '@yoopta/toolbar';
import LinkTool, { DefaultLinkToolRender } from '@yoopta/link-tool';

import { FormEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import { WITH_BASIC_INIT_VALUE } from './initValue';
import { InsertNote, UpdateNote } from 'wailsjs/go/main/App';
import { useStateStore } from '@/store/store';

const plugins = [
  Paragraph,
  Table,
  Divider.extend({
    elementProps: {
      divider: (props) => ({
        ...props,
        color: '#007aff',
      }),
    },
  }),
  Accordion,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  Blockquote,
  Callout,
  NumberedList,
  BulletedList,
  TodoList,
  Code,
  Link,
  Embed,
  /*Image.extend({
    options: {
      async onUpload(file) {
        const data = await uploadToCloudinary(file, 'image');

        return {
          src: data.secure_url,
          alt: 'cloudinary',
          sizes: {
            width: data.width,
            height: data.height,
          },
        };
      },
    },
  }),*/
  /*Video.extend({
    options: {
      onUpload: async (file) => {
        const data = await uploadToCloudinary(file, 'video');
        return {
          src: data.secure_url,
          alt: 'cloudinary',
          sizes: {
            width: data.width,
            height: data.height,
          },
        };
      },
      onUploadPoster: async (file) => {
        const image = await uploadToCloudinary(file, 'image');
        return image.secure_url;
      },
    },
  }),*/
  /*File.extend({
    options: {
      onUpload: async (file) => {
        const response = await uploadToCloudinary(file, 'auto');
        return { src: response.secure_url, format: response.format, name: response.name, size: response.bytes };
      },
    },
  }),*/
];

const TOOLS = {
  ActionMenu: {
    render: DefaultActionMenuRender,
    tool: ActionMenuList,
  },
  Toolbar: {
    render: DefaultToolbarRender,
    tool: Toolbar,
  },
  LinkTool: {
    render: DefaultLinkToolRender,
    tool: LinkTool,
  },
};

const MARKS = [Bold, Italic, CodeMark, Underline, Strike, Highlight];

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
  const titleRef = useRef<HTMLHeadingElement>(null);

  const [title, setTitle] = useState("");

  const onChange = (newValue: YooptaContentValue, options: YooptaOnChangeOptions) => {
    setValue(newValue);
  };

  const handleChangeTitle = () => {
    const value = titleRef.current?.textContent ?? "";
    if (!note) {
      createNewNote();
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

  const createNewNote = async () => {
    const id = await InsertNote(note?.Title ?? "", currentTab.ID)
    const newNote = { ID: id, Title: note?.Title ?? "", IsDeleted: false, TabId: currentTab.ID };
    setNotes([newNote, ...notes]);
    setCurrentNoteIndex(0);
  }


  useEffect(() => {
    if (note?.ID && note?.Title) {
      UpdateNote(note.Title, note.ID)
    }
  }, [note?.Title])

  useEffect(() => {
    if (note && note?.Title) {
      setTitle(note.Title);
    }
  }, [note?.ID])

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