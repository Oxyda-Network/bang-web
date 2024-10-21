import { SyntheticEvent } from 'react';
import Button from '../../Components/Button';
import getLabel from '../../Locale/GetLabel';
import BangLogo from '../../Components/BangLogo';
import { MAX_USERNAME_LENGTH } from '../../Model/AppSettings';

export interface ConnectProps {
  username?: string;
  setUsername: (value: string) => void;
  handleConnect: () => void;
}

export default function HomeScene({ username, setUsername, handleConnect }: ConnectProps) {
  const handleConnectEvent = function(event: SyntheticEvent) {
    event.preventDefault();
    if (username) {
      handleConnect();
    }
  };

  return <div className="flex flex-col items-center">
    <div className='flex flex-col items-center mb-4'>
      <BangLogo />
      <ul className='text-xl font-bold text-center mb-2'>
        {getLabel('ui', 'APP_WELCOME').split('\n').map((line, i) => <li key={i}>{line}</li>)}
      </ul>
      <ul className='text-xl font-bold text-center mb-2'>
        <br />
    </ul>
    </div>
    <form onSubmit={handleConnectEvent} className="flex flex-col items-center">
    <label htmlFor="username" className="font-bold text-xl">{getLabel('ui', 'LABEL_USERNAME')}</label>
    <input
      className="
      border-2
      border-gray-300
      rounded-md
      p-2
      w-64
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
      m-2
      "
      type="text"
      id="username"
      value={username}
      maxLength={MAX_USERNAME_LENGTH}
      onChange={e => setUsername(e.target.value)}
    />
    <Button type="submit" color="green">{getLabel('ui', 'BUTTON_CONNECT')}</Button>
  </form>
  <div className='flex flex-col items-center mb-4'>
      <ul className='text-l font-bold text-center mb-2'>
        <br /><br />
      </ul>
      <ul className='text-l font-bold text-center mb-2'>
        {getLabel('ui', 'DISCLAIMER').split('\n').map((line, i) => <li key={i}>{line}</li>)}
      </ul>
    </div>
  </div>
}