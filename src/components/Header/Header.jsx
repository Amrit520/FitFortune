import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import ProfileMenu from './ProfileMenu';
import LogoSVG from '../common/LogoSVG';

const Header = () => {
    const { user, isAuthenticated } = useAuth();
    
    return (
        <nav className="flex-between h-[10vh] border-b-[1px] px-8">
            <NavLink to="/" >
                <div className="nav_logo flex-center gap-2 cursor-pointer">
                    <h3 className="font-bold text-2xl">Fit<br className='m-0' />Fortune</h3>
                    <LogoSVG width={80} height={80} />
                </div>
            </NavLink>
            <ul className="nav_links flex-between w-[56%]">
                <li className='text-lg text-gray-600 font-semibold hover:text-green-500 transition-colors'>
                    <NavLink to="/meal-planner" className={({isActive}) => isActive ? "text-green-500 font-bold" : ""}>
                        Meal Plans
                    </NavLink>
                </li>
                <li className='text-lg text-gray-600 font-semibold hover:text-green-500 transition-colors'>
                    <NavLink to="/nutrition-tracker" className={({isActive}) => isActive ? "text-green-500 font-bold" : ""}>
                        Nutrition
                    </NavLink>
                </li>
                <li className='text-lg text-gray-600 font-semibold hover:text-green-500 transition-colors'>
                    <NavLink to="/recipes" className={({isActive}) => isActive ? "text-green-500 font-bold" : ""}>
                        Recipes
                    </NavLink>
                </li>
                <li className='text-lg text-gray-600 font-semibold hover:text-green-500 transition-colors'>
                    <NavLink to="/workout" className={({isActive}) => isActive ? "text-green-500 font-bold" : ""}>
                        Workouts
                    </NavLink>
                </li>
                <li className='text-lg text-gray-600 font-semibold hover:text-green-500 transition-colors'>
                    <NavLink to="/checkup" className={({isActive}) => isActive ? "text-green-500 font-bold" : ""}>
                        Checkup
                    </NavLink>
                </li>
                <li className='text-lg text-gray-600 font-semibold hover:text-green-500 transition-colors'>
                    <NavLink to="/community" className={({isActive}) => isActive ? "text-green-500 font-bold" : ""}>
                        Community
                    </NavLink>
                </li>
                <li className='text-lg text-gray-600 font-semibold hover:text-green-500 transition-colors'>
                    <NavLink to="/nft-mint" className={({isActive}) => isActive ? "text-green-500 font-bold" : ""}>
                        NFT Challenge 
                    </NavLink>
                </li>
            </ul>
            <div className="nav_auth text-xl">
                {isAuthenticated ? (
                    <ProfileMenu />
                ) : (
                    <>
                        <button className='cursor-pointer hover:scale-110 transition-transform rounded-full px-5 py-2 text-gray-600 font-semibold mr-2'>
                            <NavLink to="/login">
                                Log In
                            </NavLink>
                        </button>
                        <button className='cursor-pointer hover:scale-110 transition-transform border-[1px] border-green-500 rounded-full px-5 py-2 text-gray-600 hover:bg-green-500 hover:text-white font-semibold'>
                            <NavLink to="/signup">
                                Sign Up
                            </NavLink>
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Header;