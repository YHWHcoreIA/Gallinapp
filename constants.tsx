import React from 'react';
import { ChickenTypeForCalc, FeedTypeForCalc, FeedConsumptionRule, Currency } from './types';

export const APP_NAME = "Granjas NG";

export const ICONS = {
  Plus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  Edit: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  ),
  Delete: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.24.032 3.22.096m4.945 4.057L18 9m-9 9a2.25 2.25 0 0 1-2.25-2.25v-1.5a2.25 2.25 0 0 1 2.25-2.25H15m-3 0h3" />
    </svg>
  ),
  Chicken: (props: React.SVGProps<SVGSVGElement>) => ( 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 19.5V13.5M12.75 13.5L16.5 9.75M12.75 13.5L9 9.75M12.75 19.5L9.75 21.75M12.75 19.5L15.75 21.75M9.75 15.75C9.75 14.231 10.981 13 12.5 13H13C14.519 13 15.75 14.231 15.75 15.75V17.25C15.75 18.769 14.519 20 13 20H12.5C10.981 20 9.75 18.769 9.75 17.25V15.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 9C7.5 5.68629 10.1863 3 13.5 3C16.8137 3 19.5 5.68629 19.5 9C19.5 10.2855 19.0352 11.4536 18.2435 12.3333M15.5 4.5C15.5 4.5 15 5.5 14.5 6C14 6.5 13.5 6.5 13.5 6.5" />
    </svg>
  ),
  Egg: (props: React.SVGProps<SVGSVGElement>) => ( 
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1.677c-3.866 0-7 3.49-7 7.794 0 4.303 2.583 8.529 7 8.529s7-4.226 7-8.529c0-4.304-3.134-7.794-7-7.794z" />
    </svg>
  ),
  Tasks: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Dashboard: (props: React.SVGProps<SVGSVGElement>) => (
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  Sparkles: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 14.188l-1.25-2.188L13.5 12l2.25-1.188L17 8.625l1.25 2.188L20.5 12l-2.25 1.188zM9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
    </svg>
  ),
  Close: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Calculator: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-4.5 .75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm0 2.25h.008v.008h-.008v-.008ZM12 15.75h.008v.008H12v-.008Zm0 2.25h.008v.008H12v-.008Zm0 2.25h.008v.008H12v-.008Zm3.75-6h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm-15-3.75a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" />
    </svg>
  ),
  FoodLog: (props: React.SVGProps<SVGSVGElement>) => ( // Icon resembling a sack or bag of feed
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H5.506c-.67 0-1.19-.578-1.119-1.243l1.263-12a1.875 1.875 0 011.875-1.625h7.5c.796 0 1.503.456 1.875 1.625z" />
    </svg>
  ),
  Incubation: (props: React.SVGProps<SVGSVGElement>) => ( // Simplified: Nest with eggs or a single egg with a crack
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25C21.75 18.0242 21.4469 18.7648 20.9041 19.3077C20.3612 19.8505 19.6207 20.1538 18.8462 20.1538H5.15385C4.37932 20.1538 3.63882 19.8505 3.09594 19.3077C2.55306 18.7648 2.25 18.0242 2.25 17.25C2.25 14.5038 6.81154 12.75 12 12.75C17.1885 12.75 21.75 14.5038 21.75 17.25Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75C10.2731 12.75 8.75 11.2269 8.75 9.5C8.75 7.77315 10.2731 6.25 12 6.25C13.7269 6.25 15.25 7.77315 15.25 9.5C15.25 11.2269 13.7269 12.75 12 12.75Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 15.75C10.5 15.1533 10.7371 14.581 11.159 14.159C11.581 13.7371 12.1533 13.5 12.75 13.5C13.3467 13.5 13.919 13.7371 14.341 14.159C14.7629 14.581 15 15.1533 15 15.75" />
    </svg>
  ),
  Inventory: (props: React.SVGProps<SVGSVGElement>) => (  // Icon resembling a box or crate
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10.5 11.25h3M10.5 11.25a2.25 2.25 0 00-2.25 2.25v2.25c0 1.24 1.01 2.25 2.25 2.25h3c1.24 0 2.25-1.01 2.25-2.25v-2.25a2.25 2.25 0 00-2.25-2.25M3.75 7.5h16.5M12 3.75L7.5 7.5h9L12 3.75z" />
    </svg>
  ),
  Financials: (props: React.SVGProps<SVGSVGElement>) => ( // Icon resembling a wallet or ledger
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  ),
  Download: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  ),
};

