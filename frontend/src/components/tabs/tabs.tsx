import { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { CheckForZombieAssets, GetTabs } from 'wailsjs/go/main/App'
import { main } from 'wailsjs/go/models'
import { CreateTab } from '../dialogs/create-tab';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu';
import { ContextMenuShortcut } from '../ui/context-menu';
import { Plus } from 'lucide-react';
import { DeleteTab } from '../dialogs/delete-tab';
import useShortcut from '@/hooks/use-shortcut';
import { tabInitialState, useStateStore } from '@/store/store';
import styles from './tabs.module.css';

function Tabs() {

  const notes = useStateStore(state => state.notes);
  const currentTab = useStateStore(state => state.currentTab);
  const setCurrentTab = useStateStore(state => state.setCurrentTab);
  const tabLoading = useStateStore(state => state.tabLoading);
  const currentNoteIndex = useStateStore(state => state.currentNoteIndex);
  const setTabLoading = useStateStore(state => state.setTabLoading);
  const setCurrentNoteIndex = useStateStore(state => state.setCurrentNoteIndex);
  useShortcut({ key: "e", callback: () => showEditTab(currentTab) })
  useShortcut({ key: "r", callback: () => showDeleteModal(currentTab) })

  const [editTab, setEditTab] = useState<main.Tab | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selected, setSelected] = useState<number>();
  const [tabs, setTabs] = useState<main.Tab[]>([]);

  const getButtonVariant = useCallback((tabId: number) => {
    return selected === tabId ? "secondary" : "ghost"
  }, [selected])

  const changeTab = (tab: main.Tab) => {
    CheckForZombieAssets(currentTab?.ID, notes[currentNoteIndex]?.ID)
    setCurrentNoteIndex(-1);
    setSelected(tab.ID);
    setCurrentTab(tab);
  };

  const getTabs = async () => {
    if (tabLoading) return;
    setTabLoading(true);
    let res = await GetTabs();

    // if not response is given assume this is the first time
    // and the database is still being created
    if (res.length === 0) res = [tabInitialState];

    if (res) {
      const data = res.reverse()
      setTabs(data);
      const selectedId = selected ? data.find((tab => tab?.ID === selected))?.ID : data[0].ID
      setSelected(selectedId);
      const selectedTab = data.find(tab => tab.ID === selectedId)
      if (selectedTab) setCurrentTab(selectedTab);
    }
    setTabLoading(false);
  }

  const showCreateTab = () => {
    setEditTab(null);
    setOpenModal(true);
  }

  const showEditTab = (tab: main.Tab) => {
    setEditTab(tab);
    setOpenModal(true);
  }

  const showDeleteModal = (tab: main.Tab) => {
    setEditTab(tab);
    setOpenDeleteModal(true);
  }

  useEffect(() => {
    getTabs();
  }, []);

  return (
    <>
      <nav onDoubleClick={e => e.stopPropagation()} className={`${styles.tabs} flex m-[0.35rem] gap-2 overflow-x-auto hide-scrollbar avoiddrag`}>
        {tabs.map(tab => {
          return (
            <ContextMenu key={tab.ID}>
              <ContextMenuTrigger>
                <Button
                  className='h-8 py-0'
                  onClick={() => changeTab(tab)}
                  variant={getButtonVariant(tab.ID)}
                >{tab.Title}</Button>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-36">
                <ContextMenuItem onClick={() => showEditTab(tab)}>
                  Edit
                  <ContextMenuShortcut>⌘ + E</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem onClick={() => showDeleteModal(tab)} disabled={tab.ID === 1} variant='destructive'>
                  Delete
                  <ContextMenuShortcut>⌘ + R</ContextMenuShortcut>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
        <CreateTab tabToEdit={editTab} open={openModal} setOpen={setOpenModal} updateTabs={getTabs} />
        <DeleteTab updateTabs={getTabs} tabToEdit={editTab} open={openDeleteModal} setOpen={setOpenDeleteModal} />
      </nav>
      <Button className='h-8 py-0 m-[0.35rem]' onClick={showCreateTab} variant="ghost"><Plus /></Button>
    </>
  )
}

export default Tabs