import { ChangeEvent, useRef, useState } from 'react';
import getLabel from '../Locale/GetLabel';
import AppSettings from '../Model/AppSettings';
import { isLobbyOwner, SceneState } from '../Model/SceneState';
import { BangConnection } from '../Model/UseBangConnection';
import { DEFAULT_USER_PROPIC } from '../Scenes/Lobby/LobbyUser';
import { loadFile, PROPIC_SIZE, serializeImage } from '../Utils/ImageSerial';
import useCloseOnLoseFocus from '../Utils/UseCloseOnLoseFocus';
import UserMenu, { UserMenuItem } from './UserMenu';
import { AboutMenu, AboutMenuItem } from './AboutMenu';
import PDFViewer from './PDFViewer';

export interface HeaderProps {
  scene: SceneState;
  settings: AppSettings;
  connection: BangConnection;
}

function Header({ scene, settings, connection }: HeaderProps) {
  const inputFile = useRef<HTMLInputElement>(null);

  const [pdfFile, setPdfFile] = useState<string | null>(null);
  
  const [isMenuOpen, setIsMenuOpen, menuRef] = useCloseOnLoseFocus<HTMLDivElement>();
  const [isAboutMenuOpen, setIsAboutMenuOpen, AboutMenuRef] = useCloseOnLoseFocus<HTMLDivElement>();

  const handleSetUsername = (username?: string) => {
    settings.setUsername(username);
    connection.sendMessage({ user_set_name: username ?? '' });
  };

  const handleClickPropic = () => inputFile.current?.click();

  const handleLeaveLobby = () => connection.sendMessage({ lobby_leave: {}});
  const handleReturnLobby = () => connection.sendMessage({ lobby_return: {}});

  const myUser = scene.type === 'lobby' ? scene.lobbyState.users.find(user => user.user_id === scene.lobbyState.myUserId) : undefined;
  const isSpectator = myUser?.flags.includes('spectator') ?? false;
  const handleToggleSpectate = () => connection.sendMessage({ user_spectate: !isSpectator });

  const handleDisconnect = () => {
    settings.setSessionId(undefined);
    connection.disconnect();
  };

  const handlePropicChange = async (event: ChangeEvent<HTMLInputElement>) => {
    let file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const propic = await loadFile(file);
      const image = await serializeImage(propic, PROPIC_SIZE);
      settings.setPropic(propic);
      connection.sendMessage({ user_set_propic: image });
    }
  };

  const handleToggleSounds = () => {
    settings.setMuteSounds(value => !value);
  };

  const closeMenuAnd = (fn: () => void) => {
    return () => {
      setIsMenuOpen(false);
      fn();
    };
  };

  const handleAboutMenuItemClick = (href: string) => {
    setPdfFile(href);
    setIsAboutMenuOpen(false);
  };

  return (
    <nav className="border-gray-200 bg-gray-900">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-1.5 md:p-4">
        <div className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white"><img src='/media/smallbang.png' alt="" /></span>
        </div>
        { (scene.type === 'lobby' || scene.type === 'game') && <div className="text-blue-500 font-medium whitespace-nowrap overflow-x-hidden text-ellipsis">
          { scene.lobbyName }
        </div>}
        <div className="flex items-center">
          <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-600">
            <span className="sr-only">Open user menu</span>
            <div className='w-8 h-8 grid place-items-center' onClick={handleClickPropic}>
              <img className="max-w-8 max-h-8" src={settings.propic ?? DEFAULT_USER_PROPIC} alt="" />
            </div>
            <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={handlePropicChange} />
          </button>
          { scene.type !== 'loading' && <div className='flex relative' ref={AboutMenuRef}>
            <button
              onClick={() => setIsAboutMenuOpen(value => !value)}
              type="button" className="inline-flex items-center p-0.5 md:p-2 ml-1 text-sm rounded-lg focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600">
              <span className="sr-only">Open about menu</span>
              <svg className="w-6 h-6 align-middle relative top-[-3px] left-[-2px]" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12 4C9.243 4 7 6.243 7 9h2c0-1.654 1.346-3 3-3s3 1.346 3 3c0 1.069-.454 1.465-1.481 2.255-.382.294-.813.626-1.226 1.038C10.981 13.604 10.995 14.897 11 15v2h2v-2.009c0-.024.023-.601.707-1.284.32-.32.682-.598 1.031-.867C15.798 12.024 17 11.1 17 9c0-2.757-2.243-5-5-5zm-1 14h2v2h-2z" clipRule="evenodd"></path></svg>
            </button>
          { isAboutMenuOpen &&
            <AboutMenu>
              <AboutMenuItem href="#" onClick={handleAboutMenuItemClick}>{getLabel('ui', 'ABOUT_MENU_ABOUT')}</AboutMenuItem>
              <AboutMenuItem href="/documents/bangpressrelease-fairusage-eng.pdf" onClick={handleAboutMenuItemClick}>{getLabel('ui', 'ABOUT_MENU_DISCLAIMER')}</AboutMenuItem>
            </AboutMenu> }
          </div>}
          { scene.type !== 'home' && scene.type !== 'loading' && <div className='flex relative' ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(value => !value)}
            type="button" className="inline-flex items-center p-0.5 md:p-2 ml-1 text-sm rounded-lg focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600">
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6 align-middle" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
          </button>
          { isMenuOpen &&
            <UserMenu username={settings.username} setUsername={handleSetUsername}>
              <UserMenuItem onClick={handleToggleSounds}>{getLabel('ui', settings.muteSounds ? 'BUTTON_ENABLE_SOUNDS' : 'BUTTON_DISABLE_SOUNDS')}</UserMenuItem>
              { scene.type === 'game' && isLobbyOwner(scene.lobbyState) && <UserMenuItem onClick={closeMenuAnd(handleReturnLobby)}>{getLabel('ui', 'BUTTON_RETURN_LOBBY')}</UserMenuItem>}
              { scene.type === 'lobby' && <UserMenuItem onClick={handleToggleSpectate}>{getLabel('ui', isSpectator ? 'BUTTON_SPECTATE_OFF' : 'BUTTON_SPECTATE_ON')}</UserMenuItem> }
              { scene.type === 'game' || scene.type === 'lobby'
                ? <UserMenuItem onClick={closeMenuAnd(handleLeaveLobby)}>{getLabel('ui', 'BUTTON_LEAVE_LOBBY')}</UserMenuItem>
                : <UserMenuItem onClick={closeMenuAnd(handleDisconnect)}>{getLabel('ui', 'BUTTON_DISCONNECT')}</UserMenuItem> }
            </UserMenu> }
          </div>}
        </div>
      </div>
      {pdfFile && <PDFViewer file={pdfFile} onClose={() => setPdfFile(null)} />}
    </nav>
  )
}

export default Header