export const CURRENCY_DETAILS: { [key in Currency]: { name: string; symbol: string; code: Currency } } = {
  [Currency.USD]: { name: 'Dólar Estadounidense', symbol: '$', code: Currency.USD },
  [Currency.EUR]: { name: 'Euros', symbol: '€', code: Currency.EUR },
  [Currency.VES]: { name: 'Bolívares Soberanos', symbol: 'Bs.', code: Currency.VES },
  [Currency.CNY]: { name: 'Yuan Chino', symbol: '¥', code: Currency.CNY },
  [Currency.RUB]: { name: 'Rublo Ruso', symbol: '₽', code: Currency.RUB },
  [Currency.PES]: { name: 'Pesos (General)', symbol: '$', code: Currency.PES },
  [Currency.YHWHC]: { name: 'YHWHcoin (TRC20)', symbol: 'YHWHC', code: Currency.YHWHC },
  [Currency.MANQ]: { name: 'MAN (YHWH.qt)', symbol: 'MANQ', code: Currency.MANQ },
};


export const FEED_CONSUMPTION_RULES: FeedConsumptionRule[] = [
  // Ponedoras
  { id: 'L06S', chickenType: ChickenTypeForCalc.Laying, ageGroupDescription: 'Pollitos (0-6 semanas)', feedType: FeedTypeForCalc.Starter, avgConsumption: { min: 10, max: 30 }, unit: 'g/día', notes: '10-30g/día' },
  { id: 'L618G', chickenType: ChickenTypeForCalc.Laying, ageGroupDescription: 'Juveniles/Crecimiento (6-18 semanas)', feedType: FeedTypeForCalc.Grower, avgConsumption: { min: 30, max: 70 }, unit: 'g/día', notes: '30-70g/día' },
  { id: 'L18AL', chickenType: ChickenTypeForCalc.Laying, ageGroupDescription: 'Adultos/Puesta (>18 semanas)', feedType: FeedTypeForCalc.Layer, avgConsumption: { min: 100, max: 120 }, unit: 'g/día', notes: '100-120g/día' },
  // Engorde
  { id: 'B03S', chickenType: ChickenTypeForCalc.Broiler, ageGroupDescription: 'Pollitos (0-3 semanas)', feedType: FeedTypeForCalc.Starter, avgConsumption: { min: 20, max: 60 }, unit: 'g/día', notes: '20-60g/día' },
  { id: 'B36G', chickenType: ChickenTypeForCalc.Broiler, ageGroupDescription: 'Crecimiento (3-6 semanas)', feedType: FeedTypeForCalc.Grower, avgConsumption: { min: 80, max: 150 }, unit: 'g/día', notes: '80-150g/día' },
  { id: 'B6AF', chickenType: ChickenTypeForCalc.Broiler, ageGroupDescription: 'Acabado (>6 semanas)', feedType: FeedTypeForCalc.Finisher, avgConsumption: 160, unit: 'g/día', notes: 'Aprox. 150-180g+/día (usando 160g como referencia media)' },
  // Mixtas
  { id: 'MGEN', chickenType: ChickenTypeForCalc.Mixed, ageGroupDescription: 'Promedio General (Todas las Etapas)', feedType: FeedTypeForCalc.GeneralPurpose, avgConsumption: { min: 70, max: 100 }, unit: 'g/día', notes: '70-100g/día (promedio para parvada mixta)' },
];