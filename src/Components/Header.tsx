import { ChangeEvent, useRef } from 'react';
import getLabel from '../Locale/GetLabel';
import AppSettings from '../Model/AppSettings';
import { isLobbyOwner, SceneState } from '../Model/SceneState';
import { BangConnection } from '../Model/UseBangConnection';
import { DEFAULT_USER_PROPIC } from '../Scenes/Lobby/LobbyUser';
import { loadFile, PROPIC_SIZE, serializeImage } from '../Utils/ImageSerial';
import useCloseOnLoseFocus from '../Utils/UseCloseOnLoseFocus';
import UserMenu, { UserMenuItem } from './UserMenu';

export interface HeaderProps {
  scene: SceneState;
  settings: AppSettings;
  connection: BangConnection;
}

function Header({ scene, settings, connection }: HeaderProps) {
  const inputFile = useRef<HTMLInputElement>(null);
  
  const [isMenuOpen, setIsMenuOpen, menuRef] = useCloseOnLoseFocus<HTMLDivElement>();

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

  return (
    <nav className="border-gray-200 bg-gray-900">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-1.5 md:p-4">
        <div className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white"><img src='/media/smallbang.png'></img></span>
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

          { scene.type !== 'home' && scene.type !== 'loading' && <div className='flex relative' ref={menuRef}>
          <button
            onClick={() => setIsCopyrightMenuOpen(value => !value)}
            type="button" className="inline-flex items-center p-0.5 md:p-2 ml-1 text-sm rounded-lg focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600">
            <span className="sr-only">Open copyright menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M80 160c0-35.3 28.7-64 64-64l32 0c35.3 0 64 28.7 64 64l0 3.6c0 21.8-11.1 42.1-29.4 53.8l-42.2 27.1c-25.2 16.2-40.4 44.1-40.4 74l0 1.4c0 17.7 14.3 32 32 32s32-14.3 32-32l0-1.4c0-8.2 4.2-15.8 11-20.2l42.2-27.1c36.6-23.6 58.8-64.1 58.8-107.7l0-3.6c0-70.7-57.3-128-128-128l-32 0C73.3 32 16 89.3 16 160c0 17.7 14.3 32 32 32s32-14.3 32-32zm80 320a40 40 0 1 0 0-80 40 40 0 1 0 0 80z"/></svg>
          </button>
          <button
            onClick={() => setIsMenuOpen(value => !value)}
            type="button" className="inline-flex items-center p-0.5 md:p-2 ml-1 text-sm rounded-lg focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600">
            <span className="sr-only">Open main menu</span>
            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
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
    </nav>
  )
}

export default Header