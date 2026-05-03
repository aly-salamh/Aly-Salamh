import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import OffersBar from './OffersBar';
import ChatWidget from '../ui/ChatWidget';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white selection:bg-brand-red selection:text-white">
      <OffersBar />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <ChatWidget />
      <Footer />
    </div>
  );
}
