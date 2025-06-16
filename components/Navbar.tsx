
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Page } from '../types';
import { APP_NAME, ICONS } from '../constants';

const NavItem: React.FC<{ to: string; children: React.ReactNode; icon: React.ReactNode; isMobile?: boolean }> = ({ to, children, icon, isMobile }) => {
  const baseClasses = `flex items-center text-sm transition-colors rounded-md ${isMobile ? 'px-3 py-3' : 'px-3 py-2'}`; // Increased mobile padding
  const activeClasses = "bg-pf-green text-white font-semibold"; // Added font-semibold
  const inactiveClasses = "text-pf-text-secondary hover:bg-green-100 hover:text-pf-green-dark font-medium";

  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <span className="mr-3 w-5 h-5">{icon}</span> {/* Standardized icon margin */}
      {children}
    </NavLink>
  );
};


const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { name: Page.Dashboard, path: `/${Page.Dashboard.toLowerCase().replace(/\s+/g, '-')}`, icon: <ICONS.Dashboard className="w-5 h-5"/> },
    { name: Page.Chickens, path: `/${Page.Chickens.toLowerCase().replace(/\s+/g, '-')}`, icon: <ICONS.Chicken className="w-5 h-5"/> },
    { name: Page.Incubation, path: `/${Page.Incubation.toLowerCase().replace(/\s+/g, '-')}`, icon: <ICONS.Incubation className="w-5 h-5"/> },
    { name: Page.Eggs, path: `/${Page.Eggs.toLowerCase().replace(/\s+/g, '-')}`, icon: <ICONS.Egg className="w-5 h-5"/> },
    { name: Page.FoodLog, path: `/${Page.FoodLog.toLowerCase().replace(/\s+/g, '-')}`, icon: <ICONS.FoodLog className="w-5 h-5"/> },
    { name: Page.FeedCalculator, path: `/${Page.FeedCalculator.toLowerCase().replace(/\s+/g, '-')}`, icon: <ICONS.Calculator className="w-5 h-5"/> },
    { name: Page.Inventory, path: `/${Page.Inventory.toLowerCase().replace(/\s+/g, '-')}`, icon: <ICONS.Inventory className="w-5 h-5"/> },
    { name: Page.Financials, path: `/${Page.Financials.toLowerCase().replace(/\s+/g, '-')}`, icon: <ICONS.Financials className="w-5 h-5"/> },
    { name: Page.Tasks, path: `/${Page.Tasks.toLowerCase().replace(/\s+/g, '-')}`, icon: <ICONS.Tasks className="w-5 h-5"/> },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/" className="font-bold text-2xl text-pf-gold">{APP_NAME}</NavLink>
          </div>
          <div className="hidden md:flex items-baseline space-x-2">
              {navLinks.map((link) => (
                <NavItem key={link.name} to={link.path} icon={link.icon}>
                  {link.name}
                </NavItem>
              ))}
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-pf-text-secondary hover:text-pf-green hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pf-green"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <ICONS.Close className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
       
       <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200`} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
             <NavItem key={link.name} to={link.path} icon={link.icon} isMobile={true}>
              {link.name}
            </NavItem>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;