import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import {localDataDir, join} from '@tauri-apps/api/path';

const homePage = document.querySelector<HTMLElement>('#home-page')!;
const editorPage = document.querySelector<HTMLElement>('#editor-page')!;

const openFileButton = document.querySelector('#open-file')!;
const backFileButton = document.querySelector("#back-button")

const testContent = document.querySelector<HTMLParagraphElement>('#test')

const local = await localDataDir();
const users = await join(local, "SlayTheSpire2", "steam")


async function selectFile(){
  console.log('Button clicked');
  const file = await open({
    multiple: false,
    directory: false,
    defaultPath: users,
    filters: [
      {
        name: 'Save Files',
        extensions: ['save'],
      },
    ],
  });

  if (file) {
    await invoke('load_save', {fileName: file})
    homePage.hidden = true;
    editorPage.hidden = false;
    let t: [number, number] = await invoke("get_health");
    testContent.textContent = `(${t[0]}, ${t[1]})`;
  }
}

openFileButton.addEventListener('click', selectFile);
backFileButton?.addEventListener('click', () => {
  homePage.hidden = false;
  editorPage.hidden = true;
})

