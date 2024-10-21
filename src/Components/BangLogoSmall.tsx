import './Style/BangLogo.css';
import getLabel from "../Locale/GetLabel";

export default function BangLogoSmall() {
    return <img className='bang-logo' src='logo64.png' alt={getLabel('ui', 'APP_TITLE')} />
}